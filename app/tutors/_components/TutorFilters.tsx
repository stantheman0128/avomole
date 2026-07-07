'use client';
// app/tutors/_components/TutorFilters.tsx —— 列表頁的前端篩選器 + 卡片 grid。
// 資料（含平均評分）由 Server Component 算好傳進來，這裡只做記憶體過濾，不碰 db。
import { useMemo, useState } from 'react';
import type { PublicTutor } from '@/lib/types';
import type { Level } from '@/lib/types';
import { TutorCard } from '@/components/TutorCard';
import { useLang } from '@/lib/i18n';
import { DOMAINS, domainLabel, s, type Domain } from '../strings';

export interface RatedTutor {
  tutor: PublicTutor;
  rating: number;
}

type RateBucket = 'any' | 'low' | 'mid' | 'high';
const LEVELS: Level[] = ['beginner', 'intermediate', 'advanced'];
const levelLabel: Record<Level, { zh: string; en: string }> = {
  beginner: { zh: '初階', en: 'Beginner' },
  intermediate: { zh: '中階', en: 'Intermediate' },
  advanced: { zh: '高階', en: 'Advanced' },
};

function inBucket(rate: number, b: RateBucket): boolean {
  if (b === 'low') return rate < 1000;
  if (b === 'mid') return rate >= 1000 && rate <= 1800;
  if (b === 'high') return rate > 1800;
  return true;
}

export function TutorFilters({
  data,
  initialDomain,
}: {
  data: RatedTutor[];
  initialDomain?: Domain;
}) {
  const { t } = useLang();
  const [domains, setDomains] = useState<Domain[]>(initialDomain ? [initialDomain] : []);
  const [level, setLevel] = useState<Level | null>(null);
  const [rate, setRate] = useState<RateBucket>('any');
  const [projectsOnly, setProjectsOnly] = useState(false);

  const toggleDomain = (d: Domain) =>
    setDomains((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const clearAll = () => {
    setDomains([]);
    setLevel(null);
    setRate('any');
    setProjectsOnly(false);
  };

  const filtered = useMemo(
    () =>
      data.filter(({ tutor }) => {
        if (domains.length && !domains.some((d) => tutor.domains.includes(d))) return false;
        if (level && !tutor.teachLevels.includes(level)) return false;
        if (!inBucket(tutor.hourlyRate, rate)) return false;
        if (projectsOnly && !tutor.acceptsProjects) return false;
        return true;
      }),
    [data, domains, level, rate, projectsOnly],
  );

  const rateOptions: { key: RateBucket; label: { zh: string; en: string } }[] = [
    { key: 'any', label: s.rateAny },
    { key: 'low', label: s.rateLow },
    { key: 'mid', label: s.rateMid },
    { key: 'high', label: s.rateHigh },
  ];

  const anyFilter = domains.length > 0 || level !== null || rate !== 'any' || projectsOnly;

  return (
    <div>
      <div className="rounded-2xl border border-avo-light bg-white p-4 sm:p-5">
        {/* 領域多選 */}
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-avo-dark">{t(s.filterDomain)}</p>
          <div className="flex flex-wrap gap-2">
            {DOMAINS.map((d) => {
              const on = domains.includes(d);
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDomain(d)}
                  aria-pressed={on}
                  className={`rounded-full px-3 py-1 text-sm transition-colors ${
                    on
                      ? 'bg-avo-main text-white'
                      : 'bg-avo-light/50 text-avo-dark hover:bg-avo-light'
                  }`}
                >
                  {t(domainLabel[d])}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* 程度 */}
          <div>
            <p className="mb-2 text-sm font-medium text-avo-dark">{t(s.filterLevel)}</p>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((lv) => {
                const on = level === lv;
                return (
                  <button
                    key={lv}
                    type="button"
                    onClick={() => setLevel(on ? null : lv)}
                    aria-pressed={on}
                    className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                      on
                        ? 'border-avo-main bg-avo-main text-white'
                        : 'border-avo-main/40 bg-avo-light/40 text-avo-dark hover:bg-avo-light'
                    }`}
                  >
                    {t(levelLabel[lv])}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 時薪三檔 */}
          <div>
            <p className="mb-2 text-sm font-medium text-avo-dark">{t(s.filterRate)}</p>
            <div className="flex flex-wrap gap-2">
              {rateOptions.map((o) => {
                const on = rate === o.key;
                return (
                  <button
                    key={o.key}
                    type="button"
                    onClick={() => setRate(o.key)}
                    aria-pressed={on}
                    className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                      on
                        ? 'border-avo-seed bg-avo-seed text-avo-cream'
                        : 'border-avo-seed/40 bg-avo-light/30 text-avo-dark hover:bg-avo-light'
                    }`}
                  >
                    {t(o.label)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 可接案開關 + 清除 */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-avo-dark">
            <input
              type="checkbox"
              checked={projectsOnly}
              onChange={(e) => setProjectsOnly(e.target.checked)}
              className="h-4 w-4 accent-avo-main"
            />
            {t(s.filterProjects)}
          </label>
          {anyFilter && (
            <button
              type="button"
              onClick={clearAll}
              className="text-sm text-avo-seed underline-offset-2 hover:underline"
            >
              {t(s.clearFilters)}
            </button>
          )}
        </div>
      </div>

      {/* 結果數 */}
      <p className="mt-6 mb-3 font-mono text-sm text-avo-ink/60">
        {filtered.length} {t(s.resultCount)}
      </p>

      {/* 卡片 grid：桌面 3 欄、手機 1 欄 */}
      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-avo-light bg-white/60 px-4 py-12 text-center text-avo-ink/60">
          {t(s.empty)}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(({ tutor, rating }) => (
            <TutorCard key={tutor.slug} tutor={tutor} rating={rating} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TutorFilters;
