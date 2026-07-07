'use client';
// app/page.tsx —— 首頁 hero 佔位（scaffold）。Task 6 會覆寫成完整首頁八區塊。
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useLang } from '@/lib/i18n';
import { BRAND } from '@/lib/brand';

export default function HomePage() {
  const { lang, t } = useLang();
  const router = useRouter();
  const [q, setQ] = useState('');
  const slogan = lang === 'zh' ? BRAND.sloganZh : BRAND.sloganEn;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = q.trim();
    router.push(text ? `/match?q=${encodeURIComponent(text)}` : '/match');
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center">
      <Image src="/mascot.svg" alt="" width={120} height={120} className="mx-auto h-28 w-28" priority />
      <h1 className="mt-6 text-3xl font-bold text-avo-dark sm:text-4xl">{slogan}</h1>
      <p className="mt-3 text-avo-ink/70">
        {t({
          zh: 'AI 領域人才的專門媒合平臺，用 AI 評估教 AI 的人。',
          en: 'The matchmaking platform for AI talent — AI that evaluates those who teach AI.',
        })}
      </p>

      <form onSubmit={submit} className="mx-auto mt-8 flex max-w-xl gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t({ zh: '告訴酪梨你想學什麼…', en: 'Tell the avocado what you want to learn…' })}
          className="flex-1 rounded-full border border-avo-main/40 bg-white px-5 py-3 text-avo-ink outline-none focus:border-avo-main"
        />
        <button
          type="submit"
          className="rounded-full bg-avo-main px-6 py-3 font-medium text-white hover:bg-avo-dark"
        >
          {t({ zh: '問酪梨', en: 'Ask' })}
        </button>
      </form>
    </section>
  );
}
