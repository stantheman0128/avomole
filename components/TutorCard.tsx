'use client';
// components/TutorCard.tsx —— 講師卡（可點實體）。結果感：迷你雷達、AI 摘要、領域／真實標示。
// 只吃 PublicTutor（型別上不含 hiddenScore）。
import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/lib/i18n';
import type { PublicTutor } from '@/lib/types';
import { Badge } from './Badge';
import { RadarChart } from './RadarChart';

interface TutorCardProps {
  tutor: PublicTutor;
  rating?: number;
  reason?: string;
  className?: string;
}

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="font-mono text-sm text-avo-seed" aria-label={`${rating.toFixed(1)} / 5`}>
      {'★'.repeat(full)}
      <span className="text-avo-seed/25">{'★'.repeat(5 - full)}</span>
    </span>
  );
}

export function TutorCard({ tutor, rating, reason, className = '' }: TutorCardProps) {
  const { lang, t } = useLang();
  const shownDomains = tutor.domains.slice(0, 3);
  const extraDomains = tutor.domains.length - shownDomains.length;
  const title = lang === 'en' ? tutor.titleEn ?? tutor.title : tutor.title;
  const summaryRaw =
    lang === 'en'
      ? tutor.aiProfile.summaryEn ?? tutor.aiProfile.summary
      : tutor.aiProfile.summary;
  const summary = summaryRaw?.trim() ? summaryRaw.trim() : '';
  const hasRadar = Boolean(tutor.aiProfile?.radar);

  return (
    <Link
      href={`/tutors/${tutor.slug}`}
      className={[
        'group avo-panel block rounded-2xl p-4 transition-[transform,border-color]',
        'duration-[var(--dur-base)] ease-[var(--ease-out-quart)]',
        'hover:-translate-y-0.5 hover:border-avo-main/50',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-avo-main',
        className,
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <Image
          src={tutor.avatar}
          alt={tutor.name}
          width={56}
          height={56}
          className="h-14 w-14 shrink-0 rounded-2xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="avo-display truncate text-lg text-avo-dark">{tutor.name}</h3>
            {tutor.isReal ? (
              <Badge kind="real" />
            ) : (
              <span className="rounded-full bg-avo-ink/8 px-2 py-0.5 text-[11px] font-medium text-avo-ink/55">
                {t({ zh: '示意', en: 'Sample' })}
              </span>
            )}
          </div>
          <p className="truncate text-sm text-avo-ink/65">{title}</p>
          {shownDomains.length > 0 && (
            <p className="mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5 text-xs text-avo-ink/70">
              {shownDomains.map((d) => (
                <span key={d} className="whitespace-nowrap">
                  {d}
                </span>
              ))}
              {extraDomains > 0 && <span className="text-avo-ink/40">+{extraDomains}</span>}
            </p>
          )}
        </div>
        {hasRadar && (
          <div className="shrink-0">
            <RadarChart radar={tutor.aiProfile.radar} size={56} compact />
          </div>
        )}
      </div>

      {summary && (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-avo-ink/75">{summary}</p>
      )}

      <hr className="avo-rule my-3" />

      <div className="flex items-center justify-between">
        <span className="font-mono text-sm text-avo-seed">
          NT${tutor.hourlyRate}
          <span className="text-avo-ink/45">{t({ zh: ' /時', en: ' /hr' })}</span>
        </span>
        <div className="flex items-center gap-2">
          {tutor.acceptsProjects && <Badge kind="projects" />}
          {typeof rating === 'number' && rating > 0 && <Stars rating={rating} />}
        </div>
      </div>

      {reason && (
        <p className="mt-3 rounded-lg bg-avo-light/50 px-3 py-2 text-sm leading-relaxed text-avo-ink/85">
          {reason}
        </p>
      )}
    </Link>
  );
}

export default TutorCard;
