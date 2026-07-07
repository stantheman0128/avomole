// app/tutors/page.tsx —— 講師列表（Server Component）。
// 讀 db（server-only）→ 每位剝成 PublicTutor + 算平均評分 → 交給 client 篩選器。
// hiddenScore 永不外流：只用 toPublic() 後的物件當 props。
import { getTutors, getReviews, toPublic } from '@/lib/db';
import { TutorFilters, type RatedTutor } from './_components/TutorFilters';
import { ListHeader } from './_components/ListHeader';
import { DOMAINS, type Domain } from './strings';

export const dynamic = 'force-dynamic';

function avgRating(tutorId: number): number {
  const reviews = getReviews(tutorId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  // 四捨五入到最近的 0.5
  return Math.round((sum / reviews.length) * 2) / 2;
}

export default async function TutorsPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string }>;
}) {
  const { domain } = await searchParams;
  const initialDomain = DOMAINS.includes(domain as Domain) ? (domain as Domain) : undefined;

  const data: RatedTutor[] = getTutors().map((tut) => ({
    tutor: toPublic(tut),
    rating: avgRating(tut.id),
  }));

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <ListHeader />
      <TutorFilters data={data} initialDomain={initialDomain} />
    </section>
  );
}
