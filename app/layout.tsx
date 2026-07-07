import type { Metadata } from 'next';
import { Noto_Sans_TC, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { LangProvider } from '@/lib/i18n';
import { ToastProvider } from '@/lib/toast';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { BRAND } from '@/lib/brand';

const notoSansTC = Noto_Sans_TC({
  variable: '--font-noto-sans-tc',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
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
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body className={`${notoSansTC.variable} ${jetbrainsMono.variable} antialiased`}>
        <LangProvider>
          <ToastProvider>
            <div className="flex min-h-screen flex-col">
              <Nav />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ToastProvider>
        </LangProvider>
      </body>
    </html>
  );
}
