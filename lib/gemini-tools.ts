// lib/gemini-tools.ts —— server-only。兩個 AI 工具頁用到的 Gemini 呼叫，與 lib/gemini.ts 同一套 SDK 寫法。
// 課綱產生器 + 定價建議。沒有 GEMINI_API_KEY 或任何錯誤都 throw，讓 route 走罐頭退路。
// 【鐵則】回傳絕不含 hiddenScore；語言由呼叫端傳入的 lang 決定，route handler 沒有 useLang。
import 'server-only';
import { GoogleGenAI, Type } from '@google/genai';
import type { Lang } from './i18n';

const TIMEOUT_MS = 10_000;

// 六大領域字串，須與 lib/gemini-features.ts、data/tutors.json 完全一致。
const DOMAINS = ['LLM 應用', 'Agent 開發', '電腦視覺', 'MLOps', '資料科學', 'AI 入門'] as const;
export type Domain = (typeof DOMAINS)[number];

function client(): { ai: GoogleGenAI; model: string } {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  return { ai: new GoogleGenAI({ apiKey }), model };
}

const LEVEL_TEXT: Record<string, { zh: string; en: string }> = {
  beginner: { zh: '初階（幾乎沒基礎）', en: 'beginner (little to no background)' },
  intermediate: { zh: '中階（有些基礎）', en: 'intermediate (some background)' },
  advanced: { zh: '高階（已有相當經驗）', en: 'advanced (already experienced)' },
};

// ---- 課綱產生器 ----

export interface SyllabusWeek {
  n: number;
  title: string;
  points: string[];
}
export interface Syllabus {
  title: string;
  weeks: SyllabusWeek[];
}

const SYLLABUS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    weeks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          n: { type: Type.INTEGER },
          title: { type: Type.STRING },
          points: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['n', 'title', 'points'],
      },
    },
  },
  required: ['title', 'weeks'],
};

function syllabusSystemPrompt(lang: Lang): string {
  if (lang === 'en') {
    return `You are the syllabus generator for Guacamole AI, an AI tutoring platform.
Given a topic and a target level, design a course syllabus of 4 to 8 weekly units.
Return a course title, then the units in order from foundation to mastery.
Each unit has: a week number (starting at 1, sequential), a short unit title, and 2 to 4 bullet points on what that unit covers.
Match the depth to the target level. Keep every field concise and concrete. Reply in English.
Output strict JSON matching the schema.`;
  }
  return `你是「酪梨醬 AI 家教網」的課綱產生器。
根據一個主題與目標程度，設計一份 4 到 8 週（單元）的課程課綱。
先給課程標題，再依由淺入深的順序列出各單元。
每個單元包含：週次（從 1 開始、連續遞增）、一個簡短單元標題、以及 2 到 4 條說明該單元教什麼的重點。
深淺對齊目標程度。每個欄位都精簡具體。用繁體中文回覆。
嚴格輸出符合 schema 的 JSON。`;
}

function parseSyllabus(raw: string): Syllabus {
  const data = JSON.parse(raw) as { title?: unknown; weeks?: unknown };
  const title = typeof data.title === 'string' ? data.title.trim() : '';
  if (!Array.isArray(data.weeks)) throw new Error('gemini syllabus: no weeks');
  const weeks = data.weeks
    .map((w) => w as { n?: unknown; title?: unknown; points?: unknown })
    .filter(
      (w) =>
        typeof w.title === 'string' &&
        Array.isArray(w.points) &&
        w.points.some((p) => typeof p === 'string' && p.trim()),
    )
    .map((w, i) => ({
      n: typeof w.n === 'number' && w.n > 0 ? w.n : i + 1,
      title: w.title as string,
      points: (w.points as unknown[]).filter((p): p is string => typeof p === 'string' && !!p.trim()),
    }));
  if (!title || weeks.length === 0) throw new Error('gemini syllabus: empty after validation');
  return { title, weeks };
}

