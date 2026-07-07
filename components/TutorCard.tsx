'use client';
// components/TutorCard.tsx —— 講師卡，列表／首頁／AI 推薦卡共用。
// 只吃 PublicTutor（型別上不含 hiddenScore）。頁面 Task 可加變體 props。
import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/lib/i18n';
import type { PublicTutor } from '@/lib/types';
import { Badge } from './Badge';

interface TutorCardProps {
  tutor: PublicTutor;
  rating?: number;            // 0–5，有評價時由頁面帶入
  reason?: string;            // AI 推薦理由（/match 推薦卡用）
  className?: string;
}

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="font-mono text-sm text-avo-seed" aria-label={`${rating.toFixed(1)} / 5`}>
      {'★'.repeat(full)}
      <span className="text-avo-seed/30">{'★'.repeat(5 - full)}</span>
    </span>
  );
}

export function TutorCard({ tutor, rating, reason, className = '' }: TutorCardProps) {
  const { t } = useLang();
  const shownSkills = tutor.skills.slice(0, 4);
  const extra = tutor.skills.length - shownSkills.length;

  return (
    <Link
      href={`/tutors/${tutor.slug}`}
      className={`block rounded-2xl border border-avo-light bg-white p-4 transition-colors hover:bg-avo-light/40 ${className}`}
    >
      <div className="flex items-start gap-3">
        <Image
          src={tutor.avatar}
          alt={tutor.name}
          width={56}
          height={56}
          className="h-14 w-14 shrink-0 rounded-xl bg-avo-light object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-avo-dark">{tutor.name}</h3>
            {tutor.isReal && <Badge kind="real" />}
          </div>
          <p className="truncate text-sm text-avo-ink/70">{tutor.title}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {shownSkills.map((s) => (
          <span key={s} className="rounded-md bg-avo-light/60 px-2 py-0.5 text-xs text-avo-dark">
            {s}
          </span>
        ))}
        {extra > 0 && (
          <span className="rounded-md bg-avo-light/60 px-2 py-0.5 text-xs text-avo-dark">+{extra}</span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono text-sm text-avo-dark">
          NT${tutor.hourlyRate}
          <span className="text-avo-ink/50">{t({ zh: ' /時', en: ' /hr' })}</span>
        </span>
        {typeof rating === 'number' && <Stars rating={rating} />}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {tutor.acceptsProjects && <Badge kind="projects" />}
      </div>

      {reason && (
        <p className="mt-3 rounded-lg bg-avo-cream px-3 py-2 text-sm text-avo-ink/80">{reason}</p>
      )}
    </Link>
  );
}

export default TutorCard;
