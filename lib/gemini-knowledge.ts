// lib/gemini-knowledge.ts —— server-only。課堂知識庫問答的 Gemini 呼叫，與 lib/gemini.ts 同一套 SDK 寫法。
// 只依本堂課摘要（courseContext）回答；超出範圍就說「本課沒提到」。沒有 GEMINI_API_KEY 或任何錯誤都 throw，
// 讓 route 走罐頭退路。語言由呼叫端傳入的 lang 決定，route handler 沒有 useLang。
import 'server-only';
import { GoogleGenAI, Type } from '@google/genai';
import type { Lang } from './i18n';

const TIMEOUT_MS = 10_000;

function client(): { ai: GoogleGenAI; model: string } {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  return { ai: new GoogleGenAI({ apiKey }), model };
}

const ANSWER_SCHEMA = {
  type: Type.OBJECT,
  properties: { answer: { type: Type.STRING } },
  required: ['answer'],
};

// 超出範圍時的固定回覆（也給罐頭路徑當找不到對應時的兜底）。
const OUT_OF_SCOPE: Record<Lang, string> = {
  zh: '這一題本課沒提到，可以問問跟這堂內容有關的問題，或直接問講師。',
  en: "This class didn't cover that. Try a question about this session's material, or ask the tutor directly.",
};

function qaSystemPrompt(lang: Lang): string {
  if (lang === 'en') {
    return `You are the class knowledge assistant for Guacamole AI, an AI tutoring platform.
Answer the student's question using ONLY the class notes provided in the user message.
If the answer isn't in those notes, say exactly: "${OUT_OF_SCOPE.en}" and nothing more.
Do not use outside knowledge or invent details. Keep it concise (under 120 words), plain and friendly, no marketing tone.
Reply in English. Output strict JSON: {"answer": string}.`;
  }
  return `你是「酪梨醬 AI 家教網」的課堂知識助理。
只根據使用者訊息裡提供的「本堂課筆記」回答學生的問題。
如果筆記裡沒有相關內容，就只回這一句：「${OUT_OF_SCOPE.zh}」，不要多說。
不要用課外知識、也不要自己編。回答精簡（120 字內）、白話、親切，不要行銷腔。
用繁體中文回覆。嚴格輸出 JSON：{"answer": string}。`;
}

function parseAnswer(raw: string): string {
  const data = JSON.parse(raw) as { answer?: unknown };
  const answer = typeof data.answer === 'string' ? data.answer.trim() : '';
  if (!answer) throw new Error('gemini qa: empty answer');
  return answer;
}

export async function geminiClassroomQA(
  question: string,
  courseContext: string,
  lang: Lang,
): Promise<string> {
  const { ai, model } = client();
  const userText =
    lang === 'en'
      ? `Class notes:\n${courseContext}\n\nStudent question: ${question}`
      : `本堂課筆記：\n${courseContext}\n\n學生問題：${question}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: userText }] }],
      config: {
        systemInstruction: qaSystemPrompt(lang),
        responseMimeType: 'application/json',
        responseSchema: ANSWER_SCHEMA,
        abortSignal: controller.signal,
      },
    });
    const text = response.text;
    if (!text) throw new Error('gemini qa: no text');
    return parseAnswer(text);
  } finally {
    clearTimeout(timer);
  }
}

// ---- 罐頭退路（純函式，無 server-only 依賴；Gemini 失敗／無 key 時用）----

export interface QaPreset {
  question: string;
  questionEn?: string;
  answer: string;
  answerEn?: string;
}

// 依問題文字挑最接近的預設答案：先找完全對到的預設題，再看關鍵字重疊，都沒有就回超出範圍那句。
export function cannedClassroomAnswer(question: string, presets: QaPreset[], lang: Lang): string {
  const en = lang === 'en';
  const pick = (p: QaPreset) => (en ? p.answerEn ?? p.answer : p.answer);
  const q = question.trim().toLowerCase();
  if (!q || presets.length === 0) return OUT_OF_SCOPE[lang];

  // 1) 問題字串完全等於某預設題
  const exact = presets.find(
    (p) => p.question.toLowerCase() === q || (p.questionEn ?? '').toLowerCase() === q,
  );
  if (exact) return pick(exact);

  // 2) 關鍵字重疊：拆出 2 字以上的詞，看哪個預設題命中最多
  const words = q.split(/[\s，。、,.!?？！]+/).filter((w) => w.length >= 2);
  let best: QaPreset | null = null;
  let bestScore = 0;
  for (const p of presets) {
    const hay = `${p.question} ${p.questionEn ?? ''}`.toLowerCase();
    const score = words.reduce((n, w) => (hay.includes(w) ? n + 1 : n), 0);
    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }
  return best ? pick(best) : OUT_OF_SCOPE[lang];
}
