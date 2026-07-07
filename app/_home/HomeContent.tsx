'use client';
// app/_home/HomeContent.tsx —— 首頁主體（client）。
// 吃 server 傳入的純資料 props（featured 已 toPublic、endorsements 已攤平），用 t() 渲染區塊 2–7。
// 區塊 1（Nav）與 8（Footer）已在 layout 全站掛好，這裡不做。
import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/lib/i18n';
import { BRAND } from '@/lib/brand';
import type { PublicTutor } from '@/lib/types';
import { TutorCard } from '@/components/TutorCard';
import { HOME } from '../home-strings';
import { HeroSearch } from './HeroSearch';

export interface FeaturedTutor {
  tutor: PublicTutor;
  rating: number;
}

export interface HomeEndorsement {
  endorserName: string;
  endorserTitle: string;
  quote: string;
}

interface HomeContentProps {
  featured: FeaturedTutor[];
  endorsements: HomeEndorsement[];
}

// 六大領域（原字串，與 data/tutors.json 的 domains 一致）
const DOMAINS = ['LLM 應用', 'Agent 開發', '電腦視覺', 'MLOps', '資料科學', 'AI 入門'] as const;
const DOMAIN_EN: Record<string, string> = {
  'LLM 應用': 'LLM apps',
  'Agent 開發': 'Agent dev',
  '電腦視覺': 'Computer vision',
  'MLOps': 'MLOps',
  '資料科學': 'Data science',
  'AI 入門': 'AI basics',
};

function SectionHeading({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-avo-dark sm:text-3xl">{title}</h2>
      <p className="mt-2 max-w-2xl text-avo-ink/70">{desc}</p>
    </div>
  );
}

export function HomeContent({ featured, endorsements }: HomeContentProps) {
  const { lang, t } = useLang();
  const slogan = lang === 'zh' ? BRAND.sloganZh : BRAND.sloganEn;

  const highlights = [
    { title: t(HOME.h1Title), desc: t(HOME.h1Desc), cta: t(HOME.h1Cta), href: '/match' },
    { title: t(HOME.h2Title), desc: t(HOME.h2Desc), cta: t(HOME.h2Cta), href: '/tutors' },
    { title: t(HOME.h3Title), desc: t(HOME.h3Desc), cta: t(HOME.h3Cta), href: '/classroom' },
  ];

  const roadmap = [
    { title: t(HOME.r1Title), desc: t(HOME.r1Desc) },
    { title: t(HOME.r2Title), desc: t(HOME.r2Desc) },
    { title: t(HOME.r3Title), desc: t(HOME.r3Desc) },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* 2. Hero */}
      <section className="flex flex-col items-center py-14 text-center sm:py-20">
        <Image
          src="/mascot.svg"
          alt={lang === 'zh' ? BRAND.zh : BRAND.en}
          width={160}
          height={160}
          priority
          className="h-32 w-32 sm:h-40 sm:w-40"
        />
        <h1 className="mt-6 text-3xl font-bold text-avo-dark sm:text-5xl">{slogan}</h1>
        <p className="mt-3 max-w-xl text-avo-ink/70">{t(HOME.heroTagline)}</p>
        <HeroSearch />
      </section>

      {/* 3. 三亮點卡 */}
      <section className="py-10">
        <SectionHeading title={t(HOME.highlightsTitle)} desc="" />
        <div className="grid gap-4 sm:grid-cols-3">
          {highlights.map((h) => (
            <Link
              key={h.href}
              href={h.href}
              className="group flex flex-col rounded-2xl border border-avo-light bg-white p-6 transition-colors hover:bg-avo-light/40"
            >
              <h3 className="text-lg font-semibold text-avo-dark">{h.title}</h3>
              <p className="mt-2 flex-1 text-sm text-avo-ink/70">{h.desc}</p>
              <span className="mt-4 text-sm font-medium text-avo-main group-hover:text-avo-dark">
                {h.cta} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. 精選講師 */}
      <section className="py-10">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <SectionHeading title={t(HOME.featuredTitle)} desc={t(HOME.featuredDesc)} />
          <Link href="/tutors" className="mb-6 text-sm font-medium text-avo-main hover:text-avo-dark">
            {t(HOME.featuredMore)} →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((f) => (
            <TutorCard key={f.tutor.slug} tutor={f.tutor} rating={f.rating} />
          ))}
        </div>
      </section>

      {/* 5. 領域分類導覽 */}
      <section className="py-10">
        <SectionHeading title={t(HOME.domainsTitle)} desc={t(HOME.domainsDesc)} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {DOMAINS.map((d) => (
            <Link
              key={d}
              href={`/tutors?domain=${encodeURIComponent(d)}`}
              className="rounded-xl border border-avo-light bg-white px-4 py-5 text-center text-sm font-medium text-avo-dark transition-colors hover:bg-avo-main hover:text-white"
            >
              {lang === 'zh' ? d : DOMAIN_EN[d]}
            </Link>
          ))}
        </div>
      </section>

      {/* 6. 名人推薦牆 */}
      <section className="py-10">
        <SectionHeading title={t(HOME.endorsementsTitle)} desc={t(HOME.endorsementsDesc)} />
        <div className="grid gap-4 sm:grid-cols-3">
          {endorsements.map((e, i) => (
            <figure key={i} className="flex flex-col rounded-2xl border border-avo-light bg-white p-6">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-avo-main text-lg font-semibold text-white"
                  aria-hidden
                >
                  {e.endorserName.slice(0, 1)}
                </span>
                <div className="min-w-0">
                  <figcaption className="flex items-center gap-1 font-semibold text-avo-dark">
                    <span className="truncate">{e.endorserName}</span>
                    <span
                      className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-avo-main text-[10px] text-white"
                      title={t(HOME.verifiedLabel)}
                      aria-label={t(HOME.verifiedLabel)}
                    >
                      ✓
                    </span>
                  </figcaption>
                  <p className="truncate text-xs text-avo-ink/60">{e.endorserTitle}</p>
                </div>
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-avo-ink/80">
                {e.quote}
              </blockquote>
            </figure>
          ))}
        </div>
      </section>

      {/* 7. Roadmap「即將推出」 */}
      <section className="py-10">
        <SectionHeading title={t(HOME.roadmapTitle)} desc={t(HOME.roadmapDesc)} />
        <div className="grid gap-4 sm:grid-cols-3">
          {roadmap.map((r) => (
            <div key={r.title} className="rounded-2xl border border-dashed border-avo-main/40 bg-avo-light/20 p-6">
              <span className="inline-block rounded-full bg-avo-seed px-2.5 py-0.5 text-xs font-medium text-avo-cream">
                {t(HOME.roadmapBadge)}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-avo-dark">{r.title}</h3>
              <p className="mt-2 text-sm text-avo-ink/70">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomeContent;
