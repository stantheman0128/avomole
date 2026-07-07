import type { Metadata } from 'next';
import { Noto_Sans_TC, Noto_Serif_TC, JetBrains_Mono } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import './globals.css';
import { auth } from '@/lib/auth';
import { LangProvider } from '@/lib/i18n';
import { ToastProvider } from '@/lib/toast';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { BRAND } from '@/lib/brand';

// UI / body workhorse
const notoSansTC = Noto_Sans_TC({
  variable: '--font-noto-sans-tc',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

// display / 大標，給編輯感（對比軸配對：serif × sans）
const notoSerifTC = Noto_Serif_TC({
  variable: '--font-noto-serif-tc',
  subsets: ['latin'],
  weight: ['600', '700', '900'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${BRAND.zh}｜${BRAND.en}`,
  description: BRAND.sloganZh,
  icons: { icon: '/icon.png' },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // 從 server 取當前 session 傳給 SessionProvider：登入後（硬導向）整頁重掛即帶正確狀態，
  // Nav 不會再卡在「登入」；一般載入也沒有先閃一下未登入的問題。
  const session = await auth();
  return (
    <html lang="zh-Hant">
      <body
        className={`${notoSansTC.variable} ${notoSerifTC.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <LangProvider>
            <ToastProvider>
              <div className="flex min-h-screen flex-col">
                <Nav />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </ToastProvider>
          </LangProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
