'use client';
// app/dashboard/_components/AiProfileSection.tsx —— Slice 4：AI 側寫卡。
// 「用 AI 生成」→ generateAiProfile()，把回傳 aiProfile 併進本地 state；雷達即時預覽。
// 使用者可微調六軸 + summary/difficulty/reviewDigest，經 updateAiProfile 存回。
// hiddenScore 從不進這裡：本元件連欄位都沒有，server 端由 radar 推導。
import { useActionState, useState, useTransition } from 'react';
import { useLang } from '@/lib/i18n';
import { RadarChart } from '@/components/RadarChart';
import { generateAiProfile, updateAiProfile, type ActionState } from '../actions';
import { RADAR_AXES, s } from '../strings';
import type { AiProfile, EditableProfile, Radar } from './types';
import { Field, TextArea, TextInput, SaveRow } from './fields';

export function AiProfileSection({ profile }: { profile: EditableProfile }) {
  const { t } = useLang();
  const [ai, setAi] = useState<AiProfile>(profile.aiProfile);
  const [fallback, setFallback] = useState(false);
  const [genError, setGenError] = useState<string | undefined>();
  const [isGenerating, startGen] = useTransition();
  const [state, formAction, saving] = useActionState<ActionState, FormData>(updateAiProfile, undefined);

  const setAxis = (k: keyof Radar, v: number) => setAi((p) => ({ ...p, radar: { ...p.radar, [k]: v } }));

  const generate = () => {
    setGenError(undefined);
    startGen(async () => {
      const res = await generateAiProfile();
      if (res?.ok) {
        setAi(res.aiProfile);
        setFallback(res.fallback);
      } else {
        setGenError(t(s.saveFailed));
      }
    });
  };

  const hasCard = ai.summary.trim().length > 0;
  const saveErr = state?.error ? t(s.saveFailed) : undefined;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-avo-ink/70">{t(s.aiIntro)}</p>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={generate}
          disabled={isGenerating}
          className="rounded-full bg-avo-dark px-6 py-2.5 text-sm font-medium text-avo-paper transition-colors hover:bg-avo-main hover:text-avo-dark disabled:opacity-60"
        >
          {isGenerating ? t(s.aiGenerating) : hasCard ? t(s.aiRegenerate) : t(s.aiGenerate)}
        </button>
        {fallback && !isGenerating && (
          <span className="text-xs text-avo-seed">{t(s.aiFallbackNote)}</span>
        )}
        {genError && !isGenerating && (
          <span role="alert" className="text-sm text-red-700">
            {genError}
          </span>
        )}
      </div>

      {!hasCard && !isGenerating ? (
        <p className="rounded-2xl bg-avo-light/40 px-4 py-6 text-center text-sm text-avo-ink/60">
          {t(s.aiEmpty)}
        </p>
      ) : (
        <form action={formAction} className="grid gap-8 md:grid-cols-[minmax(0,300px)_1fr] md:items-start">
          {/* 雷達即時預覽 + 六軸滑桿 */}
          <div className="flex flex-col gap-4">
            <div className="avo-panel flex items-center justify-center rounded-3xl p-4">
              <RadarChart radar={ai.radar} size={280} />
            </div>
            <div>
              <p className="mb-3 text-sm font-medium text-avo-dark">{t(s.aiRadarLabel)}</p>
              <div className="flex flex-col gap-2.5">
                {RADAR_AXES.map((a) => (
                  <label key={a.key} className="flex items-center gap-3 text-sm">
                    <span className="w-20 shrink-0 text-avo-ink/80">{t(a.label)}</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={ai.radar[a.key]}
                      onChange={(e) => setAxis(a.key, Number(e.target.value))}
                      className="flex-1 accent-avo-main"
                    />
                    <span className="w-9 shrink-0 text-right font-mono text-avo-ink/70">{ai.radar[a.key]}</span>
                    <input type="hidden" name={`radar_${a.key}`} value={ai.radar[a.key]} />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 文字欄位 */}
          <div className="flex flex-col gap-5">
            <Field label={t(s.aiSummaryLabel)}>
              <TextArea
                name="summary"
                value={ai.summary}
                onChange={(e) => setAi((p) => ({ ...p, summary: e.target.value }))}
                maxLength={400}
              />
            </Field>
            <Field label={t(s.aiReviewLabel)}>
              <TextArea
                name="reviewDigest"
                value={ai.reviewDigest}
                onChange={(e) => setAi((p) => ({ ...p, reviewDigest: e.target.value }))}
                maxLength={300}
              />
            </Field>
            <Field label={t(s.aiDifficultyLabel)}>
              <TextInput
                name="difficulty"
                type="number"
                min={1}
                max={5}
                value={ai.difficulty}
                onChange={(e) => setAi((p) => ({ ...p, difficulty: Number(e.target.value) }))}
                className="w-24"
              />
            </Field>
            <SaveRow pending={saving} ok={state?.ok} error={saveErr} />
          </div>
        </form>
      )}
    </div>
  );
}

export default AiProfileSection;
