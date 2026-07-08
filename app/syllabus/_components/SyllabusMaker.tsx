'use client';
// app/syllabus/_components/SyllabusMaker.tsx —— AI 課綱產生器 UI 主體。
// 表單（主題 + 程度）→ fetch /api/syllabus → 分週渲染成時間軸列表（編輯風、非卡片牆）。
// 錯誤／例外一律罐頭課綱，UI 永不白屏。lang 隨請求送出，讓 server 用對的語言生成。
import { useState, useCallback } from 'react';
import { useLang } from '@/lib/i18n';
import type { Level } from '@/lib/types';
import { s, LEVEL_OPTIONS } from '../strings';

interface Week {
  n: number;
  title: string;
  points: string[];
}

interface SyllabusResponse {
  title?: string;
  weeks?: Week[];
  offline?: boolean;
  error?: string;
}

interface Result {
  title: string;
  weeks: Week[];
}

export function SyllabusMaker() {
  const { t, lang } = useLang();
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<Level>('beginner');
  const [result, setResult] = useState<Result | null>(null);
  const [offline, setOffline] = useState(false);
  const [errored, setErrored] = useState(false);
  const [loading, setLoading] = useState(false);

  const generate = useCallback(
    async (topicText: string, lvl: Level) => {
      const trimmed = topicText.trim();
      if (!trimmed || loading) return;
      setLoading(true);
      setErrored(false);

      try {
        const res = await fetch('/api/syllabus', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: trimmed, level: lvl, lang }),
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = (await res.json()) as SyllabusResponse;
        const weeks = Array.isArray(data.weeks) ? data.weeks : [];
        setResult({ title: data.title ?? '', weeks });
        setOffline(Boolean(data.offline));
      } catch {
        // 網路／非 200／解析失敗：不白屏，標記 errored，讓 UI 提示重試。
        setResult({ title: '', weeks: [] });
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
          void generate(topic, level);
        }}
      >
        <label className="block text-sm font-medium text-avo-dark" htmlFor="topic">
          {t(s.topicLabel)}
        </label>
        <input
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={t(s.topicPlaceholder)}
          className="mt-2 w-full rounded-xl border border-avo-ink/15 bg-avo-cream px-4 py-2.5 text-sm text-avo-ink outline-none transition-colors focus:border-avo-main"
        />

        {/* 起手範例 */}
        <div className="mt-3 flex flex-wrap gap-2">
          {s.examples.map((ex, i) => (
            <button
              key={i}
              type="button"
              disabled={loading}
              onClick={() => setTopic(t(ex))}
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
            disabled={loading || !topic.trim()}
            className="rounded-full bg-avo-main px-6 py-2.5 text-sm font-semibold text-avo-dark transition-colors hover:bg-avo-dark hover:text-avo-paper disabled:opacity-50"
          >
            {loading ? t(s.generating) : t(s.submit)}
          </button>
        </div>
      </form>

      {/* 結果 */}
      {result !== null && (
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

          {result.title && (
            <h2 className="avo-display text-2xl text-avo-dark sm:text-3xl">{result.title}</h2>
          )}

          <ol className="mt-6 space-y-8">
            {result.weeks.map((week, i) => (
              <li key={i}>
                {i > 0 && <hr className="avo-rule mb-8" />}
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm text-avo-main">
                    {lang === 'zh'
                      ? `${t(s.weekLabel)} ${week.n} ${t(s.weekUnit)}`
                      : `${t(s.weekLabel)} ${week.n}`}
                  </span>
                  <h3 className="avo-display text-xl text-avo-dark sm:text-2xl">{week.title}</h3>
                </div>
                <ul className="avo-prose mt-3 space-y-1.5 text-avo-ink/75">
                  {week.points.map((point, j) => (
                    <li key={j} className="flex gap-2">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-avo-main/60" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default SyllabusMaker;
