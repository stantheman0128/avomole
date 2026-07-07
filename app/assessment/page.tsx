// app/assessment/page.tsx —— 程度自我診斷（Server Component 殼）。
// 純前端邏輯，不讀 db、不呼叫 AI。內容渲染交給 client 子元件（要 useLang）。
import type { Metadata } from 'next';
import { Assessment } from './Assessment';

export const metadata: Metadata = {
  title: '程度自我診斷｜Self-assessment',
};

export default function AssessmentPage() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
      <Assessment />
    </section>
  );
}
