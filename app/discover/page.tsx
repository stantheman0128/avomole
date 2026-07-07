// app/discover/page.tsx —— 學生首頁 / 探索頁（Server Component）。
// 精簡版（Stan 指定）：只留 hero + 三亮點 + 即將推出。
// 已移除「精選講師」「依領域找講師」「業界推薦」三區塊，故不再讀 db／算評分／蒐集推薦。
// Nav 與 Footer 由 layout 全站處理。
import { HomeContent } from './_home/HomeContent';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return <HomeContent />;
}
