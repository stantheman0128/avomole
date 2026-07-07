// lib/brand.ts —— 品牌字串唯一來源，任何頁面不得寫死站名／slogan
export const BRAND = {
  zh: '酪梨醬 AI 家教網',
  en: 'Guacamole AI',
  sloganZh: '學 AI，找酪梨醬。',
  sloganEn: 'Dip into AI.',
} as const;

// GitHub repo（頁尾連結用）。實際 URL 由部署時決定，先放佔位。
export const REPO_URL = 'https://github.com/stantheman0128/avomole';
