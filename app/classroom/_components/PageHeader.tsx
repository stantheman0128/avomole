'use client';
// 頁面標頭：kicker + 課名 + 副標 + 課堂 meta。課名／副標為中文 mock，來自 json。
import { useLang } from '@/lib/i18n';
import { CR } from '../strings';

export function PageHeader({
  title,
  subtitle,
  sessionLabel,
  tutorName,
  durationMin,
}: {
  title: string;
  subtitle: string;
  sessionLabel: string;
  tutorName: string;
  durationMin: number;
}) {
  const { t } = useLang();
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
        <span>{tutorName}</span>
        <span aria-hidden className="text-avo-ink/30">·</span>
        <span>{durationMin} min</span>
      </div>

      <p className="avo-prose mt-5 text-sm text-avo-ink/60">{t(CR.pageLead)}</p>
    </header>
  );
}

export default PageHeader;
