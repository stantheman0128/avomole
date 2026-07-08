'use client';
// app/requests/_components/RequestForm.tsx —— 發需求表單（登入者可見）。
// title / description 必填，budget / level / domain 可選。送出走 createRequest server action。
// 成功後 revalidatePath 會把新需求帶進列表，這裡只清空表單 + 顯示成功語。
import { useActionState, useEffect, useRef } from 'react';
import { useLang } from '@/lib/i18n';
import { createRequest, type RequestState } from '../actions';
import { DOMAINS, domainLabel, LEVELS, levelLabel, s } from '../strings';

const inputCls =
  'rounded-xl border border-avo-main/40 bg-white px-4 py-2.5 text-avo-ink outline-none focus:border-avo-main';

const ERR: Record<NonNullable<RequestState>['error'] & string, { zh: string; en: string }> = {
  title: s.errTitle,
  desc: s.errDesc,
  generic: s.errGeneric,
};

export function RequestForm() {
  const { t } = useLang();
  const [state, formAction, pending] = useActionState<RequestState, FormData>(createRequest, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  const err = state?.error ? t(ERR[state.error]) : undefined;

  return (
    <section className="avo-panel rounded-2xl p-5 sm:p-6">
      <p className="avo-kicker">{t(s.formKicker)}</p>
      <h2 className="avo-display mt-2 text-xl text-avo-dark">{t(s.formTitle)}</h2>

      <form ref={formRef} action={formAction} className="mt-5 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-avo-dark">{t(s.fTitle)}</span>
          <input name="title" required maxLength={120} placeholder={t(s.fTitlePlaceholder)} className={inputCls} />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-avo-dark">{t(s.fDesc)}</span>
          <textarea
            name="description"
            required
            maxLength={1500}
            placeholder={t(s.fDescPlaceholder)}
            className={`${inputCls} min-h-28 resize-y`}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-avo-dark">{t(s.fBudget)}</span>
            <input
              name="budget"
              type="number"
              min={0}
              max={99999}
              placeholder={t(s.fBudgetPlaceholder)}
              className={inputCls}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-avo-dark">{t(s.fLevel)}</span>
            <select name="level" defaultValue="" className={inputCls}>
              <option value="">{t(s.fLevelAny)}</option>
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {t(levelLabel[l])}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-avo-dark">{t(s.fDomain)}</span>
            <select name="domain" defaultValue="" className={inputCls}>
              <option value="">{t(s.fDomainAny)}</option>
              {DOMAINS.map((d) => (
                <option key={d} value={d}>
                  {t(domainLabel[d])}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-avo-main px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-avo-dark disabled:opacity-60"
          >
            {pending ? t(s.submitting) : t(s.submit)}
          </button>
          {state?.ok && !pending && (
            <span role="status" className="text-sm font-medium text-avo-main">
              {t(s.posted)}
            </span>
          )}
          {err && !pending && (
            <span role="alert" className="text-sm text-red-700">
              {err}
            </span>
          )}
        </div>
      </form>
    </section>
  );
}

export default RequestForm;
