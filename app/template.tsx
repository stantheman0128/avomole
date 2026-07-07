// app/template.tsx —— 換頁過場。App Router 每次導航都重新掛載 template（不同於 layout 只掛一次），
// 所以把內容包一層 .avo-page 就能每次進場都跑一次淡入+輕微上移。
// 動畫本體與 prefers-reduced-motion 退路都在 globals.css（.avo-page / avo-page-in / avo-fade）。
// 純 CSS，無 JS 動畫庫，SSR 內容一開始就在 DOM 裡（不靠 class 才顯示，headless/背景分頁不會 ship 空白）。
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="avo-page">{children}</div>;
}
