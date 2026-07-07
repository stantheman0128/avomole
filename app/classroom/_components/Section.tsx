'use client';
// 區塊外殼與標頭。標題／說明走 t()，故為 client。也提供英文模式下的
// 「示意內容為中文」小標（DEMO_CONTENT_NOTE），用在中文 mock 內容區塊上方。
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
    <section className="rounded-3xl border border-avo-light bg-white/50 p-5 sm:p-7">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-avo-dark font-mono text-sm text-avo-cream">
          {step}
        </span>
        <div>
          <h2 className="text-lg font-bold text-avo-dark sm:text-xl">{t(title)}</h2>
          {desc && <p className="text-sm text-avo-ink/60">{t(desc)}</p>}
        </div>
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
