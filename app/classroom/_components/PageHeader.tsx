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
    <header className="mb-8">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-avo-main/15 px-3 py-1 text-xs font-medium text-avo-dark">
        <span aria-hidden>🎓</span>
        {t(CR.pageKicker)}
        <span className="text-avo-ink/40">·</span>
        <span className="text-avo-seed">{t(CR.sessionTag)}</span>
      </span>

      <h1 className="mt-4 text-2xl font-bold text-avo-dark sm:text-3xl">{title}</h1>
      <p className="mt-1 text-avo-ink/70">{subtitle}</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-avo-ink/60">
        <span>{sessionLabel}</span>
        <span className="text-avo-ink/30">|</span>
        <span>{tutorName}</span>
        <span className="text-avo-ink/30">|</span>
        <span className="font-mono">{durationMin} min</span>
      </div>

      <p className="mt-4 max-w-2xl text-sm text-avo-ink/60">{t(CR.pageLead)}</p>
    </header>
  );
}

export default PageHeader;
