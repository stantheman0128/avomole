// app/progress/page.tsx —— 學習儀表板（示意資料版，Server Component 殼）。
// 純前端 demo，不接資料庫；一位示範學生的假想進度，展示正式版樣貌。
import type { Metadata } from 'next';
import { ProgressDashboard } from './_components/Dashboard';

export const metadata: Metadata = {
  title: '學習儀表板｜Progress',
};

export default function ProgressPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
      <ProgressDashboard />
    </section>
  );
}
