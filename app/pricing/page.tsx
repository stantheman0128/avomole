// app/pricing/page.tsx —— 定價建議（Server Component 殼）。
// 本頁不碰 db／講師，建議由 client 打 /api/pricing 取得，這裡只放版面與 metadata。
import type { Metadata } from 'next';
import { PricingAdvisor } from './_components/PricingAdvisor';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '定價建議｜Pricing advisor',
};

export default function PricingPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
      <PricingAdvisor />
    </section>
  );
}
