'use client';
// app/tutors/_components/TutorDetail.tsx —— 講師個人頁主體（client）。
// 只吃 Server Component 已剝好的 PublicTutor + Review[] + Endorsement[]（皆可序列化，無 hiddenScore）。
// 六區塊：頭部 / AI 側寫 / GitHub / 作品集 / 評價 / 課程方案，外加名人推薦。
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-xl font-bold text-avo-dark">{children}</h2>;
}

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="font-mono text-sm text-avo-seed" aria-label={`${rating} / 5`}>
      {'★'.repeat(full)}
      <span className="text-avo-seed/30">{'★'.repeat(5 - full)}</span>
    </span>
  );
}

function Difficulty({ level }: { level: number }) {
  const n = Math.max(0, Math.min(5, Math.round(level)));
  return (
    <span className="font-mono text-avo-seed" aria-label={`${n} / 5`}>
      {'★'.repeat(n)}
      <span className="text-avo-seed/30">{'★'.repeat(5 - n)}</span>
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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <Link href="/tutors" className="text-sm text-avo-seed hover:underline">
        {t(s.backToList)}
      </Link>

      {/* 1. 頭部 */}
      <header className="mt-4 flex flex-col gap-4 rounded-2xl border border-avo-light bg-white p-5 sm:flex-row sm:items-start sm:p-6">
        <Image
          src={tutor.avatar}
          alt={tutor.name}
          width={96}
          height={96}
          className="h-24 w-24 shrink-0 rounded-2xl bg-avo-light object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-avo-dark">{tutor.name}</h1>
            {endorsements.length > 0 && <Badge kind="endorsed" />}
            {tutor.isReal && <Badge kind="real" />}
            {tutor.acceptsProjects && <Badge kind="projects" />}
          </div>
          <p className="mt-1 text-avo-ink/70">{tutor.title}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="font-mono text-lg font-semibold text-avo-dark">
              NT${tutor.hourlyRate}
              <span className="text-sm font-normal text-avo-ink/50">{t(s.perHour)}</span>
            </span>
            <BookButton />
          </div>
        </div>
      </header>

      {/* 自傳（中文 mock 內容） */}
      <p className="mt-4 rounded-2xl bg-white/70 px-5 py-4 leading-relaxed text-avo-ink/90">
        {tutor.bio}
        <ZhContentTag />
      </p>

      {/* 2. AI 能力側寫卡 */}
      <section className="mt-6 rounded-2xl border border-avo-main/30 bg-avo-light/40 p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-2">
          <SectionTitle>{t(s.aiProfileTitle)}</SectionTitle>
          <span className="rounded-full bg-avo-dark px-2.5 py-0.5 text-xs text-avo-cream">
            {t(s.aiProfileTag)}
          </span>
        </div>
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <div className="shrink-0">
            <RadarChart radar={tutor.aiProfile.radar} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="leading-relaxed text-avo-ink/90">
              {tutor.aiProfile.summary}
              <ZhContentTag />
            </p>
            <div className="mt-4">
              <p className="mb-1.5 text-sm font-medium text-avo-dark">{t(s.teachLevels)}</p>
              <LevelChips levels={tutor.teachLevels} />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm font-medium text-avo-dark">{t(s.difficulty)}</span>
              <Difficulty level={tutor.aiProfile.difficulty} />
            </div>
          </div>
        </div>
      </section>

      {/* 3. GitHub 區 */}
      <section className="mt-6">
        <SectionTitle>
          {t(s.githubTitle)}
          <a
            href={`https://github.com/${gh.username}`}
            target="_blank"
            rel="noreferrer"
            className="ml-2 align-middle font-mono text-sm font-normal text-avo-seed hover:underline"
          >
            @{gh.username}
          </a>
        </SectionTitle>

        <div className="grid gap-3 sm:grid-cols-2">
          {gh.repos.map((repo) => (
            <div key={repo.name} className="rounded-xl border border-avo-light bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-mono font-semibold text-avo-dark">{repo.name}</span>
                <span className="shrink-0 font-mono text-sm text-avo-seed">★ {repo.stars}</span>
              </div>
              <p className="mt-1 text-sm text-avo-ink/70">{repo.desc}</p>
              <span className="mt-2 inline-block rounded-md bg-avo-light/60 px-2 py-0.5 font-mono text-xs text-avo-dark">
                {repo.lang}
              </span>
            </div>
          ))}
        </div>

        {/* 語言分佈橫條 */}
        <div className="mt-4 rounded-xl border border-avo-light bg-white p-4">
          <p className="mb-2 text-sm font-medium text-avo-dark">{t(s.langDist)}</p>
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-avo-light/40">
            {langEntries.map(([lang, pct], i) => (
              <div
                key={lang}
                className={barColors[i % barColors.length]}
                style={{ width: `${pct}%` }}
                title={`${lang} ${pct}%`}
              />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {langEntries.map(([lang, pct], i) => (
              <span key={lang} className="flex items-center gap-1.5 text-xs text-avo-ink/70">
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-sm ${barColors[i % barColors.length]}`}
                />
                {lang} <span className="font-mono text-avo-ink/50">{pct}%</span>
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm text-avo-ink/70">
            {gh.activityNote}
            <ZhContentTag />
          </p>
        </div>
      </section>

      {/* 4. 作品集 */}
      <section className="mt-6">
        <SectionTitle>{t(s.portfolioTitle)}</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {tutor.portfolio.map((p) => (
            <div key={p.title} className="rounded-xl border border-avo-light bg-white p-4">
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

      {/* 5. 評價區 */}
      <section className="mt-6">
        <SectionTitle>{t(s.reviewsTitle)}</SectionTitle>
        <div className="mb-4 rounded-xl border border-avo-main/30 bg-avo-light/40 px-4 py-3">
          <span className="mr-2 rounded-full bg-avo-main px-2 py-0.5 text-xs font-medium text-white">
            {t(s.reviewDigest)}
          </span>
          <span className="text-sm text-avo-ink/90">
            {tutor.aiProfile.reviewDigest}
            <ZhContentTag />
          </span>
        </div>
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-avo-light bg-white p-4">
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
        <section className="mt-6">
          <SectionTitle>{t(s.endorsementsTitle)}</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            {endorsements.map((e) => (
              <blockquote
                key={e.id}
                className="rounded-xl border border-avo-seed/30 bg-white p-4"
              >
                <p className="text-sm leading-relaxed text-avo-ink/90">「{e.quote}」</p>
                <footer className="mt-2 text-sm text-avo-dark">
                  <span className="font-medium">{e.endorserName}</span>
                  <span className="text-avo-ink/60"> · {e.endorserTitle}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {/* 6. 課程方案 */}
      <section className="mt-6">
        <SectionTitle>{t(s.plansTitle)}</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tutor.plans.map((plan) => (
            <div key={plan.name} className="flex flex-col rounded-xl border border-avo-light bg-white p-4">
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
