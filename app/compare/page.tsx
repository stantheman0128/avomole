// app/compare/page.tsx —— 講師並排比較（Server Component 殼）。
// 讀 db（server-only）→ 每位剝成 PublicTutor 傳給 client；hiddenScore 只留在 /api/compare。
// ?a=slug&b=slug 帶入初始兩位；client 也有下拉選單可換。
import type { Metadata } from 'next';
import { getTutors, toPublic } from '@/lib/db';
import { CompareView } from './_components/CompareView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '講師並排比較｜Compare tutors',
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const { a, b } = await searchParams;
  const tutors = (await getTutors()).map(toPublic);
  const slugs = new Set(tutors.map((t) => t.slug));

  // 只採用實際存在的 slug；不合法就留空由使用者自選。
  const initialA = typeof a === 'string' && slugs.has(a) ? a : '';
  const initialB = typeof b === 'string' && slugs.has(b) && b !== a ? b : '';

  return (
    <section className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
      <CompareView tutors={tutors} initialA={initialA} initialB={initialB} />
    </section>
  );
}
