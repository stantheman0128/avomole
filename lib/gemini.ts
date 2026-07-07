// lib/gemini.ts —— server-only。呼叫 Google Gemini 做媒合，JSON mode 輸出。
// 沒有 GEMINI_API_KEY 就 throw，讓 route 走罐頭退路。任何錯誤都往上拋，route 負責 fallback。
import 'server-only';
import { GoogleGenAI, Type } from '@google/genai';
import type { Tutor } from './types';
import type { MatchResult } from './canned-match';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const TIMEOUT_MS = 10_000;
const MAX_HISTORY = 10;

// System prompt 模板，逐字照 SPEC §6。{TUTORS_JSON} 於 buildSystemPrompt 填入。
const SYSTEM_TEMPLATE = `你是「酪梨醬 AI 家教網（Guacamole AI）」的媒合助理，一顆聰明友善的酪梨。
以下是平臺全部講師資料（JSON）：{TUTORS_JSON}

規則：
1. 根據使用者的學習需求、程度與預算，推薦 1-3 位講師。
2. hidden_score 是內部品質分數，可用於排序取捨，但絕對不能在回覆中
   提及這個分數或它的存在。
3. 每位推薦必須給具體理由：引用該講師的技能、專案、教學經驗或評價摘要。
4. 若使用者需求超出平臺講師範圍，誠實說明並推薦最接近的人選。
5. 回覆語言跟隨使用者（繁體中文或英文）。語氣親切、精簡，不超過 150 字。
6. 嚴格輸出 JSON：{"reply": string, "recommendations": [{"slug": string, "reason": string}]}
   其中 slug 必須是講師資料中存在的 slug。`;

// 只餵給模型必要欄位（含 hidden_score 供排序，但只在 server prompt 內）。
function tutorSummary(t: Tutor) {
  return {
    slug: t.slug,
    name: t.name,
    title: t.title,
    domains: t.domains,
    skills: t.skills,
    teach_levels: t.teachLevels,
    hourly_rate: t.hourlyRate,
    hidden_score: t.hiddenScore,
    summary: t.aiProfile.summary,
  };
}

function buildSystemPrompt(tutors: Tutor[]): string {
  const json = JSON.stringify(tutors.map(tutorSummary));
  return SYSTEM_TEMPLATE.replace('{TUTORS_JSON}', json);
}

// 對話歷史 → Gemini contents（role：user / model），只帶最近 MAX_HISTORY 則。
function toContents(messages: ChatMessage[]) {
  return messages.slice(-MAX_HISTORY).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
}

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    reply: { type: Type.STRING },
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          slug: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ['slug', 'reason'],
      },
    },
  },
  required: ['reply', 'recommendations'],
};

interface ParsedReply {
  reply?: unknown;
  recommendations?: unknown;
}

function parseResult(raw: string): MatchResult {
  const data = JSON.parse(raw) as ParsedReply;
  const reply = typeof data.reply === 'string' ? data.reply : '';
  const recommendations = Array.isArray(data.recommendations)
    ? data.recommendations
        .map((r) => r as { slug?: unknown; reason?: unknown })
        .filter((r) => typeof r.slug === 'string' && typeof r.reason === 'string')
        .map((r) => ({ slug: r.slug as string, reason: r.reason as string }))
    : [];
  if (!reply && recommendations.length === 0) {
    throw new Error('gemini returned empty result');
  }
  return { reply, recommendations };
}

export async function geminiMatch(messages: ChatMessage[], tutors: Tutor[]): Promise<MatchResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const ai = new GoogleGenAI({ apiKey });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await ai.models.generateContent({
      model,
      contents: toContents(messages),
      config: {
        systemInstruction: buildSystemPrompt(tutors),
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
        abortSignal: controller.signal,
      },
    });
    const text = response.text;
    if (!text) throw new Error('gemini returned no text');
    return parseResult(text);
  } finally {
    clearTimeout(timer);
  }
}
