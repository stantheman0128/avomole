'use client';
// app/dashboard/_components/WorkSection.tsx —— Slice 3：作品集 + 方案。
// 兩者由同一個 server action(updatePortfolioPlans) 一次存，故包在同一個 form、一顆儲存鈕，
// 避免各自帶對方的舊值互相蓋掉。作品/方案各自是可增刪的項目列表，序列化成 hidden JSON 送出。
import { useActionState, useState } from 'react';
import { useLang } from '@/lib/i18n';
import { updatePortfolioPlans, type ActionState } from '../actions';
import { s } from '../strings';
import type { EditableProfile, PortfolioItem, PlanItem } from './types';
import { SectionHead } from './TutorEditor';
import { TextInput, TextArea, SaveRow } from './fields';

function ItemCard({ onRemove, children }: { onRemove: () => void; children: React.ReactNode }) {
  const { t } = useLang();
  return (
    <div className="avo-panel rounded-2xl p-4">
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={onRemove}
          className="text-sm text-avo-ink/50 transition-colors hover:text-red-600"
        >
          {t(s.remove)}
        </button>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

export function WorkSection({ profile }: { profile: EditableProfile }) {
  const { t } = useLang();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(profile.portfolio);
  const [plans, setPlans] = useState<PlanItem[]>(profile.plans);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updatePortfolioPlans, undefined);

  const setPf = (i: number, patch: Partial<PortfolioItem>) =>
    setPortfolio((prev) => prev.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const setPl = (i: number, patch: Partial<PlanItem>) =>
    setPlans((prev) => prev.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  const err = state?.error ? t(s.saveFailed) : undefined;

  return (
    <form action={formAction} className="flex flex-col gap-10">
      {/* 作品集 */}
      <section className="avo-panel rounded-2xl p-5 sm:p-6">
        <SectionHead kicker={t(s.portfolioKicker)} title={t(s.portfolioTitle)} />
        <div className="flex flex-col gap-4">
          {portfolio.length === 0 && (
            <p className="rounded-2xl bg-avo-light/40 px-4 py-6 text-center text-sm text-avo-ink/60">
              {t(s.portfolioEmpty)}
            </p>
          )}
          {portfolio.map((p, i) => (
            <ItemCard key={i} onRemove={() => setPortfolio((prev) => prev.filter((_, j) => j !== i))}>
              <TextInput
                value={p.title}
                onChange={(e) => setPf(i, { title: e.target.value })}
                placeholder={t(s.pfTitle)}
                maxLength={80}
              />
              <TextArea
                value={p.desc}
                onChange={(e) => setPf(i, { desc: e.target.value })}
                placeholder={t(s.pfDesc)}
                maxLength={300}
              />
              <TextInput
                value={p.link}
                onChange={(e) => setPf(i, { link: e.target.value })}
                placeholder={`${t(s.pfLink)}（https://…）`}
                maxLength={300}
              />
            </ItemCard>
          ))}
          <button
            type="button"
            onClick={() => setPortfolio([...portfolio, { title: '', desc: '', link: '' }])}
            className="w-fit rounded-full border border-avo-main/40 px-4 py-2 text-sm font-medium text-avo-dark transition-colors hover:bg-avo-light/40"
          >
            + {t(s.addPortfolio)}
          </button>
        </div>
        <input type="hidden" name="portfolio" value={JSON.stringify(portfolio)} />
      </section>

      {/* 方案 */}
      <section className="avo-panel rounded-2xl p-5 sm:p-6">
        <SectionHead kicker={t(s.plansKicker)} title={t(s.plansTitle)} />
        <div className="flex flex-col gap-4">
          {plans.length === 0 && (
            <p className="rounded-2xl bg-avo-light/40 px-4 py-6 text-center text-sm text-avo-ink/60">
              {t(s.plansEmpty)}
            </p>
          )}
          {plans.map((p, i) => (
            <ItemCard key={i} onRemove={() => setPlans((prev) => prev.filter((_, j) => j !== i))}>
              <div className="grid gap-3 sm:grid-cols-[1fr_10rem]">
                <TextInput
                  value={p.name}
                  onChange={(e) => setPl(i, { name: e.target.value })}
                  placeholder={t(s.planName)}
                  maxLength={60}
                />
                <TextInput
                  type="number"
                  min={0}
                  max={999999}
                  value={p.price}
                  onChange={(e) => setPl(i, { price: Number(e.target.value) })}
                  placeholder={t(s.planPrice)}
                />
              </div>
              <TextArea
                value={p.desc}
                onChange={(e) => setPl(i, { desc: e.target.value })}
                placeholder={t(s.planDesc)}
                maxLength={300}
              />
            </ItemCard>
          ))}
          <button
            type="button"
            onClick={() => setPlans([...plans, { name: '', price: 0, desc: '' }])}
            className="w-fit rounded-full border border-avo-main/40 px-4 py-2 text-sm font-medium text-avo-dark transition-colors hover:bg-avo-light/40"
          >
            + {t(s.addPlan)}
          </button>
        </div>
        <input type="hidden" name="plans" value={JSON.stringify(plans)} />
      </section>

      <SaveRow pending={pending} ok={state?.ok} error={err} />
    </form>
  );
}

export default WorkSection;
