// app/match/strings.ts —— /match AI 媒合聊天室的 UI 字串（雙語）。
// 值為 {zh, en}，交給 lib/i18n 的 t() 取字。不碰共用 chrome 字串。

export const s = {
  title: { zh: 'AI 媒合聊天室', en: 'AI matchmaking chat' },
  subtitle: {
    zh: '告訴酪梨你想學什麼、程度和預算，幫你配對最適合的講師。',
    en: 'Tell the avocado what you want to learn, your level and budget — it will match you with tutors.',
  },
  inputPlaceholder: { zh: '輸入你的學習需求…', en: 'Describe what you want to learn…' },
  send: { zh: '送出', en: 'Send' },
  sending: { zh: '酪梨思考中…', en: 'Thinking…' },
  greeting: {
    zh: '嗨，我是酪梨醬的媒合助理 🥑。想學什麼都可以跟我說，我幫你找講師。',
    en: "Hi, I'm the Guacamole matchmaking assistant 🥑. Tell me what you'd like to learn and I'll find you a tutor.",
  },
  recommendTitle: { zh: '為你推薦', en: 'Recommended for you' },
  offlineTag: { zh: '離線建議', en: 'Offline suggestion' },
  errorReply: {
    zh: '酪梨剛剛恍神了一下，你可以再問一次，或直接逛逛講師列表。',
    en: 'The avocado zoned out for a moment. Try again, or browse the tutor list.',
  },
  // 建議 prompt chips（SPEC §4.4 指定的三句，中文原文；英文為對照）。
  chips: [
    { zh: '我有 Python 基礎，想學 fine-tuning', en: 'I know some Python and want to learn fine-tuning' },
    { zh: '完全新手，想入門 AI', en: 'Complete beginner, want to get into AI' },
    { zh: '想找人指導我的 RAG 專案', en: 'Looking for someone to mentor my RAG project' },
  ],
} as const;
