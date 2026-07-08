// app/api/pricing/route.ts —— 定價建議端點。
// POST { domain, skills, currentRate?, lang } → { low, high, reason, offline? }
// 有 GEMINI_API_KEY 走 Gemini，任何錯誤退罐頭；無 key 直接罐頭（offline:true）。
// 【鐵則】回應不含 hiddenScore（本端點不碰講師）。防刷：同 IP 每分鐘 10 次。
import { NextResponse } from 'next/server';
import { geminiPricing, cannedPricing, type PricingSuggestion } from '@/lib/gemini-tools';
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

// 六大領域，須與 lib/gemini-tools.ts DOMAINS 一致。
const DOMAINS = new Set(['LLM 應用', 'Agent 開發', '電腦視覺', 'MLOps', '資料科學', 'AI 入門']);

function parseBody(body: unknown): {
  domain: string;
  skills: string;
  currentRate?: number;
  lang: Lang;
} {
  const b = (body ?? {}) as {
    domain?: unknown;
    skills?: unknown;
    currentRate?: unknown;
    lang?: unknown;
  };
  const domain = typeof b.domain === 'string' && DOMAINS.has(b.domain) ? b.domain : 'AI 入門';
  const skills = typeof b.skills === 'string' ? b.skills.trim().slice(0, 300) : '';
  const rate =
    typeof b.currentRate === 'number' && Number.isFinite(b.currentRate) && b.currentRate > 0
      ? Math.round(b.currentRate)
      : undefined;
  const lang: Lang = b.lang === 'en' ? 'en' : 'zh';
  return { domain, skills, currentRate: rate, lang };
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
  const { domain, skills, currentRate, lang } = parseBody(body);

  let result: PricingSuggestion;
  let offline = false;

  if (skills && process.env.GEMINI_API_KEY) {
    try {
      result = await geminiPricing(domain, skills, lang, currentRate);
    } catch {
      result = cannedPricing(domain, lang);
      offline = true;
    }
  } else {
    result = cannedPricing(domain, lang);
    offline = true;
  }

  return NextResponse.json({ ...result, ...(offline ? { offline: true } : {}) });
}
