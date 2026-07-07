'use client';
// app/signup/page.tsx —— 真註冊頁。email/密碼/姓名/角色（學生or講師）。
// ?role=tutor（來自 Landing「我是講師」）→ 預選講師。成功自動登入並依角色導向。
import Link from 'next/link';
import Image from 'next/image';
import { Suspense, useActionState, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLang } from '@/lib/i18n';
import { BRAND } from '@/lib/brand';
import { SIGNUP } from './strings';
import { register, type SignupState } from './actions';

const ERR_KEY = {
  duplicate: SIGNUP.errDuplicate,
  password: SIGNUP.errPassword,
  email: SIGNUP.errEmail,
  name: SIGNUP.errName,
  generic: SIGNUP.errGeneric,
} as const;

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const { lang, t } = useLang();
  const brandName = lang === 'zh' ? BRAND.zh : BRAND.en;
  const params = useSearchParams();
  const initialRole = params.get('role') === 'tutor' ? 'TUTOR' : 'STUDENT';
  const [role, setRole] = useState<'STUDENT' | 'TUTOR'>(initialRole);
  const [state, formAction, pending] = useActionState<SignupState, FormData>(register, undefined);

  const roleButton = (value: 'STUDENT' | 'TUTOR', label: string) => (
    <button
      type="button"
      onClick={() => setRole(value)}
      aria-pressed={role === value}
      className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
        role === value
          ? 'border-avo-main bg-avo-main text-white'
          : 'border-avo-main/40 bg-white text-avo-dark hover:bg-avo-light/40'
      }`}
    >
      {label}
    </button>
  );

  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-14 sm:py-20">
      <div className="flex flex-col items-center text-center">
        <Image src="/mascot.png" alt={brandName} width={72} height={72} className="h-16 w-16" />
        <h1 className="mt-4 text-2xl font-bold text-avo-dark">{t(SIGNUP.heading)}</h1>
        <p className="mt-2 text-sm text-avo-ink/70">{t(SIGNUP.subheading)}</p>
      </div>

      <form action={formAction} className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-avo-dark">{t(SIGNUP.roleLabel)}</span>
          <div className="flex gap-2">
            {roleButton('STUDENT', t(SIGNUP.roleStudent))}
            {roleButton('TUTOR', t(SIGNUP.roleTutor))}
          </div>
          <input type="hidden" name="role" value={role} />
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-avo-dark">{t(SIGNUP.nameLabel)}</span>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder={t(SIGNUP.namePlaceholder)}
            className="rounded-xl border border-avo-main/40 bg-white px-4 py-2.5 text-avo-ink outline-none focus:border-avo-main"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-avo-dark">{t(SIGNUP.emailLabel)}</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={t(SIGNUP.emailPlaceholder)}
            className="rounded-xl border border-avo-main/40 bg-white px-4 py-2.5 text-avo-ink outline-none focus:border-avo-main"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-avo-dark">{t(SIGNUP.passwordLabel)}</span>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder={t(SIGNUP.passwordPlaceholder)}
            className="rounded-xl border border-avo-main/40 bg-white px-4 py-2.5 text-avo-ink outline-none focus:border-avo-main"
          />
        </label>

        {state?.error && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">
            {t(ERR_KEY[state.error])}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-1 rounded-full bg-avo-main px-6 py-3 font-medium text-white transition-colors hover:bg-avo-dark disabled:opacity-60"
        >
          {pending ? t(SIGNUP.submitting) : t(SIGNUP.submit)}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-avo-ink/70">
        {t(SIGNUP.haveAccount)}{' '}
        <Link href="/login" className="font-medium text-avo-main underline hover:text-avo-dark">
          {t(SIGNUP.login)}
        </Link>
      </p>
    </section>
  );
}
