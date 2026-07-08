'use client';
// app/progress/_components/Dashboard.tsx —— 學習儀表板（示意資料版）。
// 純前端，資料全來自 ../strings 的 DEMO；不接真資料庫（真進度追蹤是未來）。
// 編輯風：mono 數字列 + 細分隔線分段 + 進度條，不是一整排等大卡片。RWD 到 390px。
import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import { s, DEMO, type DemoCourse } from '../strings';

function Stat({ value, label, unit }: { value: string; label: string; unit?: string }) {
  return (
    <div>
      <div className="flex items-baseline gap-1">
        <span className="font-mono text-3xl text-avo-dark sm:text-4xl">{value}</span>
        {unit && <span className="font-mono text-sm text-avo-ink/55">{unit}</span>}
      </div>
      <p className="mt-1 text-xs text-avo-ink/60">{label}</p>
    </div>
  );
}

function CourseRow({ course, first }: { course: DemoCourse; first: boolean }) {
  const { t } = useLang();
  const pct = Math.max(0, Math.min(100, course.percent));
  return (
    <li>
      {!first && <hr className="avo-rule my-5" />}
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-base font-medium text-avo-dark">{t(course.title)}</h3>
        <span className="font-mono text-xs text-avo-seed">{t(course.domain)}</span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        {/* 進度條：細一條，用品牌綠填。track 用極淡 ink。 */}
        <div
          className="h-1.5 flex-1 overflow-hidden rounded-full"
          style={{ background: 'color-mix(in oklch, var(--color-avo-ink) 10%, transparent)' }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t(course.title)}
        >
          <div className="h-full rounded-full bg-avo-main" style={{ width: `${pct}%` }} />
        </div>
        <span className="shrink-0 font-mono text-xs text-avo-ink/70">{pct}%</span>
      </div>

      <p className="mt-1.5 font-mono text-xs text-avo-ink/50">
        {course.sessionsDone} / {course.sessionsTotal} {t(s.sessionsLabel)}
      </p>
    </li>
  );
}

export function ProgressDashboard() {
  const { t } = useLang();

  return (
    <div>
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <p className="avo-kicker">{t(s.kicker)}</p>
          <span className="rounded-full bg-avo-seed/15 px-2 py-0.5 font-mono text-[0.65rem] font-medium tracking-wide text-avo-seed">
            {t(s.demoTag)}
          </span>
        </div>
        <h1 className="avo-display mt-2 text-3xl text-avo-dark sm:text-4xl">{t(s.title)}</h1>
        <p className="avo-prose mt-3 text-avo-ink/70">{t(s.subtitle)}</p>
      </header>

      {/* 數字列：mono、用細線分隔，不做卡片 */}
      <div className="avo-panel rounded-3xl p-5 sm:p-6">
        <div className="grid grid-cols-3 divide-x divide-avo-ink/10">
          <div className="pr-3 sm:pr-5">
            <Stat value={String(DEMO.hours)} label={t(s.statHours)} unit={t(s.statHoursUnit)} />
          </div>
          <div className="px-3 sm:px-5">
            <Stat value={String(DEMO.streak)} label={t(s.statStreak)} unit={t(s.statStreakUnit)} />
          </div>
          <div className="pl-3 sm:pl-5">
            <Stat
              value={String(DEMO.mastered)}
              label={t(s.statMastered)}
              unit={t(s.statMasteredUnit) || undefined}
            />
          </div>
        </div>
      </div>

      {/* 課程進度 */}
      <section className="mt-10">
        <h2 className="avo-display text-2xl text-avo-dark sm:text-3xl">{t(s.coursesHeading)}</h2>
        <ul className="mt-5">
          {DEMO.courses.map((c, i) => (
            <CourseRow key={i} course={c} first={i === 0} />
          ))}
        </ul>
      </section>

      {/* 下一步建議：深綠浸染塊，跟上面白底資料區做份量對比 */}
      <section className="avo-drenched mt-10 rounded-3xl p-6 sm:p-7">
        <p className="font-mono text-xs tracking-wide text-avo-paper/70">{t(s.nextHeading)}</p>
        <p className="avo-prose mt-2 text-avo-paper">{t(s.nextBody)}</p>
        <div className="mt-4 border-t border-avo-paper/20 pt-4">
          <p className="font-mono text-[0.65rem] tracking-wide text-avo-paper/60">
            {t(s.nextCourseLabel)}
          </p>
          <p className="mt-1 text-sm font-medium text-avo-paper">{t(s.nextCourseName)}</p>
        </div>
      </section>

      <div className="mt-8">
        <Link
          href="/tutors"
          className="text-sm font-medium text-avo-main underline-offset-4 hover:underline"
        >
          {t(s.browseLink)}
        </Link>
      </div>

      <p className="mt-8 text-xs text-avo-ink/45">{t(s.demoNote)}</p>
    </div>
  );
}

export default ProgressDashboard;
