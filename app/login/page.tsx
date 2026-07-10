'use client';
// app/login/page.tsx —— 真登入頁。Email+密碼（Credentials）＋ Google（未設定時停用）＋ 去註冊連結。
// 成功導向 /（訪客主線已與 /discover 合併）。錯誤態、loading 態齊全。
import Link from 'next/link';
import Image from 'next/image';
import { useActionState, useEffect } from 'react';
import { useLang } from '@/lib/i18n';
import { BRAND } from '@/lib/brand';
import { LOGIN } from './strings';
import { authenticate, googleSignIn, type LoginState } from './actions';

// 由 layout 環境變數注入：Google 是否可用（用 public flag，避免把 secret 帶到 client）
const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_ENABLED === '1';

export default function LoginPage() {
  const { lang, t } = useLang();
  const brandName = lang === 'zh' ? BRAND.zh : BRAND.en;
  const [state, formAction, pending] = useActionState<LoginState, FormData>(authenticate, undefined);

  // 登入成功 → 整頁硬導向 /（重掛→Nav 立刻是登入狀態）
  useEffect(() => {
    if (state?.ok) window.location.href = '/';
  }, [state]);

  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-14 sm:py-20">
      <div className="flex flex-col items-center text-center">
        <Image src="/mascot.png" alt={brandName} width={72} height={72} className="h-16 w-16" />
        <h1 className="mt-4 text-2xl font-bold text-avo-dark">{t(LOGIN.heading)}</h1>
        <p className="mt-2 text-sm text-avo-ink/70">{t(LOGIN.subheading)}</p>
      </div>

      <form action={formAction} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-avo-dark">{t(LOGIN.emailLabel)}</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={t(LOGIN.emailPlaceholder)}
            className="rounded-xl border border-avo-main/40 bg-white px-4 py-2.5 text-avo-ink outline-none focus:border-avo-main"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-avo-dark">{t(LOGIN.passwordLabel)}</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder={t(LOGIN.passwordPlaceholder)}
            className="rounded-xl border border-avo-main/40 bg-white px-4 py-2.5 text-avo-ink outline-none focus:border-avo-main"
          />
        </label>

        {state?.error && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">
            {state.error === 'invalid' ? t(LOGIN.errorInvalid) : t(LOGIN.errorGeneric)}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-1 rounded-full bg-avo-main px-6 py-3 font-medium text-white transition-colors hover:bg-avo-dark disabled:opacity-60"
        >
          {pending ? t(LOGIN.submitting) : t(LOGIN.submit)}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-avo-ink/50">
        <span className="h-px flex-1 bg-avo-light" />
        {t(LOGIN.or)}
        <span className="h-px flex-1 bg-avo-light" />
      </div>

      {googleEnabled ? (
        <form action={googleSignIn}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-avo-main/40 bg-white px-6 py-3 font-medium text-avo-dark transition-colors hover:bg-avo-light/40"
          >
            <span aria-hidden className="font-mono text-avo-main">G</span>
            {t(LOGIN.google)}
          </button>
        </form>
      ) : (
        <div>
          <button
            type="button"
            disabled
            title={t(LOGIN.googleDisabled)}
            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-avo-light bg-white px-6 py-3 font-medium text-avo-ink/40"
          >
            <span aria-hidden className="font-mono">G</span>
            {t(LOGIN.google)}
          </button>
          <p className="mt-2 text-center text-xs text-avo-ink/50">{t(LOGIN.googleDisabled)}</p>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-avo-ink/70">
        {t(LOGIN.noAccount)}{' '}
        <Link href="/signup" className="font-medium text-avo-main underline hover:text-avo-dark">
          {t(LOGIN.signup)}
        </Link>
      </p>
    </section>
  );
}
