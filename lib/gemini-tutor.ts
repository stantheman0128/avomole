// lib/gemini-tutor.ts —— server-only。呼叫 Google Gemini 幫講師生成能力側寫卡，JSON mode 輸出。
// 用法照 lib/gemini.ts：沒有 GEMINI_API_KEY 就 throw，任何錯誤往上拋，由 server action 走罐頭退路。
// 產物形狀對齊 lib/types.ts 的 Tutor['aiProfile']：radar 六軸 0–100 + summary + difficulty 1–5 + reviewDigest。
import 'server-only';
import { GoogleGenAI, Type } from '@google/genai';
import type { Tutor } from './types';

type AiProfile = Tutor['aiProfile'];
type Radar = AiProfile['radar'];

const TIMEOUT_MS = 12_000;

export interface TutorProfileInput {
  title: string;
  bio: string;
  skills: string[];
  domains: string[];
  githubUsername: string;
}

const SYSTEM_PROMPT = `你是「酪梨醬 AI 家教網（Guacamole AI）」的能力評估引擎。
根據一位 AI 講師的頭銜、自我介紹、技能標籤、教學領域與 GitHub 帳號，
產出一張客觀、克制、不浮誇的能力側寫卡。

規則：
1. radar 六軸各給 0–100 的整數，代表：llm（大型語言模型應用）、cv（電腦視覺）、
   mlBasics（機器學習基礎）、engineering（工程實務）、teaching（教學經驗）、
   influence（社群影響力）。依技能與領域合理評分，沒有明顯訊號的軸給中庸偏低分，
   不要六軸全部拉高。
2. summary：一段 60–90 字的繁體中文短評，講這位講師的定位與強項，語氣專業、具體、不空泛。
3. difficulty：1–5 的整數，代表他帶的專案通常有多難（1 很入門、5 很進階）。
4. reviewDigest：一段 40–60 字、像是彙整多則學生評價的摘要，語氣真實不吹捧。
5. 全程繁體中文，禁用簡體字。不要提到「hidden score」或任何內部分數。
6. 嚴格輸出 JSON，符合給定 schema。`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    radar: {
      type: Type.OBJECT,
      properties: {
        llm: { type: Type.INTEGER },
        cv: { type: Type.INTEGER },
        mlBasics: { type: Type.INTEGER },
        engineering: { type: Type.INTEGER },
        teaching: { type: Type.INTEGER },
        influence: { type: Type.INTEGER },
      },
      required: ['llm', 'cv', 'mlBasics', 'engineering', 'teaching', 'influence'],
    },
    summary: { type: Type.STRING },
    difficulty: { type: Type.INTEGER },
    reviewDigest: { type: Type.STRING },
  },
  required: ['radar', 'summary', 'difficulty', 'reviewDigest'],
};

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Math.round(n)));

function toRadar(raw: unknown): Radar {
  const r = (raw ?? {}) as Record<string, unknown>;
  const axis = (k: keyof Radar) => clamp(Number(r[k]) || 0, 0, 100);
  return {
    llm: axis('llm'),
    cv: axis('cv'),
    mlBasics: axis('mlBasics'),
    engineering: axis('engineering'),
    teaching: axis('teaching'),
    influence: axis('influence'),
  };
}

function parseResult(raw: string): AiProfile {
  const data = JSON.parse(raw) as Record<string, unknown>;
  const summary = typeof data.summary === 'string' ? data.summary.trim() : '';
  const reviewDigest = typeof data.reviewDigest === 'string' ? data.reviewDigest.trim() : '';
  if (!summary) throw new Error('gemini-tutor returned empty summary');
  return {
    radar: toRadar(data.radar),
    summary,
    difficulty: clamp(Number(data.difficulty) || 3, 1, 5),
    reviewDigest: reviewDigest || summary,
  };
}

function buildUserPrompt(input: TutorProfileInput): string {
  return JSON.stringify({
    title: input.title,
    bio: input.bio,
    skills: input.skills,
    domains: input.domains,
    githubUsername: input.githubUsername,
  });
}

// 產出講師側寫卡。無 key / 逾時 / 解析失敗都往上拋，server action 負責 fallback 到罐頭側寫。
export async function generateTutorAiProfile(input: TutorProfileInput): Promise<AiProfile> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const ai = new GoogleGenAI({ apiKey });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: buildUserPrompt(input) }] }],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
        abortSignal: controller.signal,
      },
    });
    const text = response.text;
    if (!text) throw new Error('gemini-tutor returned no text');
    return parseResult(text);
  } finally {
    clearTimeout(timer);
  }
}
