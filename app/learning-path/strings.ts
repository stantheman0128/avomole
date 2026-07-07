// app/learning-path/strings.ts —— /learning-path 學習路徑規劃頁的 UI 字串（雙語）。
// 值為 {zh, en}，交給 lib/i18n 的 t() 取字。站名／slogan 一律取自 lib/brand.ts。
import type { Level } from '@/lib/types';

export const LEVEL_OPTIONS: { value: Level; label: { zh: string; en: string } }[] = [
  { value: 'beginner', label: { zh: '初階 · 幾乎沒基礎', en: 'Beginner · little background' } },
  { value: 'intermediate', label: { zh: '中階 · 有些基礎', en: 'Intermediate · some background' } },
  { value: 'advanced', label: { zh: '高階 · 已有經驗', en: 'Advanced · experienced' } },
];

export const s = {
  kicker: { zh: '學習路徑規劃', en: 'Learning path planner' },
  title: { zh: '給我一個目標，酪梨排路給你走', en: 'Give a goal, get a path to walk' },
  subtitle: {
    zh: '說清楚你想達成什麼、現在站在哪，酪梨會排出分階段的學習路徑，每一階段配上該學的東西和合適的講師。',
    en: 'Tell it what you want and where you stand; it lays out a staged path, each stage with what to learn and the right tutors.',
  },
  goalLabel: { zh: '你的學習目標', en: 'Your goal' },
  goalPlaceholder: {
    zh: '例：三個月內做出自己的 RAG 應用',
    en: 'e.g. Build my own RAG app in three months',
  },
  levelLabel: { zh: '目前程度', en: 'Current level' },
  submit: { zh: '排出我的路徑', en: 'Plan my path' },
  planning: { zh: '酪梨規劃中…', en: 'Planning…' },
  resultKicker: { zh: '你的學習路徑', en: 'Your learning path' },
  stageLabel: { zh: '階段', en: 'Stage' },
  tutorsForStage: { zh: '這階段可以找', en: 'Tutors for this stage' },
  noTutors: {
    zh: '這階段目前還沒有對應的講師，可以先自學，或到列表逛逛相近領域。',
    en: 'No matching tutor for this stage yet — self-study first, or browse nearby domains.',
  },
  offlineTag: { zh: '離線範例', en: 'Offline sample' },
  offlineNote: {
    zh: '目前顯示的是固定範例路徑。接上 AI 之後，會依你的目標與程度即時生成。',
    en: 'Showing a fixed sample path. With AI connected, this is generated live from your goal and level.',
  },
  errorNote: {
    zh: '規劃時出了點狀況，先給你一條通用路徑。可以再試一次，或直接逛講師列表。',
    en: 'Something went wrong planning — here is a general path. Try again, or browse the tutor list.',
  },
  browseAll: { zh: '直接逛講師列表 →', en: 'Browse all tutors →' },
  // 起手範例（點了直接填入目標）
  examples: [
    { zh: '三個月內做出自己的 RAG 應用', en: 'Build my own RAG app in three months' },
    { zh: '從零開始入門機器學習', en: 'Get into machine learning from scratch' },
    { zh: '學會把模型部署上線', en: 'Learn to deploy models to production' },
  ],
} as const;
