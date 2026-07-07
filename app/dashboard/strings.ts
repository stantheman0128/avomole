// app/dashboard/strings.ts —— 講師後臺 UI 字串（雙語）。站名／slogan 一律取自 lib/brand.ts。
// 值為 {zh, en}，交給 lib/i18n 的 t() 取字。六領域與三程度沿用全站既有常數語彙。
import type { Level } from '@/lib/types';

// 六大固定領域：跟 app/tutors/strings.ts 的 DOMAINS 同一組原字串（?domain= 與列表篩選都靠這幾個）。
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

// 雷達六軸顯示標籤（跟 components/RadarChart.tsx 同一組 key）
export const RADAR_AXES: { key: 'llm' | 'cv' | 'mlBasics' | 'engineering' | 'teaching' | 'influence'; label: { zh: string; en: string } }[] = [
  { key: 'llm', label: { zh: 'LLM', en: 'LLM' } },
  { key: 'cv', label: { zh: '電腦視覺', en: 'Comp. Vision' } },
  { key: 'mlBasics', label: { zh: 'ML 基礎', en: 'ML Basics' } },
  { key: 'engineering', label: { zh: '工程實務', en: 'Engineering' } },
  { key: 'teaching', label: { zh: '教學經驗', en: 'Teaching' } },
  { key: 'influence', label: { zh: '社群影響力', en: 'Influence' } },
];

export const s = {
  // ---- 頁頭 ----
  kicker: { zh: '講師後臺', en: 'Tutor console' },
  title: { zh: '上架你的講師頁', en: 'Publish your tutor page' },
  intro: {
    zh: '編輯能力側寫、技能、作品與方案，讓 AI 幫你生一張側寫卡，發佈後就會出現在講師列表。',
    en: 'Edit your profile, skills, work and plans, let the AI draft your profile card, then publish to appear in the directory.',
  },

  // ---- 共用狀態 ----
  save: { zh: '儲存', en: 'Save' },
  saving: { zh: '儲存中…', en: 'Saving…' },
  saved: { zh: '已儲存', en: 'Saved' },
  saveFailed: { zh: '儲存失敗，請稍後再試。', en: 'Save failed. Please try again.' },
  add: { zh: '新增', en: 'Add' },
  remove: { zh: '移除', en: 'Remove' },

  // ---- 基本資料 ----
  basicKicker: { zh: '基本資料', en: 'Basics' },
  basicTitle: { zh: '你是誰、教什麼', en: 'Who you are, what you teach' },
  fieldTitle: { zh: '一句話頭銜', en: 'Headline title' },
  fieldTitlePlaceholder: { zh: '例：LLM 應用工程師、獨立開發者', en: 'e.g. LLM engineer, indie hacker' },
  fieldBio: { zh: '自我介紹', en: 'Bio' },
  fieldBioPlaceholder: {
    zh: '教學風格、專長、經歷⋯用幾句話讓學生認識你。',
    en: 'Teaching style, strengths, background — a few lines so students get you.',
  },
  fieldRate: { zh: '時薪（NT$）', en: 'Hourly rate (NT$)' },
  fieldProjects: { zh: '接受專案委託', en: 'Open to project work' },
  fieldDomains: { zh: '教學領域（可多選）', en: 'Domains (multiple)' },
  fieldSkills: { zh: '技能標籤', en: 'Skill tags' },
  fieldSkillsPlaceholder: { zh: '輸入技能後按 Enter', en: 'Type a skill, press Enter' },
  fieldLevels: { zh: '適教程度（可多選）', en: 'Levels you teach (multiple)' },
  fieldGithub: { zh: 'GitHub 帳號', en: 'GitHub username' },
  fieldGithubPlaceholder: { zh: '你的 GitHub 帳號（免 @）', en: 'your GitHub handle (no @)' },
  errTitleRequired: { zh: '請填一句話頭銜。', en: 'Please add a headline title.' },
  errRateRange: { zh: '時薪請填 0–99999 之間的數字。', en: 'Hourly rate must be 0–99999.' },

  // ---- 側寫卡 ----
  aiKicker: { zh: '能力側寫', en: 'AI profile' },
  aiTitle: { zh: 'AI 側寫卡', en: 'AI profile card' },
  aiIntro: {
    zh: '讓引擎讀你的技能、自傳與 GitHub，生一張六軸能力雷達與短評。你可以再手動微調雷達。',
    en: 'Let the engine read your skills, bio and GitHub to draft a six-axis radar and a short take. You can fine-tune the radar afterward.',
  },
  aiGenerate: { zh: '用 AI 生成側寫', en: 'Generate with AI' },
  aiGenerating: { zh: '生成中…', en: 'Generating…' },
  aiRegenerate: { zh: '重新生成', en: 'Regenerate' },
  aiFallbackNote: {
    zh: '（引擎暫時無法連線，先給你一份可編輯的預設側寫。）',
    en: '(Engine offline for now — here is an editable default profile.)',
  },
  aiSummaryLabel: { zh: '引擎短評', en: 'Engine summary' },
  aiDifficultyLabel: { zh: '專案難度（1–5）', en: 'Project difficulty (1–5)' },
  aiReviewLabel: { zh: '評價摘要', en: 'Review digest' },
  aiRadarLabel: { zh: '六軸能力（0–100，可微調）', en: 'Six-axis skills (0–100, tunable)' },
  aiEmpty: { zh: '還沒有側寫卡，先填好技能與自傳再生成。', en: 'No profile card yet — fill in skills and bio, then generate.' },

  // ---- 作品集 ----
  portfolioKicker: { zh: '作品集', en: 'Portfolio' },
  portfolioTitle: { zh: '你的作品', en: 'Your work' },
  portfolioEmpty: { zh: '還沒有作品，新增一個讓學生看看你做過什麼。', en: 'No work yet. Add one so students can see what you build.' },
  pfTitle: { zh: '標題', en: 'Title' },
  pfDesc: { zh: '說明', en: 'Description' },
  pfLink: { zh: '連結', en: 'Link' },
  addPortfolio: { zh: '新增作品', en: 'Add work' },

  // ---- 方案 ----
  plansKicker: { zh: '課程方案', en: 'Plans' },
  plansTitle: { zh: '你的方案', en: 'Your plans' },
  plansEmpty: { zh: '還沒有方案，新增一個定義你怎麼收費。', en: 'No plans yet. Add one to define how you charge.' },
  planName: { zh: '方案名稱', en: 'Plan name' },
  planPrice: { zh: '價格（NT$）', en: 'Price (NT$)' },
  planDesc: { zh: '說明', en: 'Description' },
  addPlan: { zh: '新增方案', en: 'Add plan' },

  // ---- 發佈 ----
  publishKicker: { zh: '發佈', en: 'Publish' },
  publishTitle: { zh: '上架與下架', en: 'Go live' },
  publishOn: { zh: '已發佈，出現在講師列表中。', en: 'Published — live in the tutor directory.' },
  publishOff: { zh: '尚未發佈，只有你看得到這頁。', en: 'Not published yet — only you can see this.' },
  publishAction: { zh: '發佈講師頁', en: 'Publish page' },
  unpublishAction: { zh: '取消發佈', en: 'Unpublish' },
  publishHint: {
    zh: '建議先生成側寫卡、補齊基本資料再發佈。',
    en: 'Tip: generate your profile card and fill the basics before publishing.',
  },
  viewPublic: { zh: '看我的公開頁 →', en: 'View my public page →' },
} as const;
