// app/api/syllabus/route.ts —— AI 課綱產生器端點。
// POST { topic, level, lang } → { title, weeks:[{n,title,points}], offline? }
// 有 GEMINI_API_KEY 走 Gemini，任何錯誤退罐頭；無 key 直接罐頭（offline:true）。
// 【鐵則】回應不含 hiddenScore（本端點根本不碰講師）。防刷：同 IP 每分鐘 10 次。
import { NextResponse } from 'next/server';
import { geminiSyllabus, cannedSyllabus, type Syllabus } from '@/lib/gemini-tools';
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

function parseBody(body: unknown): { topic: string; level: string; lang: Lang } {
  const b = (body ?? {}) as { topic?: unknown; level?: unknown; lang?: unknown };
  const topic = typeof b.topic === 'string' ? b.topic.trim().slice(0, 200) : '';
  const level = typeof b.level === 'string' && LEVELS.has(b.level) ? b.level : 'beginner';
  const lang: Lang = b.lang === 'en' ? 'en' : 'zh';
  return { topic, level, lang };
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
  const { topic, level, lang } = parseBody(body);

  let syllabus: Syllabus;
  let offline = false;

  if (topic && process.env.GEMINI_API_KEY) {
    try {
      syllabus = await geminiSyllabus(topic, level, lang);
    } catch {
      syllabus = cannedSyllabus(topic, level, lang);
      offline = true;
    }
  } else {
    syllabus = cannedSyllabus(topic, level, lang);
    offline = true;
  }

  return NextResponse.json({ ...syllabus, ...(offline ? { offline: true } : {}) });
}
