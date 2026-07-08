'use client';
// app/requests/_components/RequestList.tsx —— 需求列表（編輯風、用細分隔線分段，非卡片牆）。
// 每筆顯示 title / description / budget / domain / level / 發文者 / 相對時間。
// 講師（role==='TUTOR'）每筆看到「我想教這位」→ 點了 showToast 示意（demo 不落表）。
// 非講師 / 未登入顯示提示文字，不顯示按鈕。
import { useLang } from '@/lib/i18n';
import { showToast } from '@/lib/toast';
import type { Level } from '@/lib/types';
import { domainLabel, levelLabel, s, type Domain } from '../strings';

// server 傳下來的乾淨形狀：createdAt 已轉 ISO 字串（Date 不能跨 server→client 邊界原樣傳）。
export interface RequestItem {
  id: string;
  title: string;
  description: string;
  budget: number | null;
  level: string | null;
  domain: string | null;
  createdAt: string;
  authorName: string | null;
}

// 相對時間在 client 算，避免 SSR/CSR 時間差造成 hydration 警告。
function useRelativeTime() {
  const { t } = useLang();
  return (iso: string): string => {
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return t(s.justNow);
    if (mins < 60) return `${mins} ${t(s.minsAgo)}`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ${t(s.hoursAgo)}`;
    return `${Math.floor(hours / 24)} ${t(s.daysAgo)}`;
  };
}

function Meta({ item }: { item: RequestItem }) {
  const { t } = useLang();
  const domain = item.domain && (item.domain as Domain) in domainLabel ? t(domainLabel[item.domain as Domain]) : null;
  const level = item.level && (item.level as Level) in levelLabel ? t(levelLabel[item.level as Level]) : null;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
      {domain && <span className="rounded-full bg-avo-light/60 px-2.5 py-0.5 text-avo-dark">{domain}</span>}
      {level && <span className="rounded-full bg-avo-light/60 px-2.5 py-0.5 text-avo-dark">{level}</span>}
      <span className="font-mono text-avo-seed">
        {item.budget != null ? `NT$ ${item.budget} / hr` : t(s.budgetNone)}
      </span>
    </div>
  );
}

export function RequestList({
  items,
  viewerRole,
}: {
  items: RequestItem[];
  viewerRole: 'STUDENT' | 'TUTOR' | null;
}) {
  const { t } = useLang();
  const rel = useRelativeTime();

  return (
    <section>
      <p className="avo-kicker">{t(s.listKicker)}</p>
      {items.length === 0 ? (
        <p className="mt-4 rounded-2xl bg-avo-light/40 px-4 py-10 text-center text-sm text-avo-ink/60">
          {t(s.empty)}
        </p>
      ) : (
        <ul className="mt-5 flex flex-col">
          {items.map((item, i) => (
            <li key={item.id} className={i > 0 ? 'mt-6 border-t border-avo-ink/10 pt-6' : ''}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="avo-display text-lg text-avo-dark">{item.title}</h3>
                <span className="shrink-0 font-mono text-xs text-avo-ink/50">{rel(item.createdAt)}</span>
              </div>
              <p className="avo-prose mt-2 whitespace-pre-line text-sm text-avo-ink/80">{item.description}</p>
              <Meta item={item} />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-avo-ink/60">
                  {t(s.postedBy)}：{item.authorName ?? t(s.anon)}
                </span>
                {viewerRole === 'TUTOR' ? (
                  <button
                    type="button"
                    onClick={() => showToast(t(s.interestSent))}
                    className="rounded-full bg-avo-main px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-avo-dark"
                  >
                    {t(s.interest)}
                  </button>
                ) : (
                  <span className="text-xs text-avo-ink/40">{t(s.tutorOnly)}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default RequestList;
