'use client';
// 區塊外殼與標頭。標題／說明走 t()，故為 client。
// 編輯風：不放 01/02/03 裝飾序號圓圈，改 serif 標題 + 分隔線分段。
import { useLang } from '@/lib/i18n';

type Bi = { zh: string; en: string };

export function Section({
  step,
  title,
  desc,
  children,
}: {
  step: number;
  title: Bi;
  desc?: Bi;
  children: React.ReactNode;
}) {
  const { t } = useLang();
  return (
    <section>
      {/* step 保留在 props 供呼叫端排序，但不再當裝飾序號渲染 */}
      {step > 1 && <hr className="avo-rule mb-10" />}
      <div className="mb-5">
        <h2 className="avo-display text-2xl text-avo-dark sm:text-3xl">{t(title)}</h2>
        {desc && <p className="mt-2 text-sm text-avo-ink/60">{t(desc)}</p>}
      </div>
      {children}
    </section>
  );
}

export default Section;
