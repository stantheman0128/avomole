'use client';
// app/compare/_components/CompareView.tsx —— 並排比較 UI 主體。
// 兩個下拉選單挑講師 → 並排比較各列（時薪／領域／技能／程度／方案）＋兩張能力雷達 ＋ AI 短評。
// AI 短評打 /api/compare（Gemini 失敗退罐頭）；pair 或語言變動就重取。永不白屏。
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/i18n';
import type { PublicTutor } from '@/lib/types';
import { RadarChart } from '@/components/RadarChart';
import { LevelChips } from '@/components/LevelChips';
import { Badge } from '@/components/Badge';
import { s } from '../strings';

function TutorPicker({
  id,
  label,
  value,
  exclude,
  tutors,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  exclude: string;
  tutors: PublicTutor[];
  onChange: (slug: string) => void;
}) {
  const { t } = useLang();
  return (
    <div>
      <label className="block text-sm font-medium text-avo-dark" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-avo-ink/15 bg-avo-cream px-4 py-2.5 text-sm text-avo-ink outline-none transition-colors focus:border-avo-main"
      >
        <option value="">{t(s.pickPlaceholder)}</option>
        {tutors.map((tut) => (
          <option key={tut.slug} value={tut.slug} disabled={tut.slug === exclude}>
            {tut.name}
          </option>
        ))}
      </select>
    </div>
  );
}

// 一列比較：左標籤，右兩欄。cells 已是渲染好的節點。
function Row({ label, cells }: { label: string; cells: [React.ReactNode, React.ReactNode] }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4 border-t border-avo-ink/12 py-4">
      <div className="col-span-2 -mb-1 text-xs font-medium uppercase tracking-wide text-avo-ink/45">
        {label}
      </div>
      <div className="text-sm text-avo-ink/85">{cells[0]}</div>
      <div className="text-sm text-avo-ink/85">{cells[1]}</div>
    </div>
  );
}

