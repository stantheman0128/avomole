'use client';
// app/dashboard/_components/fields.tsx —— 編輯器共用小元件：欄位包裝、輸入框、儲存列。
// 收斂 input/textarea 樣式，跟 login/signup 的邊框語彙一致（rounded-xl border-avo-main/40）。
import { useLang } from '@/lib/i18n';
import { s } from '../strings';

const inputCls =
  'rounded-xl border border-avo-main/40 bg-white px-4 py-2.5 text-avo-ink outline-none focus:border-avo-main';

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-avo-dark">{label}</span>
      {children}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ''}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputCls} min-h-24 resize-y ${props.className ?? ''}`} />;
}

// 儲存列：儲存鈕 + 成功/錯誤態。error 由呼叫端已翻好成訊息字串（或 undefined）。
export function SaveRow({
  pending,
  ok,
  error,
}: {
  pending: boolean;
  ok?: boolean;
  error?: string;
}) {
  const { t } = useLang();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-avo-main px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-avo-dark disabled:opacity-60"
      >
        {pending ? t(s.saving) : t(s.save)}
      </button>
      {ok && !pending && (
        <span role="status" className="text-sm font-medium text-avo-main">
          {t(s.saved)}
        </span>
      )}
      {error && !pending && (
        <span role="alert" className="text-sm text-red-700">
          {error}
        </span>
      )}
    </div>
  );
}
