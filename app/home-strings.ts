// app/home-strings.ts —— 首頁 UI 字串（雙語）。站名／slogan 不放這裡，一律取自 lib/brand.ts。
export const HOME = {
  heroTagline: {
    zh: 'AI 領域人才的專門媒合平臺，用 AI 評估教 AI 的人。',
    en: 'The matchmaking platform for AI talent, with AI that evaluates those who teach AI.',
  },
  heroPlaceholder: { zh: '告訴酪梨你想學什麼…', en: 'Tell the avocado what you want to learn…' },
  heroSubmit: { zh: '問酪梨', en: 'Ask' },

  // 三亮點卡
  highlightsTitle: { zh: '三個核心能力', en: 'Three core capabilities' },
  h1Title: { zh: 'AI 對話媒合', en: 'AI conversational matching' },
  h1Desc: {
    zh: '用聊天講清楚你的程度、目標跟預算，AI 直接幫你挑出最合適的講師。',
    en: 'Describe your level, goals and budget in a chat, and AI picks the tutors that fit.',
  },
  h1Cta: { zh: '開始媒合', en: 'Start matching' },
  h2Title: { zh: 'AI 講師能力側寫', en: 'AI tutor capability profile' },
  h2Desc: {
    zh: '每位講師都有一張由引擎生成的能力雷達圖，把 GitHub、作品與教學經驗攤開來看。',
    en: 'Every tutor has an engine-generated radar chart drawn from GitHub, projects and teaching.',
  },
  h2Cta: { zh: '看講師', en: 'Browse tutors' },
  h3Title: { zh: 'AI 課後摘要', en: 'AI class recap' },
  h3Desc: {
    zh: '課程錄影自動生成章節時間軸、重點條列與名詞卡，下課不用自己整理筆記。',
    en: 'Recordings turn into a chapter timeline, key points and term cards, so you skip the note-taking.',
  },
  h3Cta: { zh: '看教室體驗', en: 'See the classroom' },

  // 精選講師
  featuredTitle: { zh: '精選講師', en: 'Featured tutors' },
  featuredDesc: {
    zh: '從九位講師裡先挑幾位給你看看，涵蓋不同領域跟程度。',
    en: 'A few picks across different domains and levels to get you started.',
  },
  featuredMore: { zh: '看全部講師', en: 'See all tutors' },

  // 領域分類
  domainsTitle: { zh: '依領域找講師', en: 'Find tutors by domain' },
  domainsDesc: {
    zh: '從六大 AI 領域切入，直接看該領域有哪些人在教。',
    en: 'Jump into any of six AI domains to see who teaches there.',
  },

  // 名人推薦牆
  endorsementsTitle: { zh: '業界推薦', en: 'Endorsed by the field' },
  endorsementsDesc: {
    zh: '認證帳號替平臺上的講師背書，點頭的都是實際看過作品的人。',
    en: 'Verified accounts vouch for tutors here, from people who have seen the work.',
  },
  verifiedLabel: { zh: '認證帳號', en: 'Verified account' },

  // Roadmap
  roadmapTitle: { zh: '即將推出', en: 'Coming soon' },
  roadmapDesc: {
    zh: '這些功能還在路上，先讓你知道酪梨接下來想做什麼。',
    en: "Still on the way, but here's where the avocado is heading next.",
  },
  r1Title: { zh: '學習路徑規劃', en: 'Learning path planner' },
  r1Desc: {
    zh: '給一個目標，AI 幫你排出階段、每階段配上該學的課跟合適的講師。',
    en: 'Give a goal, and AI lays out stages with the right courses and tutors for each.',
  },
  r2Title: { zh: '自動作業生成與批改', en: 'Auto-generated homework and grading' },
  r2Desc: {
    zh: '依課程內容出題，交上去由 AI 批改並給修改建議。',
    en: 'Problems generated from the course, then graded by AI with feedback.',
  },
  r3Title: { zh: '個人學習知識庫', en: 'Personal learning knowledge base' },
  r3Desc: {
    zh: '把你上過的每一堂課變成可問答的知識庫，跨課程隨時查。',
    en: 'Turn every class you took into a searchable knowledge base you can query anytime.',
  },
  roadmapBadge: { zh: '規劃中', en: 'Planned' },
} as const;
