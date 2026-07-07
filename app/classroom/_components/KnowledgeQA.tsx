'use client';
// 課堂知識庫問答（罐頭版）。3 個預設問題按鈕，點擊顯示對應答案。
// 不打真 API：省時、且保證無 API 依賴也能運作（SPEC §4.5 P1 罐頭退路）。
import { useState } from 'react';
import { useLang } from '@/lib/i18n';
import { CR } from '../strings';

type Preset = { question: string; questionEn?: string; answer: string; answerEn?: string };
export type KnowledgeQAData = { note?: string; noteEn?: string; presets: Preset[] };

export function KnowledgeQA({ knowledgeQA }: { knowledgeQA: KnowledgeQAData }) {
  const { lang, t } = useLang();
  const en = lang === 'en';
  const { presets } = knowledgeQA;
  const [active, setActive] = useState(0);
  const current = presets[active];
  const answer = current ? (en ? current.answerEn ?? current.answer : current.answer) : '';

  return (
    <div>
      <p className="text-sm text-avo-ink/70">{t(CR.qaPickPrompt)}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {presets.map((p, i) => {
          const on = active === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={on}
              className={`rounded-full px-3.5 py-2 text-sm transition-colors ${
                on
                  ? 'bg-avo-main text-avo-dark'
                  : 'border border-avo-main/35 text-avo-dark hover:bg-avo-light/60'
              }`}
            >
              {en ? p.questionEn ?? p.question : p.question}
            </button>
          );
        })}
      </div>

      <div className="avo-panel mt-4 rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <span aria-hidden className="text-base">🥑</span>
          <p className="font-mono text-xs text-avo-main">{t(CR.qaAnswerLabel)}</p>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-avo-ink">{answer}</p>
      </div>

      <p className="mt-3 text-xs text-avo-ink/50">{t(CR.qaCannedNote)}</p>
    </div>
  );
}

export default KnowledgeQA;
