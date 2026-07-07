'use client';
// app/tutors/_components/BookButton.tsx —— 「預約試教」鈕。Demo：點擊只彈 toast。
import { showToast } from '@/lib/toast';
import { useLang } from '@/lib/i18n';
import { s } from '../strings';

export function BookButton({ className = '' }: { className?: string }) {
  const { t } = useLang();
  return (
    <button
      type="button"
      onClick={() => showToast(t(s.bookToast))}
      className={`rounded-full bg-avo-main px-6 py-2.5 font-medium text-white transition-colors hover:bg-avo-dark ${className}`}
    >
      {t(s.book)}
    </button>
  );
}

export default BookButton;
