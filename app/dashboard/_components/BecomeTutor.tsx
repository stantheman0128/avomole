'use client';
// app/dashboard/_components/BecomeTutor.tsx —— 學生後臺的「成為講師」入口。
// 給 email 註冊選錯邊、以及 Google 註冊（預設學生）的人一條升級路。
// 成功後整頁硬導向 /dashboard：重載時 jwt 重查 role、loadOrCreateProfile 建講師草稿。
import { useActionState, useEffect } from 'react';
import { becomeTutor, type ActionState } from '../actions';

export function BecomeTutor() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    (prev) => becomeTutor(prev),
    undefined,
  );

  useEffect(() => {
    if (state?.ok) window.location.href = '/dashboard';
  }, [state]);

  return (
    <div className="mt-8 avo-panel rounded-2xl p-5">
      <h2 className="avo-display text-lg text-avo-dark">想開課教 AI？</h2>
      <p className="mt-2 text-sm text-avo-ink/70">
        把帳號切換成講師身份，就能建立自己的講師頁：填技能與方案、讓 AI 讀你的 GitHub
        生成能力側寫卡，發佈後出現在講師列表。切換後仍可用同一組帳號登入。
      </p>
      <form action={formAction} className="mt-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-avo-main px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-avo-dark disabled:opacity-60"
        >
          {pending ? '切換中…' : '成為講師'}
        </button>
        {state?.error && (
          <p role="alert" className="mt-2 text-sm text-red-700">
            切換失敗了，稍後再試一次。
          </p>
        )}
      </form>
    </div>
  );
}

export default BecomeTutor;
