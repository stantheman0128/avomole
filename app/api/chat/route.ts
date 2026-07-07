// app/api/chat/route.ts —— AI 媒合端點。
// POST { messages: {role,content}[] } → { reply, recommendations:[{slug,reason}], offline? }
// 有 GEMINI_API_KEY 走 Gemini，任何錯誤退罐頭；無 key 直接罐頭（offline:true）。
// 【鐵則】回應絕不含 hiddenScore；每個 slug 都驗證存在於 tutors。
import { NextResponse } from 'next/server';
import { getTutors } from '@/lib/db';
import { cannedMatch } from '@/lib/canned-match';
import { geminiMatch, type ChatMessage } from '@/lib/gemini';
import type { MatchResult } from '@/lib/canned-match';

export const dynamic = 'force-dynamic';

// ---- 防刷：同 IP 每分鐘 10 次（模組層記憶體 Map，單容器夠用）----
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

function parseMessages(body: unknown): ChatMessage[] {
  if (!body || typeof body !== 'object') return [];
  const raw = (body as { messages?: unknown }).messages;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((m) => m as { role?: unknown; content?: unknown })
    .filter(
      (m) =>
        (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim(),
    )
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content as string }));
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
  const messages = parseMessages(body);
  const lastUserText = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';

  const tutors = getTutors(); // server：含 hiddenScore 供排序／prompt
  const slugSet = new Set(tutors.map((t) => t.slug));

  let result: MatchResult;
  let offline = false;

  if (process.env.GEMINI_API_KEY) {
    try {
      result = await geminiMatch(messages, tutors);
    } catch {
      result = cannedMatch(lastUserText, tutors);
      offline = true;
    }
  } else {
    result = cannedMatch(lastUserText, tutors);
    offline = true;
  }

  // 濾掉不存在的 slug（模型可能幻覺）。
  const recommendations = result.recommendations.filter((r) => slugSet.has(r.slug));

  return NextResponse.json({
    reply: result.reply,
    recommendations,
    ...(offline ? { offline: true } : {}),
  });
}
