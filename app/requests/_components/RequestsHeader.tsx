'use client';
// app/requests/_components/RequestsHeader.tsx —— 頁頭（雙語）。i18n 只在 client，故頁標抽成小 client 元件。
import { useLang } from '@/lib/i18n';
import { s } from '../strings';

export function RequestsHeader() {
  const { t } = useLang();
  return (
    <header>
      <p className="avo-kicker">{t(s.kicker)}</p>
      <h1 className="avo-display mt-3 text-3xl text-avo-dark sm:text-4xl">{t(s.title)}</h1>
      <p className="avo-prose mt-4 text-avo-ink/70">{t(s.intro)}</p>
    </header>
  );
}

export default RequestsHeader;
