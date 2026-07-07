'use client';
// app/tutors/_components/ListHeader.tsx —— 列表頁標題區（用 useLang() 走雙語）。
import { useLang } from '@/lib/i18n';
import { s } from '../strings';

export function ListHeader() {
  const { t } = useLang();
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold text-avo-dark sm:text-3xl">{t(s.listTitle)}</h1>
      <p className="mt-1 text-avo-ink/70">{t(s.listSubtitle)}</p>
    </header>
  );
}

export default ListHeader;