export async function geminiSyllabus(topic: string, level: string, lang: Lang): Promise<Syllabus> {
  const { ai, model } = client();
  const levelText = (LEVEL_TEXT[level] ?? LEVEL_TEXT.beginner)[lang];
  const userText =
    lang === 'en'
      ? `Topic: ${topic}\nTarget level: ${levelText}`
      : `主題：${topic}\n目標程度：${levelText}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: userText }] }],
      config: {
        systemInstruction: syllabusSystemPrompt(lang),
        responseMimeType: 'application/json',
        responseSchema: SYLLABUS_SCHEMA,
        abortSignal: controller.signal,
      },
    });
    const text = response.text;
    if (!text) throw new Error('gemini syllabus: no text');
    return parseSyllabus(text);
  } finally {
    clearTimeout(timer);
  }
}

// ---- 定價建議 ----

export interface PricingSuggestion {
  low: number;
  high: number;
  reason: string;
}

const PRICING_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    low: { type: Type.INTEGER },
    high: { type: Type.INTEGER },
    reason: { type: Type.STRING },
  },
  required: ['low', 'high', 'reason'],
};

function pricingSystemPrompt(lang: Lang): string {
  const domainList = DOMAINS.join(lang === 'en' ? ', ' : '、');
  if (lang === 'en') {
    return `You are the pricing advisor for Guacamole AI, an AI tutoring platform where tutors teach one of six domains: ${domainList}.
Given a tutor's domain, their skills/experience, and optionally the hourly rate they had in mind, suggest a reasonable hourly rate range in New Taiwan Dollars (NT$/hr).
Return "low" and "high" as integers (low < high), reflecting a sensible band for this profile against peers at the same level on this market.
Typical AI tutoring rates on this platform run roughly NT$600 to NT$2500 per hour; stay grounded in that range unless the profile is clearly exceptional.
Then write one short paragraph (2-3 sentences) explaining the range: what pushes it up or down, and how it compares to similar tutors. Reply in English.
Output strict JSON: {"low": int, "high": int, "reason": string}.`;
  }
  return `你是「酪梨醬 AI 家教網」的定價顧問，平臺講師教六大領域之一：${domainList}。
給你一位講師的領域、技能／年資，以及（可選的）他心裡想定的時薪，請建議一個合理的時薪區間（以新台幣 NT$/hr 計）。
回傳整數的「low」與「high」（low 小於 high），反映這個條件的講師對照同級行情該落在的合理帶。
本平臺 AI 家教時薪大約落在 NT$600 到 NT$2500，除非條件明顯突出，否則不要偏離這個範圍。
接著寫一段短理由（2 到 3 句）：說明什麼把價位往上或往下拉、跟相近講師比起來如何。用繁體中文回覆。
嚴格輸出 JSON：{"low": int, "high": int, "reason": string}。`;
}

function parsePricing(raw: string): PricingSuggestion {
  const data = JSON.parse(raw) as { low?: unknown; high?: unknown; reason?: unknown };
  const lowRaw = typeof data.low === 'number' ? data.low : NaN;
  const highRaw = typeof data.high === 'number' ? data.high : NaN;
  const reason = typeof data.reason === 'string' ? data.reason.trim() : '';
  if (!Number.isFinite(lowRaw) || !Number.isFinite(highRaw) || !reason) {
    throw new Error('gemini pricing: empty after validation');
  }
  // 保底：確保 low <= high、都取整、非負。
  const a = Math.max(0, Math.round(lowRaw));
  const b = Math.max(0, Math.round(highRaw));
  const low = Math.min(a, b);
  const high = Math.max(a, b);
  return { low, high, reason };
}

export async function geminiPricing(
  domain: string,
  skills: string,
  lang: Lang,
  currentRate?: number,
): Promise<PricingSuggestion> {
  const { ai, model } = client();
  const domainText = (DOMAINS as readonly string[]).includes(domain) ? domain : DOMAINS[5];
  const rateLine =
    typeof currentRate === 'number' && Number.isFinite(currentRate) && currentRate > 0
      ? lang === 'en'
        ? `\nRate they had in mind: NT$${Math.round(currentRate)}/hr`
        : `\n他心裡想定的時薪：NT$${Math.round(currentRate)}/hr`
      : '';
  const userText =
    lang === 'en'
      ? `Domain: ${domainText}\nSkills / experience: ${skills}${rateLine}`
      : `領域：${domainText}\n技能／年資：${skills}${rateLine}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: userText }] }],
      config: {
        systemInstruction: pricingSystemPrompt(lang),
        responseMimeType: 'application/json',
        responseSchema: PRICING_SCHEMA,
        abortSignal: controller.signal,
      },
    });
    const text = response.text;
    if (!text) throw new Error('gemini pricing: no text');
    return parsePricing(text);
  } finally {
    clearTimeout(timer);
  }
}

