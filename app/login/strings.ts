// app/login/strings.ts —— 登入頁 UI 字串（雙語）。站名／slogan 一律取自 lib/brand.ts。
export const LOGIN = {
  heading: { zh: '登入', en: 'Sign in' },
  subheading: {
    zh: '登入後可以管理你的講師頁、記錄媒合結果。也可以直接以訪客身份逛。',
    en: 'Sign in to manage your tutor page and match history, or keep browsing as a guest.',
  },
  emailLabel: { zh: '電子郵件', en: 'Email' },
  emailPlaceholder: { zh: 'you@example.com', en: 'you@example.com' },
  passwordLabel: { zh: '密碼', en: 'Password' },
  passwordPlaceholder: { zh: '輸入密碼', en: 'Enter your password' },
  submit: { zh: '登入', en: 'Sign in' },
  submitting: { zh: '登入中…', en: 'Signing in…' },
  or: { zh: '或', en: 'or' },
  google: { zh: '使用 Google 登入', en: 'Continue with Google' },
  googleDisabled: {
    zh: 'Google 登入尚未設定（缺 OAuth 金鑰），請先用 Email 登入。',
    en: 'Google sign-in is not configured yet. Please use email for now.',
  },
  noAccount: { zh: '還沒有帳號？', en: "Don't have an account?" },
  signup: { zh: '註冊', en: 'Sign up' },
  errorInvalid: {
    zh: '電子郵件或密碼錯誤。',
    en: 'Invalid email or password.',
  },
  errorGeneric: {
    zh: '登入時發生問題，請稍後再試。',
    en: 'Something went wrong. Please try again.',
  },
} as const;
