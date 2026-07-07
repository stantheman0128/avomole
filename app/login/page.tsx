'use client';
// app/login/page.tsx —— 登入頁（§4.6）。完整登入 UI，但不接真帳號。
// 任何提交／點擊 → showToast('Demo 版請以訪客身份繼續探索 🥑') → 導回首頁。
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLang } from '@/lib/i18n';
import { showToast } from '@/lib/toast';
import { BRAND } from '@/lib/brand';
import { LOGIN } from './strings';

export default function LoginPage() {
  const { lang, t } = useLang();
  const router = useRouter();
  const brandName = lang === 'zh' ? BRAND.zh : BRAND.en;

  // Demo：任何登入動作都走同一條路——提示後以訪客身份回首頁
  function continueAsGuest() {
    showToast(LOGIN.toast.zh);
    router.push('/');
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    continueAsGuest();
  }

  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-14 sm:py-20">
      <div className="flex flex-col items-center text-center">
        <Image
          src="/mascot.svg"
          alt={brandName}
          width={72}
          height={72}
          className="h-16 w-16"
        />
        <h1 className="mt-4 text-2xl font-bold text-avo-dark">{t(LOGIN.heading)}</h1>
        <p className="mt-2 text-sm text-avo-ink/70">{t(LOGIN.subheading)}</p>
      </div>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-avo-dark">{t(LOGIN.emailLabel)}</span>
          <input
            type="email"
            autoComplete="email"
            placeholder={t(LOGIN.emailPlaceholder)}
            className="rounded-xl border border-avo-main/40 bg-white px-4 py-2.5 text-avo-ink outline-none focus:border-avo-main"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-avo-dark">{t(LOGIN.passwordLabel)}</span>
          <input
            type="password"
            autoComplete="current-password"
            placeholder={t(LOGIN.passwordPlaceholder)}
            className="rounded-xl border border-avo-main/40 bg-white px-4 py-2.5 text-avo-ink outline-none focus:border-avo-main"
          />
        </label>

        <button
          type="submit"
          className="mt-1 rounded-full bg-avo-main px-6 py-3 font-medium text-white transition-colors hover:bg-avo-dark"
        >
          {t(LOGIN.submit)}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-avo-ink/50">
        <span className="h-px flex-1 bg-avo-light" />
        {t(LOGIN.or)}
        <span className="h-px flex-1 bg-avo-light" />
      </div>

      <button
        type="button"
        onClick={continueAsGuest}
        className="flex items-center justify-center gap-2 rounded-full border border-avo-main/40 bg-white px-6 py-3 font-medium text-avo-dark transition-colors hover:bg-avo-light/40"
      >
        <span aria-hidden className="font-mono text-avo-main">G</span>
        {t(LOGIN.google)}
      </button>

      <p className="mt-6 text-center text-sm text-avo-ink/70">
        {t(LOGIN.noAccount)}{' '}
        <button
          type="button"
          onClick={continueAsGuest}
          className="font-medium text-avo-main underline hover:text-avo-dark"
        >
          {t(LOGIN.signup)}
        </button>
      </p>

      <p className="mt-8 rounded-xl bg-avo-light/30 px-4 py-3 text-center text-xs text-avo-ink/60">
        {t(LOGIN.demoNote)}
      </p>
    </section>
  );
}
