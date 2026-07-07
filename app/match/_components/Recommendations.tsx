'use client';
// app/match/_components/Recommendations.tsx —— 把 AI 回覆的 {slug,reason} 對應成講師卡。
// 這是 demo 的高潮：AI 回答裡長出可點的講師卡。offline 時標「離線建議」。
import { useLang } from '@/lib/i18n';
import type { PublicTutor } from '@/lib/types';
import { TutorCard } from '@/components/TutorCard';
import { s } from '../strings';

interface Rec {
  slug: string;
  reason: string;
}

export function Recommendations({
  recs,
  tutors,
  offline,
}: {
  recs: Rec[];
  tutors: PublicTutor[];
  offline?: boolean;
}) {
  const { t } = useLang();
  const bySlug = new Map(tutors.map((tut) => [tut.slug, tut]));

  // 對應不到的 slug 直接略過（route 已濾過，這是雙保險）。
  const cards = recs
    .map((r) => ({ tutor: bySlug.get(r.slug), reason: r.reason }))
    .filter((c): c is { tutor: PublicTutor; reason: string } => Boolean(c.tutor));

  if (cards.length === 0) return null;

  return (
    <div className="ml-8">
      <div className="mb-2 flex items-center gap-2">
        <p className="font-mono text-xs font-medium text-avo-main">{t(s.recommendTitle)}</p>
        {offline && (
          <span className="rounded-full bg-avo-seed/15 px-2 py-0.5 text-xs font-medium text-avo-seed">
            {t(s.offlineTag)}
          </span>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((c) => (
          <TutorCard key={c.tutor.slug} tutor={c.tutor} reason={c.reason} />
        ))}
      </div>
    </div>
  );
}

export default Recommendations;