export function CompareView({
  tutors,
  initialA,
  initialB,
}: {
  tutors: PublicTutor[];
  initialA: string;
  initialB: string;
}) {
  const { t, lang } = useLang();
  const [slugA, setSlugA] = useState(initialA);
  const [slugB, setSlugB] = useState(initialB);
  const [blurb, setBlurb] = useState('');
  const [offline, setOffline] = useState(false);
  const [blurbLoading, setBlurbLoading] = useState(false);

  const bySlug = new Map(tutors.map((tut) => [tut.slug, tut]));
  const a = slugA ? bySlug.get(slugA) : undefined;
  const b = slugB ? bySlug.get(slugB) : undefined;
  const validPair = Boolean(a && b && a.slug !== b.slug);

  // 有合法 pair 時取 AI 短評；pair 或語言變動就重取。競態用 cancelled 旗標擋掉。
  useEffect(() => {
    if (!validPair || !a || !b) {
      setBlurb('');
      setOffline(false);
      return;
    }
    let cancelled = false;
    setBlurbLoading(true);
    setBlurb('');
    fetch('/api/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ a: a.slug, b: b.slug, lang }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`status ${res.status}`);
        return res.json() as Promise<{ blurb?: string; offline?: boolean }>;
      })
      .then((data) => {
        if (cancelled) return;
        setBlurb(data.blurb ?? '');
        setOffline(Boolean(data.offline));
      })
      .catch(() => {
        // 失敗不白屏：清掉短評、當作離線，比較表照常呈現。
        if (cancelled) return;
        setBlurb('');
        setOffline(true);
      })
      .finally(() => {
        if (!cancelled) setBlurbLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [validPair, slugA, slugB, lang]);

  const pick = (zh: string, enVal?: string) => (lang === 'en' ? enVal ?? zh : zh);

  return (
    <div>
      <header className="mb-8">
        <p className="avo-kicker">{t(s.kicker)}</p>
        <h1 className="avo-display mt-2 text-3xl text-avo-dark sm:text-4xl">{t(s.title)}</h1>
        <p className="avo-prose mt-3 text-avo-ink/70">{t(s.subtitle)}</p>
      </header>

      {/* 選單 */}
      <div className="avo-panel grid gap-4 rounded-3xl p-5 sm:grid-cols-2 sm:p-6">
        <TutorPicker
          id="pick-a"
          label={t(s.pickA)}
          value={slugA}
          exclude={slugB}
          tutors={tutors}
          onChange={setSlugA}
        />
        <TutorPicker
          id="pick-b"
          label={t(s.pickB)}
          value={slugB}
          exclude={slugA}
          tutors={tutors}
          onChange={setSlugB}
        />
      </div>

      {slugA && slugB && slugA === slugB && (
        <p className="mt-4 text-sm text-avo-seed">{t(s.samePairHint)}</p>
      )}

      {validPair && a && b && (
        <div className="mt-10">
          {/* 兩位頭部：名字 + 徽章 + 時薪 + 側寫連結 */}
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4">
            {[a, b].map((tut) => (
              <div key={tut.slug}>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="avo-display text-2xl text-avo-dark">{tut.name}</h2>
                  {tut.isReal && <Badge kind="real" />}
                </div>
                <p className="mt-1 text-sm text-avo-ink/65">{pick(tut.title, tut.titleEn)}</p>
                <Link
                  href={`/tutors/${tut.slug}`}
                  className="mt-2 inline-block text-sm text-avo-main underline-offset-4 hover:underline"
                >
                  {t(s.viewProfile)}
                </Link>
              </div>
            ))}
          </div>

          {/* AI 短評 */}
          <div className="mt-6 rounded-2xl bg-avo-light/40 px-4 py-3">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-medium text-avo-main">{t(s.blurbKicker)}</span>
              {offline && !blurbLoading && (
                <span className="rounded-full bg-avo-seed/15 px-2 py-0.5 text-xs font-medium text-avo-seed">
                  {t(s.offlineTag)}
                </span>
              )}
            </div>
            <p className={`text-sm leading-relaxed text-avo-ink/85 ${blurbLoading ? 'animate-pulse text-avo-ink/50' : ''}`}>
              {blurbLoading ? t(s.blurbLoading) : blurb}
            </p>
          </div>

          {/* 比較列 */}
          <div className="mt-6">
            <Row
              label={t(s.rowRate)}
              cells={[
                <span key="a" className="font-mono text-avo-dark">
                  NT${a.hourlyRate}
                  <span className="text-avo-ink/45">{t(s.perHour)}</span>
                </span>,
                <span key="b" className="font-mono text-avo-dark">
                  NT${b.hourlyRate}
                  <span className="text-avo-ink/45">{t(s.perHour)}</span>
                </span>,
              ]}
            />
            <Row
              label={t(s.rowDomains)}
              cells={[a.domains.join('、'), b.domains.join('、')]}
            />
            <Row
              label={t(s.rowSkills)}
              cells={[a.skills.join('、'), b.skills.join('、')]}
            />
            <Row
              label={t(s.rowLevels)}
              cells={[<LevelChips key="a" levels={a.teachLevels} />, <LevelChips key="b" levels={b.teachLevels} />]}
            />
            <Row
              label={t(s.rowProjects)}
              cells={[
                a.acceptsProjects ? t(s.yes) : t(s.no),
                b.acceptsProjects ? t(s.yes) : t(s.no),
              ]}
            />
            <Row
              label={t(s.rowPlans)}
              cells={[
                <ul key="a" className="space-y-1">
                  {a.plans.map((p) => (
                    <li key={p.name}>
                      {pick(p.name, p.nameEn)}{' '}
                      <span className="font-mono text-avo-ink/55">NT${p.price}</span>
                    </li>
                  ))}
                </ul>,
                <ul key="b" className="space-y-1">
                  {b.plans.map((p) => (
                    <li key={p.name}>
                      {pick(p.name, p.nameEn)}{' '}
                      <span className="font-mono text-avo-ink/55">NT${p.price}</span>
                    </li>
                  ))}
                </ul>,
              ]}
            />
            {/* 能力雷達並列 */}
            <Row
              label={t(s.rowRadar)}
              cells={[
                <div key="a" className="flex justify-center">
                  <RadarChart radar={a.aiProfile.radar} size={240} />
                </div>,
                <div key="b" className="flex justify-center">
                  <RadarChart radar={b.aiProfile.radar} size={240} />
                </div>,
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CompareView;
