// lib/chrome-strings.ts —— Nav / Footer 等共用 chrome 字串（僅 scaffold 任務可改）。
// 各頁面自己的字串放該頁目錄下的 strings.ts，不碰本檔。
// 值為 {zh, en}，交給 i18n 的 t() 取用。

export const NAV = {
  findTutors: { zh: '找講師', en: 'Find Tutors' },
  aiMatch: { zh: 'AI 媒合', en: 'AI Match' },
  classroom: { zh: '教室體驗', en: 'Classroom' },
  login: { zh: '登入', en: 'Log in' },
  logout: { zh: '登出', en: 'Log out' },
  dashboard: { zh: '後臺', en: 'Dashboard' },
  langZh: { zh: '中', en: '中' },
  langEn: { zh: 'EN', en: 'EN' },
} as const;

export const FOOTER = {
  // 每頁必有的示意聲明（SPEC §2）
  disclaimer: {
    zh: '本網站為黑客松 Demo。講師、評價與推薦資料除特別標示外均為虛構示意。',
    en: 'This site is a hackathon demo. Tutors, reviews, and endorsements are fictional unless marked otherwise.',
  },
  repo: { zh: 'GitHub 原始碼', en: 'GitHub repo' },
  rights: { zh: '僅供展示用途。', en: 'For demonstration only.' },
} as const;

// 英文模式下、中文 mock 內容區塊上方顯示的小標（SPEC §3）
export const DEMO_CONTENT_NOTE = {
  zh: '示意內容為中文',
  en: 'Demo content in Chinese',
} as const;
