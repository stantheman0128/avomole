// app/api/compare/route.ts —— 講師並排比較 AI 短評端點。
// POST { a, b, lang } (a/b = slug) → { blurb, offline? }
// 有 GEMINI_API_KEY 走 Gemini，任何錯誤退罐頭；無 key 直接罐頭（offline:true）。
// 【鐵則】回應只含 blurb 字串，不含 hiddenScore。防刷：同 IP 每分鐘 10 次。
import { NextResponse } from 'next/server';
import { getTutors } from '@/lib/db';
import { geminiCompareBlurb, cannedCompareBlurb } from '@/lib/gemini-features';
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

function parseBody(body: unknown): { a: string; b: string; lang: Lang } {
  const bd = (body ?? {}) as { a?: unknown; b?: unknown; lang?: unknown };
  const a = typeof bd.a === 'string' ? bd.a : '';
  const b = typeof bd.b === 'string' ? bd.b : '';
  const lang: Lang = bd.lang === 'en' ? 'en' : 'zh';
  return { a, b, lang };
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
  const { a, b, lang } = parseBody(body);

  const tutors = await getTutors(); // server：含 hiddenScore 供 prompt
  const ta = tutors.find((t) => t.slug === a);
  const tb = tutors.find((t) => t.slug === b);
  if (!ta || !tb || ta.slug === tb.slug) {
    return NextResponse.json({ error: 'invalid_pair' }, { status: 400 });
  }

  let blurb: string;
  let offline = false;

  if (process.env.GEMINI_API_KEY) {
    try {
      blurb = await geminiCompareBlurb(ta, tb, lang);
    } catch {
      blurb = cannedCompareBlurb(ta, tb, lang);
      offline = true;
    }
  } else {
    blurb = cannedCompareBlurb(ta, tb, lang);
    offline = true;
  }

  return NextResponse.json({ blurb, ...(offline ? { offline: true } : {}) });
}