// ---- 罐頭退路（純函式，無 server-only 依賴；Gemini 失敗／無 key 時用）----

// 課綱罐頭：一份 6 週的 LLM 應用導向範例，雙語。
const CANNED_SYLLABUS: Record<Lang, Syllabus> = {
  zh: {
    title: 'LLM 應用實戰入門',
    weeks: [
      { n: 1, title: '打好底子', points: ['大語言模型在做什麼、能與不能', '把 Python 與開發環境準備好'] },
      { n: 2, title: 'Prompt 設計', points: ['指令、範例與角色設定的寫法', '常見的 prompt 陷阱與調校'] },
      { n: 3, title: '串接模型 API', points: ['呼叫 OpenAI／開源模型的基本流程', '處理逾時、重試與費用控制'] },
      { n: 4, title: '檢索增強（RAG）', points: ['文件切塊與向量檢索概念', '把檢索接到模型回答上'] },
      { n: 5, title: '評估與改良', points: ['怎麼判斷回答好不好', '用回饋迭代改進提示與流程'] },
      { n: 6, title: '做出小專案', points: ['整合成一個能用的問答應用', '簡單部署，分享給別人試用'] },
    ],
  },
  en: {
    title: 'Hands-on Intro to LLM Applications',
    weeks: [
      { n: 1, title: 'Get the basics', points: ['What large language models can and cannot do', 'Set up Python and your dev environment'] },
      { n: 2, title: 'Prompt design', points: ['Instructions, examples and role setup', 'Common prompt pitfalls and how to tune them'] },
      { n: 3, title: 'Call model APIs', points: ['The basic flow of calling OpenAI / open-source models', 'Handle timeouts, retries and cost control'] },
      { n: 4, title: 'Retrieval-augmented generation (RAG)', points: ['Document chunking and vector search concepts', 'Wire retrieval into model answers'] },
      { n: 5, title: 'Evaluate and improve', points: ['How to judge whether an answer is good', 'Iterate on prompts and flow using feedback'] },
      { n: 6, title: 'Build a small project', points: ['Assemble a working Q&A app', 'Deploy simply and let others try it'] },
    ],
  },
};

export function cannedSyllabus(_topic: string, _level: string, lang: Lang): Syllabus {
  return CANNED_SYLLABUS[lang];
}

// 定價罐頭：依領域給合理時薪區間＋一句理由。金額對照平臺行情帶。
const CANNED_PRICING: Record<string, { low: number; high: number }> = {
  'LLM 應用': { low: 1000, high: 2000 },
  'Agent 開發': { low: 1200, high: 2200 },
  電腦視覺: { low: 900, high: 1800 },
  MLOps: { low: 1100, high: 2100 },
  資料科學: { low: 800, high: 1600 },
  'AI 入門': { low: 600, high: 1200 },
};

export function cannedPricing(domain: string, lang: Lang): PricingSuggestion {
  const band = CANNED_PRICING[domain] ?? CANNED_PRICING['AI 入門'];
  const reason =
    lang === 'en'
      ? `For ${domain} tutoring, NT$${band.low}–${band.high}/hr is a sensible band on this platform. Newer tutors or gentler introductory sessions sit near the lower end; deep hands-on experience and a strong portfolio push you toward the top. Set your rate by where your skills land against tutors teaching the same domain.`
      : `${domain} 這個領域，NT$${band.low}–${band.high}/hr 是本平臺合理的區間。剛起步或偏入門陪跑的課落在下緣；有扎實實作經驗、作品夠硬就往上緣靠。對照同領域講師，看你的能力落在哪，再定出你的價。`;
  return { low: band.low, high: band.high, reason };
}
