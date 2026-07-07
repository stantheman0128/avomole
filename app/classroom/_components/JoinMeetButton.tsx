'use client';
// 開啟 Google Meet 的按鈕。真連結、開新分頁。
import { useLang } from '@/lib/i18n';
import { CR } from '../strings';

export function JoinMeetButton({ url }: { url: string }) {
  const { t } = useLang();
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-avo-main px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-avo-dark"
    >
      <span aria-hidden>📹</span>
      {t(CR.joinButton)}
      <span className="text-xs font-normal text-avo-cream/80">↗</span>
    </a>
  );
}

export default JoinMeetButton;
