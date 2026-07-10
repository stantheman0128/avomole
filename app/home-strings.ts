// app/home-strings.ts —— 舊 /discover 字串（頁面已 redirect）。
// 保留給可能的引用；敘事已對齊：已上線功能不再標「即將推出」。
export const HOME = {
  heroTagline: {
    zh: 'AI 領域人才的專門媒合平臺，用 AI 評估教 AI 的人。',
    en: 'The matchmaking platform for AI talent, with AI that evaluates those who teach AI.',
  },
  heroPlaceholder: { zh: '告訴酪梨你想學什麼…', en: 'Tell the avocado what you want to learn…' },
  heroSubmit: { zh: '問酪梨', en: 'Ask' },

  highlightsTitle: { zh: '現在就能用', en: 'Available now' },
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
  h3Title: { zh: '學習路徑規劃', en: 'Learning path planner' },
  h3Desc: {
    zh: '給一個目標，AI 幫你排出階段、每階段配上該學的課跟合適的講師。',
    en: 'Give a goal, and AI lays out stages with the right courses and tutors for each.',
  },
  h3Cta: { zh: '規劃路徑', en: 'Plan a path' },

  featuredTitle: { zh: '精選講師', en: 'Featured tutors' },
  featuredDesc: {
    zh: '從九位講師裡先挑幾位給你看看，涵蓋不同領域跟程度。',
    en: 'A few picks across different domains and levels to get you started.',
  },
  featuredMore: { zh: '看全部講師', en: 'See all tutors' },

  domainsTitle: { zh: '依領域找講師', en: 'Find tutors by domain' },
  domainsDesc: {
    zh: '從六大 AI 領域切入，直接看該領域有哪些人在教。',
    en: 'Jump into any of six AI domains to see who teaches there.',
  },

  endorsementsTitle: { zh: '業界推薦', en: 'Endorsed by the field' },
  endorsementsDesc: {
    zh: '認證帳號替平臺上的講師背書，點頭的都是實際看過作品的人。',
    en: 'Verified accounts vouch for tutors here, from people who have seen the work.',
  },
  verifiedLabel: { zh: '認證帳號', en: 'Verified account' },

  // 誠實未做區（學習路徑／作業／知識庫已上線，不再列在這裡）
  roadmapTitle: { zh: '還在路上', en: 'Still on the way' },
  roadmapDesc: {
    zh: '真正還沒做的功能會誠實標在這裡；已上線的請從首頁或產品藍圖進去用。',
    en: "Only what's truly unfinished lives here; what's live is on the home page or roadmap.",
  },
  r1Title: { zh: '影片自介 + AI 字幕', en: 'Video intro with AI captions' },
  r1Desc: {
    zh: '講師錄一段自我介紹，系統自動上雙語字幕——需要上傳與轉檔基礎建設。',
    en: 'Tutors record a short intro with bilingual captions — needs upload and transcoding infra.',
  },
  r2Title: { zh: '進度儀表板接真資料', en: 'Progress dashboard with real data' },
  r2Desc: {
    zh: '目前 /progress 是示意資料；接真上課紀錄後才會變成個人儀表板。',
    en: '/progress is demo data today; real session history turns it into a personal dashboard.',
  },
  r3Title: { zh: '更多工具見藍圖', en: 'More tools on the roadmap' },
  r3Desc: {
    zh: '課綱、定價、反向媒合等已上線；完整清單在產品藍圖。',
    en: 'Syllabus, pricing, reverse match and more are live — full list on the roadmap.',
  },
  roadmapBadge: { zh: '規劃中', en: 'Planned' },
} as const;
