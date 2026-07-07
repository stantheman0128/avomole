// app/api/learning-path/route.ts —— 學習路徑規劃端點。
// POST { goal, level, lang } → { stages:[{title,learn,domain}], offline? }
// 有 GEMINI_API_KEY 走 Gemini，任何錯誤退罐頭；無 key 直接罐頭（offline:true）。
// 【鐵則】回應不含 hiddenScore（stages 只帶 title/learn/domain）。防刷：同 IP 每分鐘 10 次。
import { NextResponse } from 'next/server';
import { getTutors } from '@/lib/db';
import { geminiLearningPath, cannedLearningPath, type PathStage } from '@/lib/gemini-features';
import type { Lang } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

const LEVELS = new Set(['beginner', 'intermediate', 'advanced']);

function parseBody(body: unknown): { goal: string; level: string; lang: Lang } {
  const b = (body ?? {}) as { goal?: unknown; level?: unknown; lang?: unknown };
  const goal = typeof b.goal === 'string' ? b.goal.trim().slice(0, 500) : '';
  const level = typeof b.level === 'string' && LEVELS.has(b.level) ? b.level : 'beginner';
  const lang: Lang = b.lang === 'en' ? 'en' : 'zh';
  return { goal, level, lang };
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = null;
  }
  const { goal, level, lang } = parseBody(body);

  const tutors = await getTutors(); // server：含 hiddenScore 供排序／prompt

  let stages: PathStage[];
  let offline = false;

  if (goal && process.env.GEMINI_API_KEY) {
    try {
      stages = await geminiLearningPath(goal, level, lang, tutors);
    } catch {
      stages = cannedLearningPath(lang);
      offline = true;
    }
  } else {
    stages = cannedLearningPath(lang);
    offline = true;
  }

  return NextResponse.json({ stages, ...(offline ? { offline: true } : {}) });
}
