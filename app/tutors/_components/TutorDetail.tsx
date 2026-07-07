'use client';
// app/tutors/_components/TutorDetail.tsx —— 講師個人頁主體（client），編輯/排版風。
// 只吃 Server Component 已剝好的 PublicTutor + Review[] + Endorsement[]（皆可序列化，無 hiddenScore）。
// 主角：能力雷達圖 + GitHub。六區塊用分隔線與版塊分段、非對稱，不堆一致白卡。
import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/lib/i18n';
import type { PublicTutor, Review, Endorsement } from '@/lib/types';
import { Badge } from '@/components/Badge';
import { RadarChart } from '@/components/RadarChart';
import { LevelChips } from '@/components/LevelChips';
import { BookButton } from './BookButton';
import { s } from '../strings';

// 英文模式下，中文 mock 內容區塊掛一個小標
function ZhContentTag() {
  const { lang, t } = useLang();
  if (lang !== 'en') return null;
  return <span className="ml-2 align-middle text-xs text-avo-ink/40">{t(s.demoContentZh)}</span>;
}

// 區塊標頭：kicker 角色字 + serif 大標
function SectionHead({ kicker, title }: { kicker: string; title: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="avo-kicker">{kicker}</p>
      <h2 className="avo-display mt-2 text-2xl text-avo-dark">{title}</h2>
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="font-mono text-sm text-avo-seed" aria-label={`${rating} / 5`}>
      {'★'.repeat(full)}
      <span className="text-avo-seed/25">{'★'.repeat(5 - full)}</span>
    </span>
  );
}

function Difficulty({ level }: { level: number }) {
  const n = Math.max(0, Math.min(5, Math.round(level)));
  return (
    <span className="font-mono text-avo-seed" aria-label={`${n} / 5`}>
      {'★'.repeat(n)}
      <span className="text-avo-seed/25">{'★'.repeat(5 - n)}</span>
    </span>
  );
}

