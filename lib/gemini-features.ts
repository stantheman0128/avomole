// lib/gemini-features.ts —— server-only。三個規劃中功能用到的 Gemini 呼叫，與 lib/gemini.ts 同一套 SDK 寫法。
// 學習路徑規劃 + 講師並排比較短評。沒有 GEMINI_API_KEY 或任何錯誤都 throw，讓 route 走罐頭退路。
// 【鐵則】回傳絕不含 hiddenScore；語言由呼叫端傳入的 lang 決定，route handler 沒有 useLang。
import 'server-only';
import { GoogleGenAI, Type } from '@google/genai';
import type { Tutor } from './types';
import type { Lang } from './i18n';

const TIMEOUT_MS = 10_000;

// 六大領域字串，須與 app/tutors/strings.ts DOMAINS、data/tutors.json 完全一致。
const DOMAINS = ['LLM 應用', 'Agent 開發', '電腦視覺', 'MLOps', '資料科學', 'AI 入門'] as const;

function client(): { ai: GoogleGenAI; model: string } {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  return { ai: new GoogleGenAI({ apiKey }), model };
}

// 只餵模型必要欄位（含 hidden_score 供排序，但只留在 server prompt 內）。
function tutorSummary(t: Tutor) {
  return {
    slug: t.slug,
    name: t.name,
    title: t.title,
    domains: t.domains,
    skills: t.skills,
    hourly_rate: t.hourlyRate,
    hidden_score: t.hiddenScore,
    summary: t.aiProfile.summary,
  };
}

// ---- 學習路徑規劃 ----

export interface PathStage {
  title: string;
  learn: string;
  domain: string; // 必為 DOMAINS 之一，供頁面比對挑講師
}

const PATH_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    stages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          learn: { type: Type.STRING },
          domain: { type: Type.STRING, enum: [...DOMAINS] },
        },
        required: ['title', 'learn', 'domain'],
      },
    },
  },
  required: ['stages'],
};

const LEVEL_TEXT: Record<string, { zh: string; en: string }> = {
  beginner: { zh: '初階（幾乎沒基礎）', en: 'beginner (little to no background)' },
  intermediate: { zh: '中階（有些基礎）', en: 'intermediate (some background)' },
  advanced: { zh: '高階（已有相當經驗）', en: 'advanced (already experienced)' },
};

function pathSystemPrompt(lang: Lang): string {
  const domainList = DOMAINS.join('、');
  if (lang === 'en') {
    return `You are the learning-path planner for Guacamole AI, an AI tutoring platform.
Given a learner's goal and current level, lay out a staged learning path of 3 to 4 stages.
Each stage has: a short title, one sentence on what to learn, and exactly one domain it maps to.
The domain MUST be one of these six (use the string verbatim): ${domainList}.
Order the stages from foundation to goal. Keep every field concise. Reply in English.
Output strict JSON matching the schema.`;
  }
  return `你是「酪梨醬 AI 家教網」的學習路徑規劃師。
根據學生的學習目標與目前程度，排出一條 3 到 4 個階段的學習路徑。
每個階段包含：一個簡短標題、一句話說明要學什麼、以及對應的一個領域。
領域必須是以下六個之一（逐字使用）：${domainList}。
階段由基礎排到目標，每個欄位都精簡。用繁體中文回覆。
嚴格輸出符合 schema 的 JSON。`;
}

function parsePath(raw: string): PathStage[] {
  const data = JSON.parse(raw) as { stages?: unknown };
  if (!Array.isArray(data.stages)) throw new Error('gemini path: no stages');
  const domainSet = new Set<string>(DOMAINS);
  const stages = data.stages
    .map((s) => s as { title?: unknown; learn?: unknown; domain?: unknown })
    .filter(
      (s) =>
        typeof s.title === 'string' &&
        typeof s.learn === 'string' &&
        typeof s.domain === 'string' &&
        domainSet.has(s.domain),
    )
    .map((s) => ({ title: s.title as string, learn: s.learn as string, domain: s.domain as string }));
  if (stages.length === 0) throw new Error('gemini path: empty after validation');
  return stages;
}

