// app/assessment/strings.ts —— /assessment 程度自我診斷頁的 UI 字串 + 題庫（雙語）。
// 純前端計分：每題選項帶 0–2 分，總分區間對應 初階／中階／高階。無 AI、無 db。
import type { Level } from '@/lib/types';

export interface Choice {
  label: { zh: string; en: string };
  score: number; // 0 / 1 / 2
}
export interface Question {
  id: string;
  prompt: { zh: string; en: string };
  choices: Choice[];
}

// 5 題，覆蓋 Python／ML 概念／LLM／工程實務／實作經驗。每題 3 選項（0/1/2 分）。
export const QUESTIONS: Question[] = [
  {
    id: 'python',
    prompt: { zh: '你的 Python 熟練度大概到哪？', en: 'How comfortable are you with Python?' },
    choices: [
      { label: { zh: '幾乎沒寫過程式', en: 'Barely coded before' }, score: 0 },
      { label: { zh: '看得懂、能改，但不常自己從零寫', en: 'Can read and tweak, rarely write from scratch' }, score: 1 },
      { label: { zh: '天天在寫，套件與環境都熟', en: 'Write it daily, comfortable with libs and envs' }, score: 2 },
    ],
  },
  {
    id: 'ml',
    prompt: { zh: '對機器學習的基本概念（訓練、過擬合、評估）熟嗎？', en: 'How well do you know ML basics (training, overfitting, evaluation)?' },
    choices: [
      { label: { zh: '沒聽過或只有模糊印象', en: 'New to me or very fuzzy' }, score: 0 },
      { label: { zh: '大致懂，能講出個所以然', en: 'Roughly get it, can explain the gist' }, score: 1 },
      { label: { zh: '很熟，實際訓練調校過模型', en: 'Solid — I have trained and tuned models' }, score: 2 },
    ],
  },
  {
    id: 'llm',
    prompt: { zh: '用大語言模型（LLM）做過什麼？', en: 'What have you done with large language models (LLMs)?' },
    choices: [
      { label: { zh: '只用過 ChatGPT 之類的介面', en: 'Only used chat interfaces like ChatGPT' }, score: 0 },
      { label: { zh: '串過 API、寫過 prompt', en: 'Called APIs, written prompts' }, score: 1 },
      { label: { zh: '做過 RAG／fine-tuning／agent', en: 'Built RAG / fine-tuning / agents' }, score: 2 },
    ],
  },
  {
    id: 'engineering',
    prompt: { zh: '對版本控制、API、部署這些工程實務？', en: 'How about engineering practices — version control, APIs, deployment?' },
    choices: [
      { label: { zh: '幾乎沒碰過', en: 'Hardly touched them' }, score: 0 },
      { label: { zh: '用過 Git、串過別人的 API', en: 'Used Git, consumed some APIs' }, score: 1 },
      { label: { zh: '自己部署過服務、管過 pipeline', en: 'Deployed services, managed pipelines' }, score: 2 },
    ],
  },
  {
    id: 'project',
    prompt: { zh: '有沒有實際做完、可展示的 AI 專案？', en: 'Any finished, show-able AI projects?' },
    choices: [
      { label: { zh: '還沒有', en: 'Not yet' }, score: 0 },
      { label: { zh: '跟過教學做出過小東西', en: 'Built small things following tutorials' }, score: 1 },
      { label: { zh: '有自己從頭做完的專案', en: 'Yes, projects I built end to end' }, score: 2 },
    ],
  },
];

// 分數區間 → 程度。滿分 10：0–3 初階、4–7 中階、8–10 高階。
export function scoreToLevel(total: number): Level {
  if (total <= 3) return 'beginner';
  if (total <= 7) return 'intermediate';
  return 'advanced';
}

export const RESULT: Record<Level, { title: { zh: string; en: string }; blurb: { zh: string; en: string } }> = {
  beginner: {
    title: { zh: '初階', en: 'Beginner' },
    blurb: {
      zh: '你正在起跑線上，這是最好玩的階段。找一位擅長帶新手的講師，從基礎和第一個小專案開始，別急著跳深水區。',
      en: 'You are at the starting line — the fun part. Find a tutor who loves onboarding beginners, start from fundamentals and a first small project, and skip the deep end for now.',
    },
  },
  intermediate: {
    title: { zh: '中階', en: 'Intermediate' },
    blurb: {
      zh: '你有基礎、也動過手了。接下來適合鎖定一個方向做出完整專案，找能陪你把作品做深、補上工程實務的講師。',
      en: 'You have the basics and some hands-on time. Now pick a direction and build a complete project — look for a tutor who can help you go deep and shore up engineering practice.',
    },
  },
  advanced: {
    title: { zh: '高階', en: 'Advanced' },
    blurb: {
      zh: '你已經能獨立做出東西了。適合找同樣資深、能在架構取捨和上線細節上跟你過招的講師，把專案推到能用的水準。',
      en: 'You can already ship on your own. Look for an equally senior tutor who can spar with you on architecture trade-offs and production details, and push projects to a usable bar.',
    },
  },
};

export const s = {
  kicker: { zh: '程度自我診斷', en: 'Self-assessment' },
  title: { zh: '先摸清你站在哪', en: 'Find out where you stand' },
  subtitle: {
    zh: '五道題，兩分鐘。搞清楚自己的底，媒合前就知道該報多深的課，不會太深或太淺。',
    en: 'Five questions, two minutes. Gauge your level before matching, so you pick courses that are neither too deep nor too shallow.',
  },
  progress: { zh: '題', en: '' }, // 用於「第 N / 5 題」
  of: { zh: '／', en: ' / ' },
  back: { zh: '← 上一題', en: '← Back' },
  resultKicker: { zh: '診斷結果', en: 'Your result' },
  yourLevel: { zh: '你目前大概是', en: 'You are around' },
  retake: { zh: '重測一次', en: 'Retake' },
  toMatch: { zh: '用這個程度去媒合 →', en: 'Match with this level →' },
  toTutors: { zh: '看適合的講師 →', en: 'See tutors that fit →' },
} as const;
