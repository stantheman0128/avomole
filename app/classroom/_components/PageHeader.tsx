'use client';
// 頁面標頭：kicker + 課名 + 副標 + 課堂 meta。課名／副標來自 json，中英雙語，依 lang 挑。
import { useLang } from '@/lib/i18n';
import { CR } from '../strings';

export type Course = {
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  tutorName: string;
  sessionLabel: string;
  sessionLabelEn?: string;
  durationMin: number;
};

export function PageHeader({ course }: { course: Course }) {
  const { lang, t } = useLang();
  const en = lang === 'en';
  const title = en ? course.titleEn ?? course.title : course.title;
  const subtitle = en ? course.subtitleEn ?? course.subtitle : course.subtitle;
  const sessionLabel = en ? course.sessionLabelEn ?? course.sessionLabel : course.sessionLabel;

  return (
    <header className="max-w-2xl">
      <p className="avo-kicker">
        {t(CR.pageKicker)}
        <span className="mx-2 text-avo-ink/30">/</span>
        <span className="text-avo-seed">{t(CR.sessionTag)}</span>
      </p>

      <h1 className="avo-display mt-3 text-4xl text-avo-dark sm:text-5xl">{title}</h1>
      <p className="mt-3 text-avo-ink/70">{subtitle}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-sm text-avo-ink/55">
        <span>{sessionLabel}</span>
        <span aria-hidden className="text-avo-ink/30">·</span>
        <span>{course.tutorName}</span>
        <span aria-hidden className="text-avo-ink/30">·</span>
        <span>{course.durationMin} min</span>
      </div>

      <p className="avo-prose mt-5 text-sm text-avo-ink/60">{t(CR.pageLead)}</p>
    </header>
  );
}

export default PageHeader;
