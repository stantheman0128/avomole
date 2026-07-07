'use client';
// 區塊外殼與標頭。標題／說明走 t()，故為 client。也提供英文模式下的
// 「示意內容為中文」小標（DEMO_CONTENT_NOTE），用在中文 mock 內容區塊上方。
// 編輯風：不放 01/02/03 裝飾序號圓圈，改 serif 標題 + 分隔線分段。
import { useLang } from '@/lib/i18n';
import { DEMO_CONTENT_NOTE } from '@/lib/chrome-strings';

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

// 英文模式下顯示的中文內容提示小標。中文模式不顯示。
export function DemoContentNote() {
  const { lang, t } = useLang();
  if (lang !== 'en') return null;
  return (
    <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-avo-light/60 px-2.5 py-0.5 text-xs text-avo-dark">
      <span aria-hidden>🌏</span>
      {t(DEMO_CONTENT_NOTE)}
    </p>
  );
}

export default Section;
