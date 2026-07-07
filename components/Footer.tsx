'use client';
// components/Footer.tsx —— 每頁必有。含示意聲明（SPEC §2）＋ GitHub repo 連結。
// 深色頁（Landing，/）用 drench 底無縫接續，不再是一條淺色 bar 壓在深綠上；
// 近白內頁維持深綠 footer 收尾，但描邊改極淡、底色跟 Landing 分開。
import { usePathname } from 'next/navigation';
import { useLang } from '@/lib/i18n';
import { BRAND, REPO_URL } from '@/lib/brand';
import { FOOTER } from '@/lib/chrome-strings';

export function Footer() {
  const { lang, t } = useLang();
  const pathname = usePathname();
  const brandName = lang === 'zh' ? BRAND.zh : BRAND.en;
  const year = new Date().getFullYear();

  // Landing（/）是深綠浸染頁：footer 接續同一塊 drench，中間不留任何淺色接縫。
  const onDark = pathname === '/';

  return (
    <footer className={onDark ? 'avo-drenched' : 'bg-avo-dark text-avo-paper'}>
      <div className="mx-auto max-w-6xl px-5 py-10">
        {/* 兩種底都是深色，分隔線一律用 on-dark 版 */}
        <hr className="avo-rule-on-dark" />
        <p className="mt-6 text-sm text-avo-paper/85">{t(FOOTER.disclaimer)}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-avo-paper/60">
          <span>© {year} {brandName}</span>
          <span aria-hidden>·</span>
          <span>{t(FOOTER.rights)}</span>
          <span aria-hidden>·</span>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-avo-main underline-offset-4 hover:underline"
          >
            {t(FOOTER.repo)}
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
