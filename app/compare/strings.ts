// app/compare/strings.ts —— /compare 講師並排比較頁的 UI 字串（雙語）。
// 值為 {zh, en}，交給 lib/i18n 的 t() 取字。表格列標題也在這裡。
export const s = {
  kicker: { zh: '講師並排比較', en: 'Side-by-side comparison' },
  title: { zh: '兩位講師，攤開來比', en: 'Two tutors, laid side by side' },
  subtitle: {
    zh: '選兩位講師，把技能、時薪、適教程度、方案和能力雷達放在一起看，不用在分頁之間來回切。',
    en: 'Pick two tutors and see skills, rate, levels, plans and the capability radar together — no tab-hopping.',
  },
  pickA: { zh: '講師 A', en: 'Tutor A' },
  pickB: { zh: '講師 B', en: 'Tutor B' },
  pickPlaceholder: { zh: '選一位講師…', en: 'Choose a tutor…' },
  samePairHint: { zh: '請選兩位不同的講師。', en: 'Please pick two different tutors.' },

  // 表格列
  rowRate: { zh: '時薪', en: 'Hourly rate' },
  rowDomains: { zh: '領域', en: 'Domains' },
  rowSkills: { zh: '技能', en: 'Skills' },
  rowLevels: { zh: '適教程度', en: 'Teaches' },
  rowProjects: { zh: '可接案', en: 'Open to projects' },
  rowPlans: { zh: '課程方案', en: 'Plans' },
  rowRadar: { zh: '能力雷達', en: 'Capability radar' },
  yes: { zh: '是', en: 'Yes' },
  no: { zh: '否', en: 'No' },
  perHour: { zh: ' /時', en: ' /hr' },

  blurbKicker: { zh: 'AI 比較短評', en: 'AI comparison' },
  blurbLoading: { zh: '酪梨比較中…', en: 'Comparing…' },
  offlineTag: { zh: '離線建議', en: 'Offline suggestion' },
  viewProfile: { zh: '看完整側寫 →', en: 'Full profile →' },
} as const;
