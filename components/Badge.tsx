'use client';
// components/Badge.tsx —— 講師徽章。kind: endorsed（名人推薦）／real（真實資料）／projects（可接案）。
import { useLang } from '@/lib/i18n';

export type BadgeKind = 'endorsed' | 'real' | 'projects';

const LABEL: Record<BadgeKind, { zh: string; en: string }> = {
  endorsed: { zh: '名人推薦', en: 'Endorsed' },
  real: { zh: '真實資料', en: 'Verified data' },
  projects: { zh: '可接案', en: 'Open to projects' },
};

const STYLE: Record<BadgeKind, string> = {
  endorsed: 'bg-avo-seed text-avo-cream',
  real: 'bg-avo-dark text-avo-cream',
  projects: 'bg-avo-light text-avo-dark',
};

export function Badge({ kind }: { kind: BadgeKind }) {
  const { t } = useLang();
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLE[kind]}`}
    >
      {kind === 'endorsed' && <span aria-hidden>★</span>}
      {kind === 'real' && <span aria-hidden>✓</span>}
      {t(LABEL[kind])}
    </span>
  );
}

export default Badge;
