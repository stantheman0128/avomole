import type { Metadata } from 'next';
import { Noto_Sans_TC, Noto_Serif_TC, JetBrains_Mono } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import './globals.css';
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body
        className={`${notoSansTC.variable} ${notoSerifTC.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {/* SessionProvider（後端線）：包住整棵樹，讓 client 能讀登入狀態。只加這層，不動版面。 */}
        <SessionProvider>
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
