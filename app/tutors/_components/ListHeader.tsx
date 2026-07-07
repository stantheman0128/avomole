'use client';
// app/tutors/_components/ListHeader.tsx —— 列表頁標題區（編輯風大字，走雙語）。
import { useLang } from '@/lib/i18n';
import { s } from '../strings';

export function ListHeader() {
  const { t } = useLang();
  return (
    <header className="mb-8 max-w-2xl">
      <p className="avo-kicker">{t(s.listKicker)}</p>
      <h1 className="avo-display mt-3 text-4xl text-avo-dark sm:text-5xl">{t(s.listTitle)}</h1>
      <p className="avo-prose mt-4 text-avo-ink/70">{t(s.listSubtitle)}</p>
    </header>
  );
}

export default ListHeader;
