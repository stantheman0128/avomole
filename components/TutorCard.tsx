'use client';
// components/TutorCard.tsx —— 講師卡，列表／首頁／AI 推薦卡共用。
// 講師卡是少數「卡片是對的載體」的地方（它就是一個可點的實體）。編輯風處理：
// 大名字、mono 價格靠右、skills 走文字 chip 不搶戲、hover 用邊框+輕位移不換整塊底。
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
      <span className="text-avo-seed/25">{'★'.repeat(5 - full)}</span>
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
          <div className="flex items-center gap-2">
            <h3 className="avo-display truncate text-lg text-avo-dark">{tutor.name}</h3>
            {tutor.isReal && <Badge kind="real" />}
          </div>
          <p className="truncate text-sm text-avo-ink/65">{tutor.title}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-avo-ink/70">
        {shownSkills.map((sk) => (
          <span key={sk} className="whitespace-nowrap">
            {sk}
          </span>
        ))}
        {extra > 0 && <span className="text-avo-ink/40">+{extra}</span>}
      </div>

      <hr className="avo-rule my-3" />

      <div className="flex items-center justify-between">
        <span className="font-mono text-sm text-avo-dark">
          NT${tutor.hourlyRate}
          <span className="text-avo-ink/45">{t({ zh: ' /時', en: ' /hr' })}</span>
        </span>
        <div className="flex items-center gap-2">
          {tutor.acceptsProjects && <Badge kind="projects" />}
          {typeof rating === 'number' && rating > 0 && <Stars rating={rating} />}
        </div>
      </div>

      {reason && (
        <p className="mt-3 rounded-lg bg-avo-light/40 px-3 py-2 text-sm leading-relaxed text-avo-ink/85">
          {reason}
        </p>
      )}
    </Link>
  );
}

export default TutorCard;
