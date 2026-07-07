'use client';
// app/discover/_home/HeroSearch.tsx —— Hero 的大輸入框。送出導向 /match?q=<文字>；空字串就去 /match。
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from '@/lib/i18n';
import { HOME } from '../../home-strings';

export function HeroSearch() {
  const { t } = useLang();
  const router = useRouter();
  const [q, setQ] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = q.trim();
    router.push(text ? `/match?q=${encodeURIComponent(text)}` : '/match');
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-xl flex-col gap-2 sm:flex-row">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t(HOME.heroPlaceholder)}
        aria-label={t(HOME.heroPlaceholder)}
        className="avo-panel min-w-0 flex-1 rounded-full px-5 py-3 text-avo-ink outline-none transition-colors focus:border-avo-main"
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-avo-main px-6 py-3 font-medium text-avo-dark transition-colors hover:bg-avo-dark hover:text-avo-paper"
      >
        {t(HOME.heroSubmit)}
      </button>
    </form>
  );
}

export default HeroSearch;
