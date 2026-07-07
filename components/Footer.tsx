'use client';
// components/Footer.tsx —— 每頁必有。含示意聲明（SPEC §2）＋ GitHub repo 連結。
import { useLang } from '@/lib/i18n';
import { BRAND, REPO_URL } from '@/lib/brand';
import { FOOTER } from '@/lib/chrome-strings';

export function Footer() {
  const { lang, t } = useLang();
  const brandName = lang === 'zh' ? BRAND.zh : BRAND.en;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-avo-light bg-avo-dark text-avo-cream">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm">
        <p className="text-avo-cream/90">{t(FOOTER.disclaimer)}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-avo-cream/70">
          <span>© {year} {brandName}</span>
          <span>·</span>
          <span>{t(FOOTER.rights)}</span>
          <span>·</span>
          <a href={REPO_URL} target="_blank" rel="noreferrer" className="underline hover:text-avo-light">
            {t(FOOTER.repo)}
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
