'use client';
// app/discover/_home/HomeContent.tsx —— 探索頁主體（client），編輯/排版風。
// 精簡版：hero（非對稱）+ 三個核心能力（破卡片格、用分隔線分段）+ 即將推出。
// 「精選講師」「依領域找講師」「業界推薦」三區塊已移除（Stan 指定）。
// 純介面渲染，不吃 server 資料。Nav 與 Footer 由 layout 全站掛好。
import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/lib/i18n';
import { BRAND } from '@/lib/brand';
import { HOME } from '../../home-strings';
import { ROADMAP } from '../../roadmap/strings';
import { HeroSearch } from './HeroSearch';

export function HomeContent() {
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
    <div className="mx-auto max-w-6xl px-5">
      {/* Hero：非對稱。左側大字排版 + 搜尋，右側吉祥物錨點，不置中三件式。 */}
      <section className="grid items-center gap-10 pt-14 pb-12 sm:pt-20 sm:pb-16 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
        <div>
          <p className="avo-kicker">{t(HOME.heroTagline)}</p>
          <h1 className="avo-display mt-5 text-[clamp(2.5rem,7vw,4.5rem)] text-avo-dark">
            {slogan}
          </h1>
          <div className="mt-7">
            <HeroSearch />
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <Image
            src="/mascot.png"
            alt={lang === 'zh' ? BRAND.zh : BRAND.en}
            width={300}
            height={300}
            priority
            className="h-auto w-[52%] max-w-[260px] lg:w-full"
          />
        </div>
      </section>

      <hr className="avo-rule" />

      {/* 三個核心能力：不用三欄等大卡片。改成有節奏的清單，每項一條分隔線，
          標題大、說明長度參差、CTA 靠右。不放 01/02/03 流水號裝飾。 */}
      <section className="py-14 sm:py-16">
        <h2 className="avo-display text-2xl text-avo-dark sm:text-3xl">{t(HOME.highlightsTitle)}</h2>
        <div className="mt-8 space-y-8">
          {highlights.map((h, i) => (
            <div key={h.href}>
              {i > 0 && <hr className="avo-rule mb-8" />}
              <Link
                href={h.href}
                className="group grid gap-2 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-6"
              >
                <div>
                  <h3 className="avo-display text-xl text-avo-dark sm:text-2xl">{h.title}</h3>
                  <p className="avo-prose mt-2 text-avo-ink/75">{h.desc}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-avo-main">
                  {h.cta}
                  <span
                    aria-hidden
                    className="transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out-quart)] group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <hr className="avo-rule" />

      {/* 即將推出：drenched 深色版塊收尾，跟 Landing 呼應。三格但用深底 + 內距差異破一致感。 */}
      <section className="avo-drenched -mx-5 mt-14 mb-16 rounded-3xl px-6 py-12 sm:px-10 sm:py-14">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="avo-display text-2xl text-avo-paper sm:text-3xl">{t(HOME.roadmapTitle)}</h2>
          <span className="font-mono text-xs text-avo-paper/50">{t(HOME.roadmapBadge)}</span>
        </div>
        <p className="avo-prose mt-3 text-avo-paper/70">{t(HOME.roadmapDesc)}</p>
        <div className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-3">
          {roadmap.map((r) => (
            <div key={r.title}>
              <hr className="avo-rule-on-dark mb-4" />
              <h3 className="font-semibold text-avo-paper">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-avo-paper/65">{r.desc}</p>
            </div>
          ))}
        </div>

        {/* 這裡只列了幾項；完整藍圖（含每個未上線功能的 Demo 示意）在 /roadmap */}
        <Link
          href="/roadmap"
          className="group mt-9 inline-flex items-center gap-1.5 text-sm font-medium text-avo-main underline-offset-4 hover:underline"
        >
          {t(ROADMAP.fromDiscover)}
          <span
            aria-hidden
            className="transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out-quart)] group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </section>
    </div>
  );
}

export default HomeContent;
