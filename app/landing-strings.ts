// app/landing-strings.ts —— Landing（唯一訪客首頁）雙語字串。
// 站名／slogan 不放這裡，一律取自 lib/brand.ts。
export const LANDING = {
  kicker: {
    zh: '學 AI 這件事，講師的底細本來就攤在 GitHub 上。',
    en: 'Learning AI is different: a tutor’s real track record already lives on GitHub.',
  },
  heroLead: {
    zh: '用 AI 評估教 AI 的人，再用對話幫你媒合。講清楚程度、目標與預算，酪梨直接挑人。',
    en: 'AI sizes up the people who teach AI, then matches you in a chat. Say your level, goals and budget — the avocado picks.',
  },

  // 主線 CTA
  primaryCta: { zh: '開始媒合', en: 'Start matching' },
  secondaryCta: { zh: '瀏覽講師', en: 'Browse tutors' },

  // 已上線能力（不是「即將推出」）
  liveTitle: { zh: '現在就能用', en: 'Available now' },
  live1Title: { zh: 'AI 對話媒合', en: 'AI conversational matching' },
  live1Desc: {
    zh: '用聊天講清楚需求，直接拿到合適講師與推薦理由。',
    en: 'Describe what you need in a chat and get fitting tutors with reasons.',
  },
  live1Cta: { zh: '去媒合', en: 'Match now' },
  live2Title: { zh: '講師能力側寫', en: 'Tutor capability profiles' },
  live2Desc: {
    zh: '雷達圖與 AI 摘要把 GitHub、作品與教學經驗攤開來看。',
    en: 'Radar charts and AI summaries lay out GitHub, projects and teaching.',
  },
  live2Cta: { zh: '看講師', en: 'See tutors' },
  live3Title: { zh: '學習路徑規劃', en: 'Learning path planner' },
  live3Desc: {
    zh: '給一個目標，AI 排出階段，並配上合適的課與講師。',
    en: 'Give a goal; AI lays out stages with the right courses and tutors.',
  },
  live3Cta: { zh: '規劃路徑', en: 'Plan a path' },

  // 講師次要入口
  tutorAside: {
    zh: '你是講師？把 GitHub 接上來，AI 幫你生能力側寫卡。',
    en: 'You teach? Connect GitHub and let AI draft your capability profile.',
  },
  tutorAsideCta: { zh: '成為講師', en: 'Start teaching' },

  // 誠實的未做區
  soonTitle: { zh: '還在路上', en: 'Still on the way' },
  soonBadge: { zh: '規劃中', en: 'Planned' },
  soon1Title: { zh: '影片自介 + AI 字幕', en: 'Video intro with AI captions' },
  soon1Desc: {
    zh: '講師錄一段自我介紹，系統自動上雙語字幕——需要上傳與轉檔基礎建設，尚未上線。',
    en: 'Tutors record a short intro with bilingual captions — needs upload/transcoding infra; not live yet.',
  },
  soonMore: { zh: '看完整產品藍圖', en: 'See the full roadmap' },

  // 教室體驗：從頂欄拿掉後的次要入口
  classroomHint: {
    zh: '想先看課後摘要與知識庫問答？',
    en: 'Want a peek at class recaps and knowledge Q&A?',
  },
  classroomCta: { zh: '教室體驗', en: 'Classroom demo' },

  mascotAlt: {
    zh: '酪梨醬吉祥物：一顆戴眼鏡的酪梨，騎在一隻鼴鼠背上',
    en: 'The Guacamole AI mascot: a bespectacled avocado riding on a mole',
  },
} as const;
