'use client';
// AI 課程摘要：generatedNote 標註 + 時間軸 + 重點條列 + 名詞卡。內容中英雙語，依 lang 挑。
import { useLang } from '@/lib/i18n';
import { CR } from '../strings';
import { Timeline, type TimelineItem } from './Timeline';
import { TermCards, type Term } from './TermCards';

export type Summary = {
  generatedNote: string;
  generatedNoteEn?: string;
  timeline: TimelineItem[];
  keyPoints: string[];
  keyPointsEn?: string[];
  termCards: Term[];
};

export function AiSummary({ summary }: { summary: Summary }) {
  const { lang, t } = useLang();
  const en = lang === 'en';
  const generatedNote = en ? summary.generatedNoteEn ?? summary.generatedNote : summary.generatedNote;
  const keyPoints =
    en && summary.keyPointsEn && summary.keyPointsEn.length === summary.keyPoints.length
      ? summary.keyPointsEn
      : summary.keyPoints;

  return (
    <div className="space-y-6">
      <p className="inline-flex items-center gap-2 rounded-full bg-avo-light/60 px-3 py-1 text-xs text-avo-dark">
        <span aria-hidden>✨</span>
        {generatedNote}
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Timeline items={summary.timeline} />

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

      <TermCards terms={summary.termCards} />
    </div>
  );
}

export default AiSummary;
