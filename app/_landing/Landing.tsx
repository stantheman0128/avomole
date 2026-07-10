'use client';
// app/_landing/Landing.tsx —— 唯一訪客首頁。
// 價值主張 + 主 CTA「開始媒合」+ 次 CTA「瀏覽講師」；講師入口收成次要。
// 深中性底由本頁鋪；Nav/Footer 由 layout 掛。吉祥物只在這裡放大一次。
import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/lib/i18n';
import { BRAND } from '@/lib/brand';
import { LANDING } from '../landing-strings';

export function Landing() {
  const { lang, t } = useLang();
  const slogan = lang === 'zh' ? BRAND.sloganZh : BRAND.sloganEn;

  const live = [
    {
      title: t(LANDING.live1Title),
      desc: t(LANDING.live1Desc),
      cta: t(LANDING.live1Cta),
      href: '/match',
    },
    {
      title: t(LANDING.live2Title),
      desc: t(LANDING.live2Desc),
      cta: t(LANDING.live2Cta),
      href: '/tutors',
    },
    {
      title: t(LANDING.live3Title),
      desc: t(LANDING.live3Desc),
      cta: t(LANDING.live3Cta),
      href: '/learning-path',
    },
  ];

  return (
    <div className="avo-drenched">
      {/* Hero：非對稱。左價值主張＋CTA，右吉祥物。 */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pt-16 pb-14 sm:pt-24 sm:pb-16 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
        <div>
          <p className="avo-enter max-w-lg font-mono text-xs leading-relaxed text-avo-main">
            {t(LANDING.kicker)}
          </p>
          <h1
            className="avo-display avo-enter mt-6 text-[clamp(2.75rem,8vw,5.25rem)] text-avo-paper"
            style={{ animationDelay: '60ms' }}
          >
            {slogan}
          </h1>
          <p
            className="avo-enter avo-prose mt-6 text-base leading-relaxed text-avo-paper/70 sm:text-lg"
            style={{ animationDelay: '120ms' }}
          >
            {t(LANDING.heroLead)}
          </p>

          <div
            className="avo-enter mt-8 flex flex-wrap items-center gap-3"
            style={{ animationDelay: '180ms' }}
          >
            <Link
              href="/match"
              className="inline-flex items-center gap-2 rounded-full bg-avo-main px-6 py-3 text-sm font-semibold text-avo-dark transition-[transform,background-color] duration-[var(--dur-base)] ease-[var(--ease-out-quart)] hover:-translate-y-0.5 hover:bg-avo-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-avo-main"
            >
              {t(LANDING.primaryCta)}
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/tutors"
              className="inline-flex items-center gap-2 rounded-full border border-avo-seed/70 px-6 py-3 text-sm font-medium text-avo-paper transition-[transform,border-color,background-color] duration-[var(--dur-base)] ease-[var(--ease-out-quart)] hover:-translate-y-0.5 hover:border-avo-seed hover:bg-avo-seed/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-avo-seed"
            >
              {t(LANDING.secondaryCta)}
            </Link>
          </div>
        </div>

        <div
          className="avo-enter flex justify-center lg:justify-end"
          style={{ animationDelay: '160ms' }}
        >
          <Image
            src="/mascot.png"
            alt={t(LANDING.mascotAlt)}
            width={340}
            height={340}
            priority
            className="h-auto w-[62%] max-w-[300px] drop-shadow-[0_20px_45px_rgba(0,0,0,0.35)] sm:w-[52%] lg:w-full"
          />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5">
        <hr className="avo-rule-on-dark" />
      </div>

      {/* 已上線能力：清單節奏，不是三張等大卡 */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
        <h2 className="avo-enter font-sans text-sm font-medium tracking-wide text-avo-paper/70">
          {t(LANDING.liveTitle)}
        </h2>
        <div className="mt-8 space-y-8">
          {live.map((item, i) => (
            <div key={item.href} className="avo-enter" style={{ animationDelay: `${i * 40}ms` }}>
              {i > 0 && <hr className="avo-rule-on-dark mb-8" />}
              <Link
                href={item.href}
                className="group grid gap-2 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-6"
              >
                <div>
                  <h3 className="avo-display text-xl text-avo-paper sm:text-2xl">{item.title}</h3>
                  <p className="avo-prose mt-2 text-avo-paper/70">{item.desc}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-avo-main">
                  {item.cta}
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

      <div className="mx-auto max-w-6xl px-5">
        <hr className="avo-rule-on-dark" />
      </div>

      {/* 講師次要入口 + 教室次要入口 */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:py-14">
        <p className="text-sm leading-relaxed text-avo-paper/70">
          {t(LANDING.tutorAside)}{' '}
          <Link
            href="/login"
            className="font-medium text-avo-seed underline-offset-4 hover:underline"
          >
            {t(LANDING.tutorAsideCta)}
          </Link>
        </p>
        <p className="mt-4 text-sm text-avo-paper/55">
          {t(LANDING.classroomHint)}{' '}
          <Link
            href="/classroom"
            className="font-medium text-avo-main underline-offset-4 hover:underline"
          >
            {t(LANDING.classroomCta)}
          </Link>
        </p>
      </section>

      {/* 誠實未做：只留影片自介 */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="rounded-3xl border border-avo-paper/15 px-6 py-10 sm:px-10">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="avo-display text-2xl text-avo-paper sm:text-3xl">{t(LANDING.soonTitle)}</h2>
            <span className="font-mono text-xs text-avo-seed">{t(LANDING.soonBadge)}</span>
          </div>
          <h3 className="mt-6 font-semibold text-avo-paper">{t(LANDING.soon1Title)}</h3>
          <p className="avo-prose mt-2 text-sm leading-relaxed text-avo-paper/70">
            {t(LANDING.soon1Desc)}
          </p>
          <Link
            href="/roadmap"
            className="group mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-avo-main underline-offset-4 hover:underline"
          >
            {t(LANDING.soonMore)}
            <span
              aria-hidden
              className="transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out-quart)] group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Landing;
