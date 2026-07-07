'use client';
// 章節時間軸。點某一格 → 顯示小提示「Demo：錄影檔未附」。
import { useState } from 'react';
import { useLang } from '@/lib/i18n';
import { CR } from '../strings';

export type TimelineItem = { time: string; title: string; titleEn?: string };

export function Timeline({ items }: { items: TimelineItem[] }) {
  const { lang, t } = useLang();
  const en = lang === 'en';
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-sm font-semibold text-avo-dark">{t(CR.timelineTitle)}</h3>
        <span className="text-xs text-avo-ink/50">{t(CR.timelineHint)}</span>
      </div>

      <ol className="relative border-l border-avo-light pl-5">
        {items.map((item, i) => {
          const open = openIdx === i;
          return (
            <li key={item.time} className="relative pb-4 last:pb-0">
              <span
                aria-hidden
                className="absolute -left-[23px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-avo-cream bg-avo-main"
              />
              <button
                type="button"
                onClick={() => setOpenIdx(open ? null : i)}
                aria-expanded={open}
                className="group flex w-full items-baseline gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-avo-light/50"
              >
                <span className="shrink-0 font-mono text-xs text-avo-seed">{item.time}</span>
                <span className="text-sm text-avo-ink group-hover:text-avo-dark">
                  {en ? item.titleEn ?? item.title : item.title}
                </span>
              </button>
              {open && (
                <p
                  role="status"
                  className="mt-1 ml-2 inline-block rounded-md bg-avo-dark px-2.5 py-1 text-xs text-avo-cream"
                >
                  {t(CR.timelineTooltip)}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default Timeline;
