'use client';
// components/LevelChips.tsx —— 適教程度 chips（初階／中階／高階）。
import { useLang } from '@/lib/i18n';
import type { Level } from '@/lib/types';

const LABEL: Record<Level, { zh: string; en: string }> = {
  beginner: { zh: '初階', en: 'Beginner' },
  intermediate: { zh: '中階', en: 'Intermediate' },
  advanced: { zh: '高階', en: 'Advanced' },
};

export function LevelChips({ levels }: { levels: Level[] }) {
  const { t } = useLang();
  return (
    <div className="flex flex-wrap gap-1.5">
      {levels.map((lv) => (
        <span
          key={lv}
          className="rounded-md border border-avo-main/40 bg-avo-light/50 px-2 py-0.5 text-xs text-avo-dark"
        >
          {t(LABEL[lv])}
        </span>
      ))}
    </div>
  );
}

export default LevelChips;
