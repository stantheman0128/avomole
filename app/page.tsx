// app/page.tsx —— Landing 分流頁。極簡：品牌 hero + 兩道門（找講師 / 我是講師）。
// 舊首頁那五排東西已搬到 /discover。這頁只負責分流。
// 內容都是 client 端 t() 渲染，這裡當薄薄的入口。
import { Landing } from './_landing/Landing';

export default function LandingPage() {
  return <Landing />;
}
