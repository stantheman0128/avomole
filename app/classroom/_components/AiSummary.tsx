'use client';
// AI 課程摘要：generatedNote 標註 + 時間軸 + 重點條列 + 名詞卡。
import { useLang } from '@/lib/i18n';
import { CR } from '../strings';
import { Timeline } from './Timeline';
import { TermCards } from './TermCards';

type Item = { time: string; title: string };
type Term = { term: string; explain: string };

export function AiSummary({
  generatedNote,
  timeline,
  keyPoints,
  termCards,
}: {
  generatedNote: string;
  timeline: Item[];
  keyPoints: string[];
  termCards: Term[];
}) {
  const { t } = useLang();
  return (
    <div className="space-y-6">
      <p className="inline-flex items-center gap-2 rounded-full bg-avo-light/60 px-3 py-1 text-xs text-avo-dark">
        <span aria-hidden>✨</span>
        {generatedNote}
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Timeline items={timeline} />

        <div>
          <h3 className="mb-3 text-sm font-semibold text-avo-dark">{t(CR.keyPointsTitle)}</h3>
          <ul className="space-y-2">
            {keyPoints.map((pt, i) => (
              <li key={i} className="flex gap-2 text-sm text-avo-ink/90">
                <span aria-hidden className="mt-1 text-avo-main">•</span>
                <span className="leading-relaxed">{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <TermCards terms={termCards} />
    </div>
  );
}

export default AiSummary;
