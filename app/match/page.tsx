// app/match/page.tsx —— AI 媒合聊天室（Server Component）。
// 讀 db（server-only）→ 每位剝成 PublicTutor 傳給 client；hiddenScore 只留在 /api/chat。
// ?q= 帶入 initialQuery，client 掛載後自動送出第一問。
import { getTutors, toPublic } from '@/lib/db';
import { MatchChat } from './_components/MatchChat';

export const dynamic = 'force-dynamic';

export default async function MatchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const tutors = getTutors().map(toPublic);

  return (
    <section className="mx-auto flex max-w-3xl flex-col px-4 py-8 sm:py-12">
      <MatchChat tutors={tutors} initialQuery={typeof q === 'string' ? q : ''} />
    </section>
  );
}
