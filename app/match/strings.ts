// app/match/strings.ts —— /match AI 媒合聊天室的 UI 字串（雙語）。

export const s = {
  kicker: { zh: 'AI 媒合', en: 'AI matchmaking' },
  title: { zh: 'AI 媒合聊天室', en: 'AI matchmaking chat' },
  subtitle: {
    zh: '告訴酪梨你想學什麼、程度和預算，幫你配對最適合的講師。',
    en: 'Tell the avocado what you want to learn, your level and budget — it will match you with tutors.',
  },
  inputPlaceholder: { zh: '輸入你的學習需求…', en: 'Describe what you want to learn…' },
  send: { zh: '送出', en: 'Send' },
  sending: { zh: '酪梨思考中…', en: 'Thinking…' },
  greeting: {
    zh: '嗨，我是酪梨醬的媒合助理。想學什麼都可以跟我說，或先點下面的範例問題。',
    en: "Hi, I'm the Guacamole matchmaking assistant. Tell me what you'd like to learn, or tap an example below.",
  },
  emptyHint: {
    zh: '不知道從哪問起？先點一個範例：',
    en: 'Not sure where to start? Try an example:',
  },
  recommendTitle: { zh: '為你推薦', en: 'Recommended for you' },
  offlineTag: { zh: '離線建議', en: 'Offline suggestion' },
  errorReply: {
    zh: '酪梨剛剛恍神了一下，你可以再問一次，或直接逛逛講師列表。',
    en: 'The avocado zoned out for a moment. Try again, or browse the tutor list.',
  },
  // 空狀態範例：轉 LLM、預算、程度
  chips: [
    {
      zh: '我想從軟體工程轉做 LLM 應用，該找誰？',
      en: 'I want to move from software engineering into LLM apps — who should I find?',
    },
    {
      zh: '預算大概 NT$1,500／時以內，想學 RAG',
      en: 'Budget around NT$1,500/hr — looking to learn RAG',
    },
    {
      zh: '完全新手，程度該從哪開始學 AI？',
      en: "Complete beginner — where's the right level to start with AI?",
    },
  ],
} as const;
