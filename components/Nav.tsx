'use client';
// components/Nav.tsx —— 全站頂部導覽。吉祥物 logo＋站名、連結、登入鈕、中/EN 切換。
// Landing（/，深綠 drench）用深色版無縫接續（跟 Footer 同一套 pathname 判斷）；內頁維持近白 bar。
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useLang } from '@/lib/i18n';
import { BRAND } from '@/lib/brand';
import { NAV } from '@/lib/chrome-strings';

export function Nav() {
  const { lang, setLang, t } = useLang();
  const { data: session } = useSession();
  const pathname = usePathname();
  const brandName = lang === 'zh' ? BRAND.zh : BRAND.en;
  const user = session?.user;

  // Landing 是深綠浸染頁：Nav 也走深色，不再是一條淺 bar 壓深底。
  const onDark = pathname === '/';

  const linkCls = onDark ? 'text-avo-paper/80 hover:text-avo-light' : 'text-avo-ink/80 hover:text-avo-main';
  const langIdle = onDark ? 'text-avo-paper/85' : 'text-avo-dark';

  return (
    <header
      className={
        onDark
          ? 'avo-drenched sticky top-0 z-50 border-b border-avo-paper/15'
          : 'sticky top-0 z-50 border-b border-avo-light bg-avo-cream/90 backdrop-blur'
      }
    >
      <nav className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image src="/mascot.png" alt="" width={32} height={32} className="h-8 w-8" />
          <span className={`font-semibold ${onDark ? 'text-avo-paper' : 'text-avo-dark'}`}>{brandName}</span>
        </Link>

        <div className="ml-2 hidden items-center gap-4 text-sm md:flex">
          <Link href="/tutors" className={linkCls}>{t(NAV.findTutors)}</Link>
          <Link href="/match" className={linkCls}>{t(NAV.aiMatch)}</Link>
          <Link href="/classroom" className={linkCls}>{t(NAV.classroom)}</Link>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* 登入者都有後臺入口（訪客模式已移除） */}
          {user && (
            <Link href="/dashboard" className={`hidden text-sm sm:inline ${linkCls}`}>
              {t(NAV.dashboard)}
            </Link>
          )}

          {/* 中／EN 切換 */}
          <div
            className={`flex items-center overflow-hidden rounded-full border text-xs ${
              onDark ? 'border-avo-paper/30' : 'border-avo-main/40'
            }`}
          >
            <button
              type="button"
              onClick={() => setLang('zh')}
              className={`px-2.5 py-1 ${lang === 'zh' ? 'bg-avo-main text-white' : langIdle}`}
              aria-pressed={lang === 'zh'}
            >
              {NAV.langZh.zh}
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 ${lang === 'en' ? 'bg-avo-main text-white' : langIdle}`}
              aria-pressed={lang === 'en'}
            >
              {NAV.langEn.en}
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <span className={`hidden max-w-[8rem] truncate text-sm sm:inline ${onDark ? 'text-avo-paper' : 'text-avo-dark'}`}>
                {user.name || user.email}
              </span>
              <button
                type="button"
                onClick={() => {
                  // redirect:false + 用瀏覽器自身 origin 硬導向：避免 Auth.js 在 Zeabur 代理後把
                  // callbackUrl 解成容器內部 localhost:8080。
                  void signOut({ redirect: false }).then(() => {
                    window.location.href = '/';
                  });
                }}
                className={`rounded-full border px-3 py-1.5 text-sm ${
                  onDark
                    ? 'border-avo-paper/30 text-avo-paper hover:bg-avo-paper/10'
                    : 'border-avo-main/40 text-avo-dark hover:bg-avo-light/40'
                }`}
              >
                {t(NAV.logout)}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className={
                onDark
                  ? 'rounded-full bg-avo-main px-3 py-1.5 text-sm text-white hover:bg-avo-light hover:text-avo-dark'
                  : 'rounded-full bg-avo-dark px-3 py-1.5 text-sm text-avo-cream hover:bg-avo-main'
              }
            >
              {t(NAV.login)}
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Nav;
