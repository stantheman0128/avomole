// app/syllabus/strings.ts —— /syllabus AI 課綱產生器頁的 UI 字串（雙語）。
// 值為 {zh, en}，交給 lib/i18n 的 t() 取字。站名／slogan 一律取自 lib/brand.ts。
import type { Level } from '@/lib/types';

export const LEVEL_OPTIONS: { value: Level; label: { zh: string; en: string } }[] = [
  { value: 'beginner', label: { zh: '初階 · 幾乎沒基礎', en: 'Beginner · little background' } },
  { value: 'intermediate', label: { zh: '中階 · 有些基礎', en: 'Intermediate · some background' } },
  { value: 'advanced', label: { zh: '高階 · 已有經驗', en: 'Advanced · experienced' } },
];

export const s = {
  kicker: { zh: 'AI 課綱產生器', en: 'AI syllabus generator' },
  title: { zh: '給個主題，酪梨幫你排課綱', en: 'Give a topic, get a syllabus' },
  subtitle: {
    zh: '想教什麼、教到多深？填一個主題和目標程度，酪梨會排出一份分週的課綱，讓你直接拿去開課或微調。',
    en: 'What do you want to teach, and how deep? Enter a topic and target level, and it lays out a weekly syllabus you can open a course with or tweak.',
  },
  topicLabel: { zh: '課程主題', en: 'Course topic' },
  topicPlaceholder: {
    zh: '例：LoRA 微調',
    en: 'e.g. LoRA fine-tuning',
  },
  levelLabel: { zh: '目標程度', en: 'Target level' },
  submit: { zh: '產生課綱', en: 'Generate syllabus' },
  generating: { zh: '酪梨排課中…', en: 'Generating…' },
  resultKicker: { zh: '你的課綱', en: 'Your syllabus' },
  weekLabel: { zh: '第', en: 'Unit' }, // zh：「第 N 單元」；en：「Unit N」
  weekUnit: { zh: '單元', en: '' },
  offlineTag: { zh: '離線範例', en: 'Offline sample' },
  offlineNote: {
    zh: '目前顯示的是固定範例課綱。接上 AI 之後，會依你的主題與程度即時生成。',
    en: 'Showing a fixed sample syllabus. With AI connected, this is generated live from your topic and level.',
  },
  errorNote: {
    zh: '產生時出了點狀況，先給你一份範例課綱。可以再試一次。',
    en: 'Something went wrong generating — here is a sample syllabus. Try again.',
  },
  // 起手範例（點了直接填入主題）
  examples: [
    { zh: 'LoRA 微調', en: 'LoRA fine-tuning' },
    { zh: '從零打造 RAG 問答', en: 'Build a RAG Q&A from scratch' },
    { zh: 'PyTorch 影像分類入門', en: 'Intro to image classification with PyTorch' },
  ],
} as const;