export async function geminiLearningPath(
  goal: string,
  level: string,
  lang: Lang,
  tutors: Tutor[],
): Promise<PathStage[]> {
  const { ai, model } = client();
  const levelText = (LEVEL_TEXT[level] ?? LEVEL_TEXT.beginner)[lang];
  const tutorsJson = JSON.stringify(tutors.map(tutorSummary));
  const userText =
    lang === 'en'
      ? `Learner goal: ${goal}\nCurrent level: ${levelText}\nAvailable tutor domains (for reference): ${tutorsJson}`
      : `學生目標：${goal}\n目前程度：${levelText}\n平臺講師領域（參考）：${tutorsJson}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: userText }] }],
      config: {
        systemInstruction: pathSystemPrompt(lang),
        responseMimeType: 'application/json',
        responseSchema: PATH_SCHEMA,
        abortSignal: controller.signal,
      },
    });
    const text = response.text;
    if (!text) throw new Error('gemini path: no text');
    return parsePath(text);
  } finally {
    clearTimeout(timer);
  }
}

// ---- 講師並排比較短評 ----

// 只餵比較需要的欄位（含 hidden_score 供取捨，但只在 server prompt 內）。
function compareSummary(t: Tutor) {
  return {
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

const BLURB_SCHEMA = {
  type: Type.OBJECT,
  properties: { blurb: { type: Type.STRING } },
  required: ['blurb'],
};

function blurbSystemPrompt(lang: Lang): string {
  if (lang === 'en') {
    return `You are the comparison assistant for Guacamole AI, an AI tutoring platform.
Given two tutors, write ONE short paragraph (2-3 sentences, under 80 words) comparing them for a prospective learner.
Say who fits which kind of learner and why, citing concrete skills or focus. Be balanced and honest; do not crown an absolute winner.
Never mention hidden_score or that any internal score exists. Reply in English. Output strict JSON: {"blurb": string}.`;
  }
  return `你是「酪梨醬 AI 家教網」的比較助理。
給你兩位講師，寫一段短評（2 到 3 句、80 字內），幫學生比較這兩位。
說明哪一位適合哪種學生、理由是什麼，引用具體技能或專長。持平誠實，不要硬選出唯一贏家。
絕不提及 hidden_score 或任何內部分數的存在。用繁體中文回覆。嚴格輸出 JSON：{"blurb": string}。`;
}

function parseBlurb(raw: string): string {
  const data = JSON.parse(raw) as { blurb?: unknown };
  const blurb = typeof data.blurb === 'string' ? data.blurb.trim() : '';
  if (!blurb) throw new Error('gemini blurb: empty');
  return blurb;
}

export async function geminiCompareBlurb(a: Tutor, b: Tutor, lang: Lang): Promise<string> {
  const { ai, model } = client();
  const pair = JSON.stringify([compareSummary(a), compareSummary(b)]);
  const userText =
    lang === 'en' ? `Compare these two tutors: ${pair}` : `比較這兩位講師：${pair}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: userText }] }],
      config: {
        systemInstruction: blurbSystemPrompt(lang),
        responseMimeType: 'application/json',
        responseSchema: BLURB_SCHEMA,
        abortSignal: controller.signal,
      },
    });
    const text = response.text;
    if (!text) throw new Error('gemini blurb: no text');
    return parseBlurb(text);
  } finally {
    clearTimeout(timer);
  }
}

// ---- 罐頭退路（純函式，無 server-only 依賴；Gemini 失敗／無 key 時用）----

// 學習路徑罐頭：一條 RAG 導向的四階段範例。領域字串逐字對齊 data/tutors.json。
const CANNED_STAGES: Record<Lang, PathStage[]> = {
  zh: [
    { title: '打好 AI 基礎', learn: '搞懂機器學習與大語言模型的基本概念，補齊 Python 手感。', domain: 'AI 入門' },
    { title: '玩熟大模型應用', learn: '學 Prompt 設計與 OpenAI／開源模型的 API 串接。', domain: 'LLM 應用' },
    { title: '做出檢索增強', learn: '把文件切塊、做向量檢索，接成一套能回答問題的 RAG。', domain: 'LLM 應用' },
    { title: '讓它上得了線', learn: '學會部署、監控與版本管理，把 demo 變成可用的服務。', domain: 'MLOps' },
  ],
  en: [
    { title: 'Get the AI basics', learn: 'Understand core machine learning and LLM concepts and get comfortable with Python.', domain: 'AI 入門' },
    { title: 'Work with large models', learn: 'Learn prompt design and wiring up OpenAI or open-source model APIs.', domain: 'LLM 應用' },
    { title: 'Build retrieval-augmented generation', learn: 'Chunk documents, run vector search, and assemble a working RAG that answers questions.', domain: 'LLM 應用' },
    { title: 'Ship it to production', learn: 'Learn deployment, monitoring and versioning to turn a demo into a usable service.', domain: 'MLOps' },
  ],
};

export function cannedLearningPath(lang: Lang): PathStage[] {
  return CANNED_STAGES[lang];
}

// 比較短評罐頭：依時薪／技能／領域湊一句持平的比較。
export function cannedCompareBlurb(a: Tutor, b: Tutor, lang: Lang): string {
  const cheaper = a.hourlyRate <= b.hourlyRate ? a : b;
  const pricier = cheaper === a ? b : a;
  const sameRate = a.hourlyRate === b.hourlyRate;

  if (lang === 'en') {
    const rateLine = sameRate
      ? `${a.name} and ${b.name} charge the same hourly rate`
      : `${cheaper.name} is the more budget-friendly option at NT$${cheaper.hourlyRate}/hr, while ${pricier.name} sits at NT$${pricier.hourlyRate}/hr`;
    return `${rateLine}. ${a.name} leans into ${a.domains[0] ?? 'AI'} (${a.skills.slice(0, 2).join(', ')}), and ${b.name} into ${b.domains[0] ?? 'AI'} (${b.skills.slice(0, 2).join(', ')}). Pick by the domain closest to your goal and the level each of them teaches.`;
  }

  const rateLine = sameRate
    ? `${a.name} 和 ${b.name} 的時薪一樣`
    : `${cheaper.name} 的時薪 NT$${cheaper.hourlyRate} 較親民，${pricier.name} 則是 NT$${pricier.hourlyRate}`;
  return `${rateLine}。${a.name} 偏 ${a.domains[0] ?? 'AI'}（${a.skills.slice(0, 2).join('、')}），${b.name} 偏 ${b.domains[0] ?? 'AI'}（${b.skills.slice(0, 2).join('、')}）。挑跟你目標最接近的領域，再看兩位各自適教的程度來決定。`;
}
