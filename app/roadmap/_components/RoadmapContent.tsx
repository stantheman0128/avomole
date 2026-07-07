'use client';
// app/roadmap/_components/RoadmapContent.tsx —— 藍圖頁主體（client，要 useLang）。
// 編輯/排版風：近白內頁 ground、serif 大標 hero、三組功能用 eyebrow + 分隔線分段。
// 每個功能是一條「排版條目」（標題 + 一句說明 + 狀態徽章），不是等大卡片牆。
// 已上線 → 附「去看看 →」連到對應頁；規劃中／Demo → 配 DemoFrame 示意框。
import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import { ROADMAP, STATUS_LABEL, type Feature, type Status } from '../strings';
import { DemoFrame } from './DemoFrame';

// 狀態徽章：四種狀態各自配色，全用 avo-* tokens。不 import 共用 Badge（那是講師卡的，語義不同）。
const STATUS_STYLE: Record<Status, string> = {
  live: 'bg-avo-main text-avo-dark',
  liveDemo: 'border border-avo-main/50 text-avo-main',
  planned: 'bg-avo-seed/15 text-avo-seed',
  cannedDemo: 'bg-avo-dark text-avo-cream',
};

function StatusBadge({ status }: { status: Status }) {
  const { t } = useLang();
  const live = status === 'live';
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[status]}`}
    >
      {live && <span aria-hidden>●</span>}
      {t(STATUS_LABEL[status])}
    </span>
  );
}

// 一條功能：左側標題+說明+徽章，右側（若有連結）去看看。規劃中／Demo 另起一行放示意框。
function FeatureRow({ feature }: { feature: Feature }) {
  const { t } = useLang();
  const isDemo = feature.status === 'planned' || feature.status === 'cannedDemo';
  const linked = Boolean(feature.href);

  return (
    <div>
      <div className="grid gap-x-6 gap-y-3 sm:grid-cols-[1fr_auto] sm:items-baseline">
        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h3 className="avo-display text-xl text-avo-dark sm:text-2xl">{t(feature.title)}</h3>
            <StatusBadge status={feature.status} />
          </div>
          <p className="avo-prose mt-2 text-avo-ink/75">{t(feature.line)}</p>
        </div>

        {linked && (
          <Link
            href={feature.href!}
            className="group inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-avo-main underline-offset-4 hover:underline sm:justify-self-end"
          >
            {t(ROADMAP.goSee)}
            <span
              aria-hidden
              className="transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out-quart)] group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        )}
      </div>

      {/* 規劃中／Demo 的功能：配一格 Demo 影片示意框，代表之後會有示範影片 */}
      {isDemo && (
        <div className="mt-5 max-w-xl">
          <DemoFrame label={t(feature.title)} />
        </div>
      )}
    </div>
  );
}

export function RoadmapContent() {
  const { t } = useLang();

  return (
    <div className="mx-auto max-w-5xl px-5">
      {/* Hero：非對稱，大字排版靠左。不置中三件式。 */}
      <section className="pt-14 pb-10 sm:pt-20 sm:pb-14">
        <p className="avo-kicker">{t(ROADMAP.kicker)}</p>
        <h1 className="avo-display mt-5 max-w-3xl text-[clamp(2.25rem,6vw,4rem)] text-avo-dark">
          {t(ROADMAP.heroTitle)}
        </h1>
        <p className="avo-prose mt-6 text-base leading-relaxed text-avo-ink/75 sm:text-lg">
          {t(ROADMAP.heroLead)}
        </p>
      </section>

      {/* 三組功能。每組：eyebrow 角色字 + serif 標題 + 一句 lead，然後用分隔線串起條目。 */}
      {ROADMAP.groups.map((group) => (
        <section key={group.id} className="border-t border-avo-ink/15 py-12 sm:py-16">
          <div className="max-w-2xl">
            <p className="avo-kicker">{t(group.eyebrow)}</p>
            <h2 className="avo-display mt-3 text-2xl text-avo-dark sm:text-3xl">
              {t(group.heading)}
            </h2>
            <p className="avo-prose mt-3 text-avo-ink/70">{t(group.lead)}</p>
          </div>

          <div className="mt-10 space-y-9">
            {group.features.map((feature, i) => (
              <div key={feature.id}>
                {i > 0 && <hr className="avo-rule mb-9" />}
                <FeatureRow feature={feature} />
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* 收尾一句 */}
      <section className="border-t border-avo-ink/15 py-12 sm:py-14">
        <p className="avo-prose text-sm leading-relaxed text-avo-ink/60">{t(ROADMAP.footNote)}</p>
      </section>
    </div>
  );
}

export default RoadmapContent;
