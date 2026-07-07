// app/learning-path/page.tsx —— 學習路徑規劃（Server Component 殼）。
// 讀 db（server-only）→ 每位剝成 PublicTutor 傳給 client；hiddenScore 只留在 /api/learning-path。
// 路徑本身由 client 打 /api/learning-path 取得，這裡只負責把講師清單備好。
import type { Metadata } from 'next';
import { getTutors, toPublic } from '@/lib/db';
import { PathPlanner } from './_components/PathPlanner';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '學習路徑規劃｜Learning path',
};

export default async function LearningPathPage() {
  const tutors = (await getTutors()).map(toPublic);

  return (
    <section className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
      <PathPlanner tutors={tutors} />
    </section>
  );
}