export function TutorDetail({
  tutor,
  reviews,
  endorsements,
}: {
  tutor: PublicTutor;
  reviews: Review[];
  endorsements: Endorsement[];
}) {
  const { t } = useLang();
  const gh = tutor.github;
  const langEntries = Object.entries(gh.langDist).sort((a, b) => b[1] - a[1]);
  // 語言橫條配色（在 avo 色系內輪替）
  const barColors = ['bg-avo-main', 'bg-avo-dark', 'bg-avo-seed', 'bg-avo-light', 'bg-avo-main/60'];

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
      <Link href="/tutors" className="text-sm text-avo-seed hover:underline">
        {t(s.backToList)}
      </Link>

      {/* 1. 頭部：非對稱。左側大名字 + 徽章 + 頭銜，右側頭像 + 價格 + 預約。 */}
      <header className="mt-6 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {endorsements.length > 0 && <Badge kind="endorsed" />}
            {tutor.isReal && <Badge kind="real" />}
            {tutor.acceptsProjects && <Badge kind="projects" />}
          </div>
          <h1 className="avo-display mt-3 text-4xl text-avo-dark sm:text-5xl">{tutor.name}</h1>
          <p className="mt-2 text-avo-ink/70">{tutor.title}</p>
          <p className="avo-prose mt-4 leading-relaxed text-avo-ink/90">
            {tutor.bio}
            <ZhContentTag />
          </p>
        </div>

        <div className="flex items-center gap-4 sm:flex-col sm:items-end">
          <Image
            src={tutor.avatar}
            alt={tutor.name}
            width={112}
            height={112}
            className="h-24 w-24 shrink-0 rounded-3xl object-cover sm:h-28 sm:w-28"
          />
          <div className="sm:text-right">
            <p className="font-mono text-xl font-semibold text-avo-dark">
              NT${tutor.hourlyRate}
              <span className="text-sm font-normal text-avo-ink/50">{t(s.perHour)}</span>
            </p>
            <BookButton className="mt-3" />
          </div>
        </div>
      </header>

      <hr className="avo-rule my-10" />

      {/* 2. 能力側寫 —— 主角。雷達圖大、放左，引擎摘要 + 適教/難度放右，非對稱。 */}
      <section>
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="avo-kicker">{t(s.profileKicker)}</p>
            <h2 className="avo-display mt-2 text-2xl text-avo-dark">{t(s.aiProfileTitle)}</h2>
          </div>
          <span className="font-mono text-xs text-avo-seed">{t(s.aiProfileTag)}</span>
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,320px)_1fr] md:items-center">
          <div className="avo-panel flex items-center justify-center rounded-3xl p-4">
            <RadarChart radar={tutor.aiProfile.radar} size={300} />
          </div>
          <div className="min-w-0">
            <p className="avo-kicker">{t(s.summaryLabel)}</p>
            <p className="avo-prose mt-2 leading-relaxed text-avo-ink/90">
              {tutor.aiProfile.summary}
              <ZhContentTag />
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium text-avo-dark">{t(s.teachLevels)}</p>
                <LevelChips levels={tutor.teachLevels} />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-avo-dark">{t(s.difficulty)}</p>
                <Difficulty level={tutor.aiProfile.difficulty} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="avo-rule my-10" />

      {/* 3. GitHub —— 第二主角。語言分佈橫條放大當視覺重點，repos 在下。 */}
      <section>
        <SectionHead
          kicker={t(s.githubTitle)}
          title={
            <a
              href={`https://github.com/${gh.username}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono hover:text-avo-main"
            >
              @{gh.username}
            </a>
          }
        />

        {/* 語言分佈：主角，放上面、拉寬 */}
        <div className="avo-panel rounded-3xl p-5 sm:p-6">
          <p className="mb-3 text-sm font-medium text-avo-dark">{t(s.langDist)}</p>
          <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-avo-light/40">
            {langEntries.map(([lang, pct], i) => (
              <div
                key={lang}
                className={barColors[i % barColors.length]}
                style={{ width: `${pct}%` }}
                title={`${lang} ${pct}%`}
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
            {langEntries.map(([lang, pct], i) => (
              <span key={lang} className="flex items-center gap-1.5 text-xs text-avo-ink/70">
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-sm ${barColors[i % barColors.length]}`}
                />
                {lang} <span className="font-mono text-avo-ink/50">{pct}%</span>
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-avo-ink/70">
            {gh.activityNote}
            <ZhContentTag />
          </p>
        </div>

        {/* repos */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {gh.repos.map((repo) => (
            <div key={repo.name} className="avo-panel rounded-2xl p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-mono font-semibold text-avo-dark">{repo.name}</span>
                <span className="shrink-0 font-mono text-sm text-avo-seed">★ {repo.stars}</span>
              </div>
              <p className="mt-1.5 text-sm text-avo-ink/70">{repo.desc}</p>
              <span className="mt-2 inline-block font-mono text-xs text-avo-ink/50">{repo.lang}</span>
            </div>
          ))}
        </div>
      </section>

      <hr className="avo-rule my-10" />

      {/* 4. 作品集 */}
      <section>
        <SectionHead kicker={t(s.portfolioTitle)} title={t(s.portfolioTitle)} />
        <div className="grid gap-3 sm:grid-cols-2">
          {tutor.portfolio.map((p) => (
            <div key={p.title} className="avo-panel rounded-2xl p-4">
              <h3 className="font-semibold text-avo-dark">{p.title}</h3>
              <p className="mt-1 text-sm text-avo-ink/70">{p.desc}</p>
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm text-avo-seed hover:underline"
              >
                {t(s.viewProject)} →
              </a>
            </div>
          ))}
        </div>
      </section>

      <hr className="avo-rule my-10" />

      {/* 5. 評價：AI 摘要用淺塊、單則評價走分隔線列表不堆卡 */}
      <section>
        <SectionHead kicker={t(s.reviewsTitle)} title={t(s.reviewsTitle)} />
        <div className="rounded-2xl bg-avo-light/40 px-4 py-3">
          <span className="mr-2 font-mono text-xs font-medium text-avo-main">
            {t(s.reviewDigest)}
          </span>
          <span className="text-sm text-avo-ink/90">
            {tutor.aiProfile.reviewDigest}
            <ZhContentTag />
          </span>
        </div>
        <div className="mt-4 divide-y divide-avo-ink/10">
          {reviews.map((r) => (
            <div key={r.id} className="py-4 first:pt-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-avo-dark">{r.author}</span>
                <Stars rating={r.rating} />
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-avo-ink/80">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 名人推薦（有才顯示） */}
      {endorsements.length > 0 && (
        <>
          <hr className="avo-rule my-10" />
          <section>
            <SectionHead kicker={t(s.endorsementsTitle)} title={t(s.endorsementsTitle)} />
            <div className="grid gap-3 sm:grid-cols-2">
              {endorsements.map((e) => (
                <blockquote key={e.id} className="avo-panel rounded-2xl p-4">
                  <p className="text-sm leading-relaxed text-avo-ink/90">「{e.quote}」</p>
                  <footer className="mt-2 text-sm text-avo-dark">
                    <span className="font-medium">{e.endorserName}</span>
                    <span className="text-avo-ink/60"> · {e.endorserTitle}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>
        </>
      )}

      <hr className="avo-rule my-10" />

      {/* 6. 課程方案 */}
      <section>
        <SectionHead kicker={t(s.plansTitle)} title={t(s.plansTitle)} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tutor.plans.map((plan) => (
            <div key={plan.name} className="avo-panel flex flex-col rounded-2xl p-4">
              <h3 className="font-semibold text-avo-dark">{plan.name}</h3>
              <p className="mt-1 font-mono text-lg font-semibold text-avo-main">NT${plan.price}</p>
              <p className="mt-2 flex-1 text-sm text-avo-ink/70">{plan.desc}</p>
              <BookButton className="mt-3 w-full" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default TutorDetail;
