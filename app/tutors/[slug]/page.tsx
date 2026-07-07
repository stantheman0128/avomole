// app/tutors/[slug]/page.tsx —— 講師個人頁（Server Component）。
// getTutorBySlug → null 則 notFound()；取 reviews / endorsements；一律 toPublic() 後才傳給 client。
import { notFound } from 'next/navigation';
import { getTutorBySlug, getReviews, getEndorsements, toPublic } from '@/lib/db';
import { TutorDetail } from '../_components/TutorDetail';

export const dynamic = 'force-dynamic';

export default async function TutorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tutor = await getTutorBySlug(slug);
  if (!tutor) notFound();

  const reviews = await getReviews(tutor.id);
  const endorsements = await getEndorsements(tutor.id);

  return (
    <TutorDetail tutor={toPublic(tutor)} reviews={reviews} endorsements={endorsements} />
  );
}
