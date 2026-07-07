'use client';
// 專有名詞卡。正面名詞、背面白話解釋。hover 翻面（純 CSS 3D transform）；
// 觸控裝置點一下也能翻，用 React state 疊上 flipped 類別。
import { useState } from 'react';
import { useLang } from '@/lib/i18n';
import { CR } from '../strings';

type Term = { term: string; explain: string };

function Card({ term, explain }: Term) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlipped((v) => !v)}
      aria-label={term}
      className="term-card group h-44 w-full [perspective:1000px] focus:outline-none"
    >
      <div
        className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] ${
          flipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* 正面：名詞 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-avo-light bg-avo-light/40 px-4 [backface-visibility:hidden]">
          <span className="text-lg font-semibold text-avo-dark">{term}</span>
          <span className="mt-2 text-xs text-avo-ink/50">{flipped ? '' : '↻'}</span>
        </div>
        {/* 背面：白話解釋 */}
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl border border-avo-main/30 bg-avo-cream px-4 py-3 text-left [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-sm leading-relaxed text-avo-ink">{explain}</p>
        </div>
      </div>
    </button>
  );
}

export function TermCards({ terms }: { terms: Term[] }) {
  const { t } = useLang();
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-sm font-semibold text-avo-dark">{t(CR.termsTitle)}</h3>
        <span className="text-xs text-avo-ink/50">
          {t(CR.termsHint)}
          <span className="ml-1 text-avo-ink/40">{t(CR.termFlipHintTouch)}</span>
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {terms.map((term) => (
          <Card key={term.term} {...term} />
        ))}
      </div>
    </div>
  );
}

export default TermCards;
