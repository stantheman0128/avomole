'use client';
// 本課練習題。每題可展開「AI 批改示範」：假的學生答案＋AI 批改與建議。
// 展開/收合純 React state。內容全來自 data/classroom.json。
import { useState } from 'react';
import { useLang } from '@/lib/i18n';
import { CR } from '../strings';

export type Exercise = {
  id: string;
  type: 'choice' | 'short';
  prompt: string;
  options?: string[];
  answerIndex: number | null;
  explanation: string;
  mockStudentAnswer: string;
  aiFeedback: string;
};

function Item({ ex, index }: { ex: Exercise; index: number }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const typeLabel = ex.type === 'choice' ? CR.typeChoice : CR.typeShort;

  return (
    <li className="rounded-2xl border border-avo-light bg-white/60 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-avo-main font-mono text-sm text-white">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <span className="inline-block rounded-full bg-avo-light px-2 py-0.5 text-xs text-avo-dark">
            {t(typeLabel)}
          </span>
          <p className="mt-2 font-medium text-avo-ink">{ex.prompt}</p>

          {ex.options && (
            <ol className="mt-3 space-y-1.5">
              {ex.options.map((opt, i) => {
                const isAnswer = ex.answerIndex === i;
                return (
                  <li
                    key={i}
                    className={`flex gap-2 rounded-lg border px-3 py-2 text-sm ${
                      isAnswer
                        ? 'border-avo-main bg-avo-light/50 text-avo-dark'
                        : 'border-avo-light/70 text-avo-ink/80'
                    }`}
                  >
                    <span className="font-mono text-xs text-avo-seed">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                    {isAnswer && (
                      <span className="ml-auto shrink-0 text-xs font-medium text-avo-main">
                        {t(CR.correctAnswer)}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-avo-main/40 px-3 py-1.5 text-sm text-avo-dark transition-colors hover:bg-avo-light/60"
          >
            <span aria-hidden className={`transition-transform ${open ? 'rotate-90' : ''}`}>
              ▸
            </span>
            {t(open ? CR.hideFeedback : CR.showFeedback)}
          </button>

          {open && (
            <div className="mt-3 space-y-3 border-t border-avo-light pt-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-avo-ink/50">
                  {t(CR.studentAnswerLabel)}
                </p>
                <p className="mt-1 rounded-lg bg-avo-cream px-3 py-2 text-sm text-avo-ink/90">
                  {ex.mockStudentAnswer}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-avo-main">
                  {t(CR.aiFeedbackLabel)}
                </p>
                <p className="mt-1 rounded-lg bg-avo-light/40 px-3 py-2 text-sm leading-relaxed text-avo-ink">
                  {ex.aiFeedback}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-avo-ink/50">
                  {t(CR.explanationLabel)}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-avo-ink/80">{ex.explanation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

export function ExerciseList({ exercises }: { exercises: Exercise[] }) {
  return (
    <ol className="space-y-3">
      {exercises.map((ex, i) => (
        <Item key={ex.id} ex={ex} index={i} />
      ))}
    </ol>
  );
}

export default ExerciseList;
