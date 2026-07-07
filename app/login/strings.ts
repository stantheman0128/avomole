// app/login/strings.ts —— 登入頁 UI 字串（雙語）。站名／slogan 一律取自 lib/brand.ts。
export const LOGIN = {
  heading: { zh: '登入', en: 'Sign in' },
  subheading: {
    zh: '登入後可以收藏講師、記錄媒合結果。現在也可以直接以訪客身份逛。',
    en: 'Sign in to save tutors and your match history, or just keep browsing as a guest.',
  },
  emailLabel: { zh: '電子郵件', en: 'Email' },
  emailPlaceholder: { zh: 'you@example.com', en: 'you@example.com' },
  passwordLabel: { zh: '密碼', en: 'Password' },
  passwordPlaceholder: { zh: '輸入密碼', en: 'Enter your password' },
  submit: { zh: '登入', en: 'Sign in' },
  or: { zh: '或', en: 'or' },
  google: { zh: '使用 Google 登入', en: 'Continue with Google' },
  noAccount: { zh: '還沒有帳號？', en: "Don't have an account?" },
  signup: { zh: '註冊', en: 'Sign up' },
  // Demo 提示：讓評審知道帳號系統在規劃內
  demoNote: {
    zh: 'Demo 版尚未接真帳號系統，任何操作都會直接帶你以訪客身份繼續。',
    en: 'This demo has no real auth yet, so any action just continues you as a guest.',
  },
  // toast 那顆 🥑 是全站唯一允許的 emoji（依鐵則）
  toast: { zh: 'Demo 版請以訪客身份繼續探索 🥑', en: 'Demo 版請以訪客身份繼續探索 🥑' },
} as const;
