'use client';
// lib/i18n.tsx —— 無框架 i18n。useLang() 回 {lang, setLang, t}，t() 吃 {zh, en}。
// 語言選擇存 localStorage，Nav 右上「中／EN」切換。
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type Lang = 'zh' | 'en';

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (s: { zh: string; en: string }) => string;
}

const Ctx = createContext<LangCtx | null>(null);
const STORAGE_KEY = 'avomole.lang';

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('zh');

  // 首渲染後從 localStorage 補讀，避免 SSR/CSR 不一致的 hydration 警告
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (saved === 'zh' || saved === 'en') setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const t = useCallback((s: { zh: string; en: string }) => (lang === 'zh' ? s.zh : s.en), [lang]);

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLang must be used within <LangProvider>');
  return ctx;
}
