// app/dashboard/page.tsx —— 登入後臺。未登入導向 /login。
// 講師：講師頁管理（真 CRUD 建置中）。學生：帳號總覽。
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  const { name, email, role } = session.user;
  const isTutor = role === 'TUTOR';

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-avo-main">Dashboard</p>
      <h1 className="avo-display mt-3 text-3xl text-avo-dark">
        {isTutor ? '講師後臺' : '我的帳號'}
      </h1>
      <p className="mt-4 text-avo-ink/70">
        嗨{name ? `，${name}` : ''}。你以「{isTutor ? '講師' : '學生'}」身份登入（{email}）。
      </p>

      {isTutor ? (
        <div className="mt-8 avo-panel rounded-2xl p-5">
          <h2 className="avo-display text-lg text-avo-dark">上架你的講師頁（建置中）</h2>
          <p className="mt-2 text-sm text-avo-ink/70">
            很快就能在這裡編輯能力側寫卡、技能、方案與作品，接上 GitHub 讓 AI 幫你生側寫，發佈後出現在講師列表。
          </p>
        </div>
      ) : (
        <div className="mt-8 avo-panel rounded-2xl p-5">
          <h2 className="avo-display text-lg text-avo-dark">開始學 AI</h2>
          <p className="mt-2 text-sm text-avo-ink/70">
            用對話媒合找到適合你的講師，收藏與學習紀錄之後會出現在這裡。
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link href="/match" className="font-medium text-avo-main hover:text-avo-dark">
              AI 對話媒合 →
            </Link>
            <Link href="/tutors" className="font-medium text-avo-main hover:text-avo-dark">
              瀏覽講師 →
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
