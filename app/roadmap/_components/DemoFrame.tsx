'use client';
// app/roadmap/_components/DemoFrame.tsx —— 可重用的 Demo 影片示意框（16:9）。
// 沒有真影片：這是一個刻意設計的佔位，代表這個功能上線後會放示範影片。
// 深綠浸染底 + 描邊播放鍵（三角 glyph）+ mono 小字說明。克制動態，reduced-motion 由 globals.css 退路接手。
import { useLang } from '@/lib/i18n';
import { ROADMAP } from '../strings';

export function DemoFrame({ label }: { label: string }) {
  const { t } = useLang();

  return (
    <figure className="avo-drenched group relative overflow-hidden rounded-2xl">
      {/* 16:9 舞台。用細對角網格暗示「這裡以後是畫面」，不是破圖空框。 */}
      <div
        className="relative aspect-video w-full"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, color-mix(in oklch, var(--color-avo-paper) 5%, transparent) 0 1px, transparent 1px 22px)',
        }}
        role="img"
        aria-label={`${label} — ${t(ROADMAP.demoCaption)}`}
      >
        {/* 置中播放鍵：描邊圓 + 三角 glyph，hover 輕微放大（reduced-motion 會被全域壓到 0.01ms） */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="flex h-14 w-14 items-center justify-center rounded-full border border-avo-paper/35 text-avo-main transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-quart)] group-hover:scale-110 sm:h-16 sm:w-16"
            aria-hidden
          >
            {/* 三角形播放 glyph */}
            <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6 fill-current sm:h-7 sm:w-7">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>

        {/* 左上角一枚 mono 標記，坐實「這是示意」 */}
        <span className="absolute left-3 top-3 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-avo-paper/45">
          {t(ROADMAP.demoCaption)}
        </span>
      </div>

      {/* 框下說明：讓評審知道這格之後會長出真影片 */}
      <figcaption className="border-t border-avo-paper/12 px-4 py-3 text-xs leading-relaxed text-avo-paper/60">
        {t(ROADMAP.demoHint)}
      </figcaption>
    </figure>
  );
}

export default DemoFrame;
