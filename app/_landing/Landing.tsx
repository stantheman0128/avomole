'use client';
// app/_landing/Landing.tsx —— 編輯風 Landing 分流頁（client，要 useLang）。
// 職責只有一件事：分流。品牌感 hero + 兩道門（找講師 / 我是講師）。
// 深色浸染(drenched)由本頁自己鋪；Nav/Footer 是 layout 全站掛的，不在這裡。
import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/lib/i18n';
import { BRAND } from '@/lib/brand';
import { LANDING } from '../landing-strings';

// 一道門：typographic block，不是卡片。primary 走填色大份量，secondary 走描邊輕份量。
function Door({
  href,
  label,
  line,
  cta,
  variant,
  index,
}: {
  href: string;
  label: string;
  line: string;
  cta: string;
  variant: 'primary' | 'secondary';
  index: string;
}) {
  const primary = variant === 'primary';
  return (
    <Link
      href={href}
      className={[
        'group avo-enter relative flex flex-col justify-between gap-8 rounded-3xl p-7 sm:p-9',
        'transition-[transform,background-color,border-color] duration-[var(--dur-base)] ease-[var(--ease-out-quart)]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-avo-main',
        primary
          ? 'bg-avo-main text-avo-dark hover:-translate-y-1 sm:col-span-3'
          : 'border border-avo-paper/25 text-avo-paper hover:-translate-y-1 hover:border-avo-paper/50 sm:col-span-2',
      ].join(' ')}
    >
      <div>
        <span
          className={[
            'font-mono text-xs',
            primary ? 'text-avo-dark/60' : 'text-avo-paper/45',
          ].join(' ')}
        >
          {index}
        </span>
        <h2
          className="avo-display mt-3 text-4xl sm:text-5xl"
          style={{ letterSpacing: '-0.03em' }}
        >
          {label}
        </h2>
        <p
          className={[
            'mt-4 max-w-sm text-[15px] leading-relaxed',
            primary ? 'text-avo-dark/85' : 'text-avo-paper/70',
          ].join(' ')}
        >
          {line}
        </p>
      </div>
      <span
        className={[
          'inline-flex items-center gap-2 text-sm font-medium',
          primary ? 'text-avo-dark' : 'text-avo-main',
        ].join(' ')}
      >
        {cta}
        <span
          aria-hidden
          className="transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out-quart)] group-hover:translate-x-1"
        >
          →
        </span>
      </span>
    </Link>
  );
}

export function Landing() {
  const { lang, t } = useLang();
  const slogan = lang === 'zh' ? BRAND.sloganZh : BRAND.sloganEn;

  return (
    <div className="avo-drenched">
      {/* Hero：非對稱。左側大字排版，右側吉祥物錨點；不是置中三件式。 */}
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
        </div>

        {/* 吉祥物：真實圖像當錨點，靠下靠右，不置中 */}
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

      {/* 兩道門：不等份量，不是兩張一樣的卡片 */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
        <h2
          className="avo-enter font-sans text-sm font-medium tracking-wide text-avo-paper/55"
        >
          {t(LANDING.doorPick)}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-5">
          <Door
            href="/discover"
            label={t(LANDING.learnerLabel)}
            line={t(LANDING.learnerLine)}
            cta={t(LANDING.learnerCta)}
            variant="primary"
            index={t({ zh: '想學', en: 'learner' })}
          />
          <Door
            href="/login"
            label={t(LANDING.tutorLabel)}
            line={t(LANDING.tutorLine)}
            cta={t(LANDING.tutorCta)}
            variant="secondary"
            index={t({ zh: '想教', en: 'tutor' })}
          />
        </div>

        {/* 還沒決定的人：安靜的一行，導向 AI 媒合 */}
        <p className="avo-enter mt-8 text-sm text-avo-paper/55">
          {t(LANDING.undecided)}{' '}
          <Link
            href="/match"
            className="font-medium text-avo-main underline-offset-4 hover:underline"
          >
            {t(LANDING.undecidedCta)}
          </Link>
        </p>
      </section>
    </div>
  );
}

export default Landing;
