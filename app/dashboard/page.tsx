// app/dashboard/page.tsx —— 講師後臺最小佔位（Wave B2 再做真 CRUD）。
// Auth-gated：未登入導向 /login；登入但非講師導向 /discover。
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (session.user.role !== 'TUTOR') redirect('/discover');

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-avo-main">Dashboard</p>
      <h1 className="mt-3 text-3xl font-bold text-avo-dark">講師後臺（建置中）</h1>
      <p className="mt-4 text-avo-ink/70">
        嗨{session.user.name ? `，${session.user.name}` : ''}。你的講師頁管理介面正在建置中，
        很快就能在這裡編輯側寫卡、發佈上架。
      </p>
    </section>
  );
}
