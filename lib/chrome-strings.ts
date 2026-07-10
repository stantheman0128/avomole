// lib/chrome-strings.ts —— Nav / Footer 等共用 chrome 字串。
// 各頁面自己的字串放該頁目錄下的 strings.ts，不碰本檔。
// 值為 {zh, en}，交給 i18n 的 t() 取用。

export const NAV = {
  findTutors: { zh: '找講師', en: 'Find Tutors' },
  aiMatch: { zh: 'AI 媒合', en: 'AI Match' },
  // 教室體驗已從頂欄拿掉；字串保留給 Landing／Footer 次要入口。
  classroom: { zh: '教室體驗', en: 'Classroom' },
  login: { zh: '登入', en: 'Log in' },
  logout: { zh: '登出', en: 'Log out' },
  dashboard: { zh: '後臺', en: 'Dashboard' },
  langZh: { zh: '中', en: '中' },
  langEn: { zh: 'EN', en: 'EN' },
} as const;

export const FOOTER = {
  disclaimer: {
    zh: '部分講師、評價與推薦為示意資料；標示「真實資料」者除外。功能持續迭代中。',
    en: 'Some tutors, reviews, and endorsements are illustrative sample data unless marked as verified. Features continue to evolve.',
  },
  repo: { zh: 'GitHub 原始碼', en: 'GitHub repo' },
  rights: { zh: '正式產品，示意資料已標明。', en: 'A live product; sample data is labeled.' },
  classroom: { zh: '教室體驗', en: 'Classroom demo' },
  roadmap: { zh: '產品藍圖', en: 'Roadmap' },
} as const;

// 英文模式下、中文 mock 內容區塊上方顯示的小標
export const DEMO_CONTENT_NOTE = {
  zh: '示意內容為中文',
  en: 'Demo content in Chinese',
} as const;
