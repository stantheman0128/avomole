// app/roadmap/page.tsx —— 完整產品藍圖頁（Server Component 殼）。
// 把整個產品願景（含還沒實作的功能）攤在一頁：三組功能、狀態徽章、已上線的連到對應頁、
// 規劃中／Demo 的配一格 Demo 影片示意框（無真影片）。內容渲染交給 client 子元件（要 useLang）。
import type { Metadata } from 'next';
import { RoadmapContent } from './_components/RoadmapContent';

export const metadata: Metadata = {
  title: '產品藍圖｜Roadmap',
};

export default function RoadmapPage() {
  return <RoadmapContent />;
}
