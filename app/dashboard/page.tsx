// app/dashboard/page.tsx —— 登入後臺。未登入導向 /login。
// 講師：完整講師頁 CRUD（建草稿 → 編輯 → AI 側寫 → 發佈）。學生：帳號總覽。
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { loadOrCreateProfile } from './profile';
import { TutorEditor } from './_components/TutorEditor';
import { BecomeTutor } from './_components/BecomeTutor';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  const { id, name, email, role } = session.user;
  const isTutor = role === 'TUTOR';

  // 講師：載入（或首次登入時建立）自己的講師草稿。hiddenScore 已在 profile.ts 剝除，不進 client。
  const profile = isTutor ? await loadOrCreateProfile(id, name ?? null, email ?? null) : null;

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <p className="avo-kicker">Dashboard</p>
      <h1 className="avo-display mt-3 text-3xl text-avo-dark">
        {isTutor ? '講師後臺' : '我的帳號'}
      </h1>
      <p className="mt-4 text-avo-ink/70">
        嗨{name ? `，${name}` : ''}。你以「{isTutor ? '講師' : '學生'}」身份登入（{email}）。
      </p>

      {isTutor && profile ? (
        <TutorEditor profile={profile} />
      ) : (
        <>
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
          {/* 學生（含 Google 註冊者）可在這裡補選角色升級成講師 */}
          <BecomeTutor />
        </>
      )}
    </section>
  );
}
