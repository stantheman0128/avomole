'use client';
// components/Nav.tsx —— 全站頂部導覽。吉祥物 logo＋站名、連結、登入鈕、中/EN 切換、訪客 pill。
import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/lib/i18n';
import { BRAND } from '@/lib/brand';
import { NAV } from '@/lib/chrome-strings';

export function Nav() {
  const { lang, setLang, t } = useLang();
  const brandName = lang === 'zh' ? BRAND.zh : BRAND.en;

  return (
    <header className="sticky top-0 z-50 border-b border-avo-light bg-avo-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image src="/mascot.png" alt="" width={32} height={32} className="h-8 w-8" />
          <span className="font-semibold text-avo-dark">{brandName}</span>
        </Link>

        <div className="ml-2 hidden items-center gap-4 text-sm text-avo-ink/80 md:flex">
          <Link href="/tutors" className="hover:text-avo-main">{t(NAV.findTutors)}</Link>
          <Link href="/match" className="hover:text-avo-main">{t(NAV.aiMatch)}</Link>
          <Link href="/classroom" className="hover:text-avo-main">{t(NAV.classroom)}</Link>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden rounded-full bg-avo-light px-2.5 py-0.5 text-xs text-avo-dark sm:inline">
            {t(NAV.guestMode)}
          </span>

          {/* 中／EN 切換 */}
          <div className="flex items-center overflow-hidden rounded-full border border-avo-main/40 text-xs">
            <button
              type="button"
              onClick={() => setLang('zh')}
              className={`px-2.5 py-1 ${lang === 'zh' ? 'bg-avo-main text-white' : 'text-avo-dark'}`}
              aria-pressed={lang === 'zh'}
            >
              {NAV.langZh.zh}
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 ${lang === 'en' ? 'bg-avo-main text-white' : 'text-avo-dark'}`}
              aria-pressed={lang === 'en'}
            >
              {NAV.langEn.en}
            </button>
          </div>

          <Link
            href="/login"
            className="rounded-full bg-avo-dark px-3 py-1.5 text-sm text-avo-cream hover:bg-avo-main"
          >
            {t(NAV.login)}
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Nav;
