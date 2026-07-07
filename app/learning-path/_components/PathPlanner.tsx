'use client';
// app/learning-path/_components/PathPlanner.tsx —— 學習路徑規劃 UI 主體。
// 表單（目標 + 程度）→ fetch /api/learning-path → 分階段渲染，每階段依 domain 挑 1-2 位講師成 TutorCard。
// 錯誤／例外一律罐頭路徑，UI 永不白屏。lang 隨請求送出，讓 server 用對的語言生成。
import Link from 'next/link';
import { useState, useCallback } from 'react';
import { useLang } from '@/lib/i18n';
import type { PublicTutor, Level } from '@/lib/types';
import { TutorCard } from '@/components/TutorCard';
import { s, LEVEL_OPTIONS } from '../strings';

interface Stage {
  title: string;
  learn: string;
  domain: string;
}

interface PathResponse {
  stages?: Stage[];
  offline?: boolean;
  error?: string;
}

// 每階段最多挑 2 位講師：領域相符者，依 getTutors 原順序（品質序）取前 2。
function tutorsForDomain(tutors: PublicTutor[], domain: string): PublicTutor[] {
  return tutors.filter((t) => t.domains.includes(domain)).slice(0, 2);
}

export function PathPlanner({ tutors }: { tutors: PublicTutor[] }) {
  const { t, lang } = useLang();
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState<Level>('beginner');
  const [stages, setStages] = useState<Stage[] | null>(null);
  const [offline, setOffline] = useState(false);
  const [errored, setErrored] = useState(false);
  const [loading, setLoading] = useState(false);

  const plan = useCallback(
    async (goalText: string, lvl: Level) => {
      const trimmed = goalText.trim();
      if (!trimmed || loading) return;
      setLoading(true);
      setErrored(false);

      try {
        const res = await fetch('/api/learning-path', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ goal: trimmed, level: lvl, lang }),
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = (await res.json()) as PathResponse;
        setStages(data.stages && data.stages.length > 0 ? data.stages : []);
        setOffline(Boolean(data.offline));
      } catch {
        // 網路／非 200／解析失敗：不白屏，標記 errored，讓 UI 提示重試。
        setStages([]);
        setOffline(true);
        setErrored(true);
      } finally {
        setLoading(false);
      }
    },
    [loading, lang],
  );

  return (
    <div>
      <header className="mb-8">
        <p className="avo-kicker">{t(s.kicker)}</p>
        <h1 className="avo-display mt-2 text-3xl text-avo-dark sm:text-4xl">{t(s.title)}</h1>
        <p className="avo-prose mt-3 text-avo-ink/70">{t(s.subtitle)}</p>
      </header>

      {/* 表單 */}
      <form
        className="avo-panel rounded-3xl p-5 sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          void plan(goal, level);
        }}
      >
        <label className="block text-sm font-medium text-avo-dark" htmlFor="goal">
          {t(s.goalLabel)}
        </label>
        <input
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder={t(s.goalPlaceholder)}
          className="mt-2 w-full rounded-xl border border-avo-ink/15 bg-avo-cream px-4 py-2.5 text-sm text-avo-ink outline-none transition-colors focus:border-avo-main"
        />

        {/* 起手範例 */}
        <div className="mt-3 flex flex-wrap gap-2">
          {s.examples.map((ex, i) => (
            <button
              key={i}
              type="button"
              disabled={loading}
              onClick={() => setGoal(t(ex))}
              className="rounded-full border border-avo-main/35 px-3 py-1 text-xs text-avo-dark transition-colors hover:bg-avo-light/60 disabled:opacity-50"
            >
              {t(ex)}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label className="block text-sm font-medium text-avo-dark" htmlFor="level">
              {t(s.levelLabel)}
            </label>
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value as Level)}
              className="mt-2 w-full rounded-xl border border-avo-ink/15 bg-avo-cream px-4 py-2.5 text-sm text-avo-ink outline-none transition-colors focus:border-avo-main"
            >
              {LEVEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.label)}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading || !goal.trim()}
            className="rounded-full bg-avo-main px-6 py-2.5 text-sm font-semibold text-avo-dark transition-colors hover:bg-avo-dark hover:text-avo-paper disabled:opacity-50"
          >
            {loading ? t(s.planning) : t(s.submit)}
          </button>
        </div>
      </form>

      {/* 結果 */}
      {stages !== null && (
        <div className="mt-10">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <p className="avo-kicker">{t(s.resultKicker)}</p>
            {offline && (
              <span className="rounded-full bg-avo-seed/15 px-2 py-0.5 text-xs font-medium text-avo-seed">
                {t(s.offlineTag)}
              </span>
            )}
          </div>

          {(errored || offline) && (
            <p className="mb-6 text-sm text-avo-ink/60">
              {errored ? t(s.errorNote) : t(s.offlineNote)}
            </p>
          )}

          <ol className="space-y-8">
            {stages.map((stage, i) => {
              const picks = tutorsForDomain(tutors, stage.domain);
              return (
                <li key={i}>
                  {i > 0 && <hr className="avo-rule mb-8" />}
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-sm text-avo-main">
                      {t(s.stageLabel)} {i + 1}
                    </span>
                    <h3 className="avo-display text-xl text-avo-dark sm:text-2xl">{stage.title}</h3>
                  </div>
                  <p className="avo-prose mt-2 text-avo-ink/75">{stage.learn}</p>

                  <div className="mt-4">
                    <p className="mb-2 text-sm font-medium text-avo-dark">{t(s.tutorsForStage)}</p>
                    {picks.length > 0 ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {picks.map((tut) => (
                          <TutorCard key={tut.slug} tutor={tut} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-avo-ink/55">{t(s.noTutors)}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-10">
            <Link
              href="/tutors"
              className="text-sm font-medium text-avo-main underline-offset-4 hover:underline"
            >
              {t(s.browseAll)}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default PathPlanner;
