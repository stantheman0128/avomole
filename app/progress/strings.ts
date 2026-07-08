// app/progress/strings.ts —— /progress 學習儀表板的 UI 字串與示意資料（雙語）。
// 值為 {zh, en}，交給 lib/i18n 的 t() 取字。這頁純前端、不接真資料庫，
// 下面 DEMO 是一位假想學生的示意進度（真進度追蹤是未來的事）。

export const s = {
  kicker: { zh: '學習儀表板', en: 'Learning dashboard' },
  title: { zh: '你這陣子的學習', en: 'Your learning lately' },
  subtitle: {
    zh: '把報名的課、累積的時數、連續學習的天數放在一起看，一眼知道自己走到哪、接下來練哪塊。',
    en: 'Your enrolled courses, hours logged, and study streak in one place, so you can see where you are and what to practice next.',
  },
  demoTag: { zh: '示意資料', en: 'Demo data' },
  demoNote: {
    zh: '以下是一位示範學生的假想進度，用來展示正式版會長什麼樣。接上帳號後會換成你自己的真實紀錄。',
    en: 'The figures below belong to a sample student and show what the full version looks like. Once your account is connected, these become your own records.',
  },

  // 數字列
  statHours: { zh: '累積上課時數', en: 'Hours logged' },
  statHoursUnit: { zh: '小時', en: 'hrs' },
  statStreak: { zh: '連續學習', en: 'Study streak' },
  statStreakUnit: { zh: '天', en: 'days' },
  statMastered: { zh: '已掌握主題', en: 'Topics mastered' },
  statMasteredUnit: { zh: '個', en: '' },

  // 課程進度
  coursesHeading: { zh: '報名中的課', en: 'Courses in progress' },
  sessionsLabel: { zh: '堂', en: 'sessions' },
  ofLabel: { zh: '共', en: 'of' },

  // 下一步
  nextHeading: { zh: '接下來', en: 'Up next' },
  nextBody: {
    zh: '你在「用 RAG 打造問答系統」才剛起步，趁 LoRA 微調的觀念還熱，先把第 2 堂的向量檢索補起來，兩邊會互相帶。',
    en: 'You have only just started "Build a Q&A system with RAG." While the LoRA fine-tuning ideas are still fresh, get session 2 on vector retrieval done next; the two reinforce each other.',
  },
  nextCourseLabel: { zh: '建議下一堂', en: 'Suggested next session' },
  nextCourseName: {
    zh: '用 RAG 打造問答系統 · 第 2 堂',
    en: 'Build a Q&A system with RAG · Session 2',
  },

  browseLink: { zh: '找新的課 →', en: 'Find a new course →' },
} as const;

export interface DemoCourse {
  title: { zh: string; en: string };
  domain: { zh: string; en: string };
  sessionsDone: number;
  sessionsTotal: number;
  percent: number; // 進度條用；與 sessionsDone/Total 大致對齊但不強制相等
}

// 一位示範學生的示意進度。數字刻意參差、不整齊（避開 99.99% 那種假數字）。
export const DEMO = {
  hours: 18.5,
  streak: 12,
  mastered: 9,
  courses: [
    {
      title: { zh: 'LoRA 微調實戰', en: 'LoRA Fine-Tuning in Practice' },
      domain: { zh: 'LLM 應用', en: 'LLM applications' },
      sessionsDone: 3,
      sessionsTotal: 6,
      percent: 50,
    },
    {
      title: { zh: 'LLM 應用開發入門', en: 'Intro to LLM App Development' },
      domain: { zh: 'LLM 應用', en: 'LLM applications' },
      sessionsDone: 5,
      sessionsTotal: 8,
      percent: 62,
    },
    {
      title: { zh: '用 RAG 打造問答系統', en: 'Build a Q&A System with RAG' },
      domain: { zh: 'Agent 開發', en: 'Agent development' },
      sessionsDone: 1,
      sessionsTotal: 5,
      percent: 20,
    },
  ] as DemoCourse[],
} as const;
