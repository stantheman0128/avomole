'use client';
// app/pricing/_components/PricingAdvisor.tsx —— 定價建議 UI 主體。
// 表單（領域 + 技能/年資 + 可選時薪）→ fetch /api/pricing → 大字 mono 顯示建議區間 + 理由。
// 錯誤／例外一律罐頭區間，UI 永不白屏。lang 隨請求送出，讓 server 用對的語言生成。
import { useState, useCallback } from 'react';
import { useLang } from '@/lib/i18n';
import { s, DOMAIN_OPTIONS } from '../strings';

interface PricingResponse {
  low?: number;
  high?: number;
  reason?: string;
  offline?: boolean;
  error?: string;
}

interface Result {
  low: number;
  high: number;
  reason: string;
}

function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

export function PricingAdvisor() {
  const { t, lang } = useLang();
  const [domain, setDomain] = useState(DOMAIN_OPTIONS[0].value);
  const [skills, setSkills] = useState('');
  const [rate, setRate] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [offline, setOffline] = useState(false);
  const [errored, setErrored] = useState(false);
  const [loading, setLoading] = useState(false);

  const addChip = useCallback((chip: string) => {
    setSkills((prev) => {
      const parts = prev
        .split(/[,、]/)
        .map((p) => p.trim())
        .filter(Boolean);
      if (parts.includes(chip)) return prev;
      return parts.length > 0 ? `${prev.replace(/[,、\s]+$/, '')}、${chip}` : chip;
    });
  }, []);

  const advise = useCallback(
    async (domainVal: string, skillsText: string, rateText: string) => {
      const trimmed = skillsText.trim();
      if (!trimmed || loading) return;
      setLoading(true);
      setErrored(false);

      const rateNum = Number.parseInt(rateText, 10);
      const currentRate = Number.isFinite(rateNum) && rateNum > 0 ? rateNum : undefined;

      try {
        const res = await fetch('/api/pricing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain: domainVal, skills: trimmed, currentRate, lang }),
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = (await res.json()) as PricingResponse;
        setResult({
          low: typeof data.low === 'number' ? data.low : 0,
          high: typeof data.high === 'number' ? data.high : 0,
          reason: data.reason ?? '',
        });
        setOffline(Boolean(data.offline));
      } catch {
        // 網路／非 200／解析失敗：不白屏，標記 errored，讓 UI 提示重試。
        setResult({ low: 0, high: 0, reason: '' });
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
          void advise(domain, skills, rate);
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-avo-dark" htmlFor="domain">
              {t(s.domainLabel)}
            </label>
            <select
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="mt-2 w-full rounded-xl border border-avo-ink/15 bg-avo-cream px-4 py-2.5 text-sm text-avo-ink outline-none transition-colors focus:border-avo-main"
            >
              {DOMAIN_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.label)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-avo-dark" htmlFor="rate">
              {t(s.rateLabel)}
            </label>
            <input
              id="rate"
              inputMode="numeric"
              value={rate}
              onChange={(e) => setRate(e.target.value.replace(/[^\d]/g, ''))}
              placeholder={t(s.ratePlaceholder)}
              className="mt-2 w-full rounded-xl border border-avo-ink/15 bg-avo-cream px-4 py-2.5 font-mono text-sm text-avo-ink outline-none transition-colors focus:border-avo-main"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-avo-dark" htmlFor="skills">
            {t(s.skillsLabel)}
          </label>
          <input
            id="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder={t(s.skillsPlaceholder)}
            className="mt-2 w-full rounded-xl border border-avo-ink/15 bg-avo-cream px-4 py-2.5 text-sm text-avo-ink outline-none transition-colors focus:border-avo-main"
          />
          {/* 快速技能 chip */}
          <p className="mt-3 text-xs text-avo-ink/55">{t(s.chipsLabel)}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {s.skillChips.map((chip, i) => (
              <button
                key={i}
                type="button"
                disabled={loading}
                onClick={() => addChip(t(chip))}
                className="rounded-full border border-avo-main/35 px-3 py-1 text-xs text-avo-dark transition-colors hover:bg-avo-light/60 disabled:opacity-50"
              >
                + {t(chip)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={loading || !skills.trim()}
            className="rounded-full bg-avo-main px-6 py-2.5 text-sm font-semibold text-avo-dark transition-colors hover:bg-avo-dark hover:text-avo-paper disabled:opacity-50"
          >
            {loading ? t(s.thinking) : t(s.submit)}
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

          {/* 大字 mono 區間 */}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-3xl font-semibold tracking-tight text-avo-dark sm:text-5xl">
              NT${fmt(result.low)}
            </span>
            <span className="font-mono text-2xl text-avo-ink/40 sm:text-4xl">–</span>
            <span className="font-mono text-3xl font-semibold tracking-tight text-avo-dark sm:text-5xl">
              NT${fmt(result.high)}
            </span>
            <span className="font-mono text-base text-avo-ink/50 sm:text-lg">{t(s.perHour)}</span>
          </div>

          {result.reason && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-avo-dark">{t(s.reasonLabel)}</p>
              <p className="avo-prose max-w-2xl text-avo-ink/75">{result.reason}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PricingAdvisor;
