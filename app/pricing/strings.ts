// app/pricing/strings.ts —— /pricing 定價建議頁的 UI 字串（雙語）。
// 值為 {zh, en}，交給 lib/i18n 的 t() 取字。領域字串逐字對齊 lib/gemini-tools.ts DOMAINS。
export const DOMAIN_OPTIONS: { value: string; label: { zh: string; en: string } }[] = [
  { value: 'LLM 應用', label: { zh: 'LLM 應用', en: 'LLM applications' } },
  { value: 'Agent 開發', label: { zh: 'Agent 開發', en: 'Agent development' } },
  { value: '電腦視覺', label: { zh: '電腦視覺', en: 'Computer vision' } },
  { value: 'MLOps', label: { zh: 'MLOps', en: 'MLOps' } },
  { value: '資料科學', label: { zh: '資料科學', en: 'Data science' } },
  { value: 'AI 入門', label: { zh: 'AI 入門', en: 'AI foundations' } },
];

export const s = {
  kicker: { zh: '定價建議', en: 'Pricing advisor' },
  title: { zh: '你的時薪，該定多少？', en: 'What should your rate be?' },
  subtitle: {
    zh: '選你的領域、寫下技能與年資，酪梨會對照同級行情，給你一個合理的時薪區間和理由。定價前先有個底。',
    en: 'Pick your domain, note your skills and experience, and it gives you a sensible hourly range against your peers, with the reasoning. A grounded starting point before you price.',
  },
  domainLabel: { zh: '你的領域', en: 'Your domain' },
  skillsLabel: { zh: '技能與年資', en: 'Skills & experience' },
  skillsPlaceholder: {
    zh: '例：PyTorch、三年 CV 專案經驗、帶過新手',
    en: 'e.g. PyTorch, 3 yrs of CV projects, mentored beginners',
  },
  rateLabel: { zh: '目前想定的時薪（可選）', en: 'Rate you had in mind (optional)' },
  ratePlaceholder: { zh: '例：1200', en: 'e.g. 1200' },
  chipsLabel: { zh: '快速帶入常見技能', en: 'Quick-add common skills' },
  submit: { zh: '給我建議', en: 'Get a suggestion' },
  thinking: { zh: '酪梨估價中…', en: 'Estimating…' },
  resultKicker: { zh: '建議時薪區間', en: 'Suggested hourly range' },
  perHour: { zh: '／小時', en: '/hr' },
  reasonLabel: { zh: '為什麼是這個區間', en: 'Why this range' },
  offlineTag: { zh: '離線範例', en: 'Offline sample' },
  offlineNote: {
    zh: '目前顯示的是依領域的固定範例。接上 AI 之後，會依你的技能與年資即時估算。',
    en: 'Showing a fixed sample by domain. With AI connected, this is estimated live from your skills and experience.',
  },
  errorNote: {
    zh: '估價時出了點狀況，先給你一個依領域的參考區間。可以再試一次。',
    en: 'Something went wrong estimating — here is a reference range by domain. Try again.',
  },
  // 快速技能 chip（點了併進技能欄位）。跨領域通用的字眼。
  skillChips: [
    { zh: 'Python', en: 'Python' },
    { zh: 'PyTorch', en: 'PyTorch' },
    { zh: 'RAG', en: 'RAG' },
    { zh: '帶過新手', en: 'Mentored beginners' },
    { zh: '上線過服務', en: 'Shipped to production' },
    { zh: '三年以上經驗', en: '3+ years experience' },
  ],
} as const;
