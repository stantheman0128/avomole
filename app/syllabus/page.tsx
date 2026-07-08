// app/syllabus/page.tsx —— AI 課綱產生器（Server Component 殼）。
// 本頁不碰 db／講師，課綱由 client 打 /api/syllabus 取得，這裡只放版面與 metadata。
import type { Metadata } from 'next';
import { SyllabusMaker } from './_components/SyllabusMaker';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'AI 課綱產生器｜Syllabus generator',
};

export default function SyllabusPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
      <SyllabusMaker />
    </section>
  );
}
