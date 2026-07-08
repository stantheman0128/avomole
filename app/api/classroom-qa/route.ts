// app/api/classroom-qa/route.ts —— 課堂知識庫問答端點。
// POST { question, courseContext, lang } → { answer, offline? }
// 有 GEMINI_API_KEY 且題目與 context 都在，走 Gemini（只依 courseContext 回答）；任何錯誤退罐頭；
// 無 key 或缺題目直接罐頭（offline:true）。防刷：同 IP 每分鐘 10 次。
import { NextResponse } from 'next/server';
import classroom from '@/data/classroom.json';
import {
  geminiClassroomQA,
  cannedClassroomAnswer,
  type QaPreset,
} from '@/lib/gemini-knowledge';
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

function parseBody(body: unknown): { question: string; courseContext: string; lang: Lang } {
  const b = (body ?? {}) as { question?: unknown; courseContext?: unknown; lang?: unknown };
  const question = typeof b.question === 'string' ? b.question.trim().slice(0, 500) : '';
  const courseContext =
    typeof b.courseContext === 'string' ? b.courseContext.trim().slice(0, 4000) : '';
  const lang: Lang = b.lang === 'en' ? 'en' : 'zh';
  return { question, courseContext, lang };
}

const PRESETS = classroom.knowledgeQA.presets as QaPreset[];

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
  const { question, courseContext, lang } = parseBody(body);

  let answer: string;
  let offline = false;

  if (question && courseContext && process.env.GEMINI_API_KEY) {
    try {
      answer = await geminiClassroomQA(question, courseContext, lang);
    } catch {
      answer = cannedClassroomAnswer(question, PRESETS, lang);
      offline = true;
    }
  } else {
    answer = cannedClassroomAnswer(question, PRESETS, lang);
    offline = true;
  }

  return NextResponse.json({ answer, ...(offline ? { offline: true } : {}) });
}
