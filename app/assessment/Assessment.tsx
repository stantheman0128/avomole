'use client';
// app/assessment/Assessment.tsx —— 五題自我診斷 UI 主體（純前端計分）。
// 一次一題、可回上一題；答完即算分 → 初/中/高階 → 顯示結果 + 兩個去處連結。
import Link from 'next/link';
import { useState } from 'react';
import { useLang } from '@/lib/i18n';
import type { Level } from '@/lib/types';
import { QUESTIONS, RESULT, scoreToLevel, s } from './strings';

// 依程度組一句媒合用的自然語言 query（給 /match?q= 自動送出）。
const MATCH_QUERY: Record<Level, { zh: string; en: string }> = {
  beginner: {
    zh: '我是完全新手，想從零入門 AI，找適合帶新手的講師',
    en: "I'm a complete beginner wanting to get into AI from scratch, looking for a beginner-friendly tutor",
  },
  intermediate: {
    zh: '我有一些基礎，想鎖定一個方向做出完整的 AI 專案',
    en: 'I have some basics and want to build a complete AI project in one direction',
  },
  advanced: {
    zh: '我已經能獨立開發，想找資深講師在架構與上線細節上指導',
    en: "I can already build independently and want a senior tutor to guide architecture and production details",
  },
};

export function Assessment() {
  const { t } = useLang();
  // answers[i] = 選到的分數（undefined 表未答）
  const [answers, setAnswers] = useState<(number | undefined)[]>(() =>
    QUESTIONS.map(() => undefined),
  );
  const [step, setStep] = useState(0); // 0..QUESTIONS.length-1；到 length 表全部答完
  const done = step >= QUESTIONS.length;

  const choose = (score: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = score;
      return next;
    });
    setStep((prev) => prev + 1);
  };

  const reset = () => {
    setAnswers(QUESTIONS.map(() => undefined));
    setStep(0);
  };

  const header = (
    <header className="mb-8">
      <p className="avo-kicker">{t(s.kicker)}</p>
      <h1 className="avo-display mt-2 text-3xl text-avo-dark sm:text-4xl">{t(s.title)}</h1>
      <p className="avo-prose mt-3 text-avo-ink/70">{t(s.subtitle)}</p>
    </header>
  );

  if (done) {
    const total = answers.reduce<number>((acc, v) => acc + (v ?? 0), 0);
    const level = scoreToLevel(total);
    const result = RESULT[level];
    return (
      <div>
        {header}
        <div className="avo-panel rounded-3xl p-6 sm:p-8">
          <p className="avo-kicker">{t(s.resultKicker)}</p>
          <p className="mt-3 text-sm text-avo-ink/60">{t(s.yourLevel)}</p>
          <h2 className="avo-display mt-1 text-4xl text-avo-dark">{t(result.title)}</h2>
          <p className="avo-prose mt-4 leading-relaxed text-avo-ink/85">{t(result.blurb)}</p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/match?q=${encodeURIComponent(t(MATCH_QUERY[level]))}`}
              className="rounded-full bg-avo-main px-5 py-2.5 text-center text-sm font-semibold text-avo-dark transition-colors hover:bg-avo-dark hover:text-avo-paper"
            >
              {t(s.toMatch)}
            </Link>
            <Link
              href="/tutors"
              className="rounded-full border border-avo-main/40 px-5 py-2.5 text-center text-sm font-medium text-avo-dark transition-colors hover:bg-avo-light/60"
            >
              {t(s.toTutors)}
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={reset}
          className="mt-5 text-sm text-avo-seed underline-offset-4 hover:underline"
        >
          {t(s.retake)}
        </button>
      </div>
    );
  }

  const q = QUESTIONS[step];
  return (
    <div>
      {header}
      <div className="avo-panel rounded-3xl p-6 sm:p-8">
        {/* 進度 */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-avo-main">
            {step + 1}
            {t(s.of)}
            {QUESTIONS.length} {t(s.progress)}
          </span>
          <div className="flex gap-1.5" aria-hidden>
            {QUESTIONS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-6 rounded-full ${i <= step ? 'bg-avo-main' : 'bg-avo-ink/15'}`}
              />
            ))}
          </div>
        </div>

        <h2 className="avo-display mt-5 text-xl text-avo-dark sm:text-2xl">{t(q.prompt)}</h2>

        <div className="mt-5 space-y-3">
          {q.choices.map((choice, i) => (
            <button
              key={i}
              type="button"
              onClick={() => choose(choice.score)}
              className="w-full rounded-2xl border border-avo-ink/15 bg-avo-cream px-4 py-3 text-left text-sm text-avo-ink transition-[border-color,transform] duration-[var(--dur-base)] ease-[var(--ease-out-quart)] hover:-translate-y-0.5 hover:border-avo-main focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-avo-main"
            >
              {t(choice.label)}
            </button>
          ))}
        </div>

        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((prev) => prev - 1)}
            className="mt-5 text-sm text-avo-seed underline-offset-4 hover:underline"
          >
            {t(s.back)}
          </button>
        )}
      </div>
    </div>
  );
}

export default Assessment;
