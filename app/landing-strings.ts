// app/landing-strings.ts —— Landing 分流頁字串（雙語，走 useLang 的 t()）。
// 站名／slogan 不放這裡，一律取自 lib/brand.ts。
export const LANDING = {
  // hero 上方一句定位（slogan 之外的補充，講平臺在做什麼）
  kicker: {
    zh: '學 AI 這件事，講師的底細本來就攤在 GitHub 上。',
    en: 'Learning AI is different: a tutor’s real track record already lives on GitHub.',
  },
  heroLead: {
    zh: '一個用 AI 評估「教 AI 的人」、也用 AI 幫你媒合的地方。先告訴酪梨，你是哪一邊。',
    en: 'A place where AI sizes up the people who teach AI, then matches you to them. First, tell the avocado which side you’re on.',
  },

  // 兩道門
  doorPick: { zh: '你從哪道門進來？', en: 'Which door are you coming through?' },

  learnerLabel: { zh: '我要找講師', en: 'I’m here to learn' },
  learnerLine: {
    zh: '講清楚程度、目標跟預算，酪梨直接幫你挑人，還能先看每位講師的能力側寫。',
    en: 'Say where you’re at, what you want, and your budget. The avocado picks people for you, profiles included.',
  },
  learnerCta: { zh: '進去找講師', en: 'Find a tutor' },

  tutorLabel: { zh: '我是講師', en: 'I teach' },
  tutorLine: {
    zh: '把你的 GitHub 跟作品接上來，AI 幫你生一張能力側寫卡，讓想學的人一眼看懂你會什麼。',
    en: 'Connect your GitHub and work; AI drafts a capability profile so learners see what you’ve actually built.',
  },
  tutorCta: { zh: '成為講師', en: 'Start teaching' },

  // 底部一行，導向 AI 媒合（給還沒決定的人）
  undecided: { zh: '還沒想好？', en: 'Not sure yet?' },
  undecidedCta: { zh: '直接問酪梨', en: 'Just ask the avocado' },

  mascotAlt: {
    zh: '酪梨醬吉祥物：一顆戴眼鏡的酪梨，騎在一隻鼴鼠背上',
    en: 'The Guacamole AI mascot: a bespectacled avocado riding on a mole',
  },
} as const;
