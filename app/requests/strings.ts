// app/requests/strings.ts —— 反向媒合（學生需求）頁 UI 字串，雙語 {zh, en}，交給 lib/i18n 的 t()。
// 六領域與三程度沿用 app/dashboard/strings.ts 的原字串語彙，值一致才好跨頁篩選。
import type { Level } from '@/lib/types';

// 六大固定領域：跟講師端同一組原字串（domain 值直接存原字串）。
export const DOMAINS = ['LLM 應用', 'Agent 開發', '電腦視覺', 'MLOps', '資料科學', 'AI 入門'] as const;
export type Domain = (typeof DOMAINS)[number];

export const domainLabel: Record<Domain, { zh: string; en: string }> = {
  'LLM 應用': { zh: 'LLM 應用', en: 'LLM Apps' },
  'Agent 開發': { zh: 'Agent 開發', en: 'Agent Dev' },
  '電腦視覺': { zh: '電腦視覺', en: 'Computer Vision' },
  MLOps: { zh: 'MLOps', en: 'MLOps' },
  '資料科學': { zh: '資料科學', en: 'Data Science' },
  'AI 入門': { zh: 'AI 入門', en: 'AI Basics' },
};

export const LEVELS: Level[] = ['beginner', 'intermediate', 'advanced'];
export const levelLabel: Record<Level, { zh: string; en: string }> = {
  beginner: { zh: '初階', en: 'Beginner' },
  intermediate: { zh: '中階', en: 'Intermediate' },
  advanced: { zh: '高階', en: 'Advanced' },
};

export const s = {
  // ---- 頁頭 ----
  kicker: { zh: '反向媒合', en: 'Open requests' },
  title: { zh: '學生需求牆', en: 'Student request board' },
  intro: {
    zh: '說清楚你想學什麼，讓合適的講師主動來找你。發一則需求，剩下的交給對的人。',
    en: 'Say what you want to learn and let the right tutors come to you. Post a request, leave the rest to them.',
  },

  // ---- 發需求表單 ----
  formKicker: { zh: '發一則需求', en: 'Post a request' },
  formTitle: { zh: '你想學什麼？', en: 'What do you want to learn?' },
  fTitle: { zh: '標題', en: 'Title' },
  fTitlePlaceholder: { zh: '例：想在兩週內做出會查資料的 LLM agent', en: 'e.g. Build a retrieval LLM agent in two weeks' },
  fDesc: { zh: '需求說明', en: 'Details' },
  fDescPlaceholder: {
    zh: '你的程度、想達成的目標、時間安排、卡在哪裡⋯講得越具體，講師越好接。',
    en: 'Your level, your goal, your schedule, where you are stuck — the more specific, the easier to match.',
  },
  fBudget: { zh: '每小時預算（NT$，可選）', en: 'Hourly budget (NT$, optional)' },
  fBudgetPlaceholder: { zh: '例：800', en: 'e.g. 800' },
  fLevel: { zh: '你的程度（可選）', en: 'Your level (optional)' },
  fDomain: { zh: '領域（可選）', en: 'Domain (optional)' },
  fLevelAny: { zh: '不指定', en: 'No preference' },
  fDomainAny: { zh: '不指定', en: 'No preference' },
  submit: { zh: '發布需求', en: 'Post request' },
  submitting: { zh: '發布中…', en: 'Posting…' },
  posted: { zh: '需求已發布，講師會在下方看到。', en: 'Request posted — tutors will see it below.' },
  errTitle: { zh: '請填需求標題。', en: 'Please add a title.' },
  errDesc: { zh: '請填需求說明。', en: 'Please describe your request.' },
  errGeneric: { zh: '發布失敗，請稍後再試。', en: 'Could not post. Please try again.' },

  // ---- 需求列表 ----
  listKicker: { zh: '進行中的需求', en: 'Active requests' },
  empty: {
    zh: '目前還沒有人發需求。第一個發的人最有機會被講師搶著接。',
    en: 'No requests yet. Be the first to post and tutors will come to you.',
  },
  budgetLabel: { zh: '每小時預算', en: 'Hourly budget' },
  budgetNone: { zh: '預算未定', en: 'Budget open' },
  postedBy: { zh: '發文者', en: 'Posted by' },
  anon: { zh: '匿名學生', en: 'A student' },

  // ---- 講師表達意願 ----
  interest: { zh: '我想教這位 →', en: 'I want to teach this →' },
  interestSent: { zh: '已送出教學意願（Demo）', en: 'Interest sent (demo)' },
  tutorOnly: { zh: '登入為講師才能應徵', en: 'Log in as a tutor to apply' },

  // ---- 相對時間 ----
  justNow: { zh: '剛剛', en: 'just now' },
  minsAgo: { zh: '分鐘前', en: 'min ago' },
  hoursAgo: { zh: '小時前', en: 'h ago' },
  daysAgo: { zh: '天前', en: 'd ago' },
} as const;
