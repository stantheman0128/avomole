'use client';
// components/Footer.tsx —— 每頁必有。誠實示意聲明＋次要入口（教室／藍圖）＋ GitHub。
// Landing（/）用 drench 底無縫接續；內頁用深橄欖灰 footer 收尾。
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '@/lib/i18n';
import { BRAND, REPO_URL } from '@/lib/brand';
import { FOOTER } from '@/lib/chrome-strings';

export function Footer() {
  const { lang, t } = useLang();
  const pathname = usePathname();
  const brandName = lang === 'zh' ? BRAND.zh : BRAND.en;
  const year = new Date().getFullYear();

  const onDark = pathname === '/';

  return (
    <footer className={onDark ? 'avo-drenched' : 'bg-avo-dark text-avo-paper'}>
      <div className="mx-auto max-w-6xl px-5 py-10">
        <hr className="avo-rule-on-dark" />
        <p className="mt-6 text-sm text-avo-paper/85">{t(FOOTER.disclaimer)}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-avo-paper/70">
          <span>© {year} {brandName}</span>
          <span aria-hidden>·</span>
          <span>{t(FOOTER.rights)}</span>
          <span aria-hidden>·</span>
          <Link href="/classroom" className="text-avo-main underline-offset-4 hover:underline">
            {t(FOOTER.classroom)}
          </Link>
          <span aria-hidden>·</span>
          <Link href="/roadmap" className="text-avo-main underline-offset-4 hover:underline">
            {t(FOOTER.roadmap)}
          </Link>
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
