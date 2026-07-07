# 設計線內頁滾動計畫（editorial/排版風）

範圍邊界見派工。只碰：discover/tutors/match/classroom 頁、Footer/TutorCard/Badge/RadarChart/LevelChips、
template.tsx、public/avatars、globals.css(加不破壞)、各頁 strings.ts、landing-strings.ts。
不碰 Nav.tsx / layout.tsx / login / signup / lib / prisma / api / data / page.tsx(除非配合 footer)。

## Phase 0：globals.css 加共用 util（不破壞現有名稱）
- [ ] `.avo-card`（內頁乾淨白版塊，取代散落 border+bg-white）— 可選，若需要
- [ ] page-transition keyframes（給 template.tsx）
- [ ] `.avo-enter-list`（stagger helper）— 若需要

## Phase 1：Footer 白 bar（快、獨立、高影響）
- [ ] Footer 依 pathname 判斷：`/` 用深色接續（drench），內頁用近白/淺版
- [ ] i18n：Footer 已走 t()，確認無寫死字

## Phase 2：換頁動畫 template.tsx
- [ ] app/template.tsx：淡入+上移 150–250ms ease-out，reduced-motion 退路
- [ ] keyframe 放 globals.css

## Phase 3：/discover 精簡 + 編輯風
- [ ] 砍三塊：精選講師(4)、依領域找講師(5)、業界推薦(6)
- [ ] 留：hero、三亮點、即將推出
- [ ] 改編輯風：非對稱 hero、破卡片格、分隔線、大字 serif
- [ ] i18n 稽核 discover（DOMAINS 常數已無用可刪）

## Phase 4：/tutors 列表編輯風
- [ ] ListHeader 大字 serif
- [ ] TutorFilters：篩選版塊 + 有節奏的清單（非三欄一致白卡）
- [ ] i18n 稽核

## Phase 5：/tutors/[slug] 個人頁
- [ ] 雷達圖 + GitHub 當視覺主角
- [ ] 六區塊非對稱重編、分隔線/版塊
- [ ] i18n 稽核（demoContentZh 已走 t()）

## Phase 6：/match 聊天室新風格
- [ ] header 大字、bubble/chips/input 配新色板
- [ ] 不動 fetch 邏輯結構
- [ ] i18n 稽核

## Phase 7：/classroom 教室頁新風格
- [ ] PageHeader、Section、Timeline、TermCards、Exercise、QA、Meeting 視覺
- [ ] 功能(翻面/展開/時間軸)保留
- [ ] i18n 稽核

## Phase 8：共用元件 editorial 化 + i18n
- [ ] TutorCard 破一致白卡感（保留可點實體性質）
- [ ] Badge / RadarChart / LevelChips 配新色板；雷達圖硬編色改 avo token
- [ ] i18n：全部走 t()

## Phase 9：9 個頭像升級
- [ ] t1–t9 各具個性、配新色板、對應領域、非真人、路徑不變
- [ ] t9 Stan 保留眼鏡簽名

## 收尾
- [x] npx tsc --noEmit（設計線範圍零錯；唯一錯是後端 agent 的 lib/auth.ts next-auth 未裝完，非我範圍）
- [x] 390px 不破版自檢（hero clamp 有 floor、roadmap -mx-5 對稱抵銷 px-5、標題 balance）
- [x] 全部 UI 字走 t()，mock 內容留中文 + EN 模式顯示 DEMO_CONTENT_NOTE
- [x] 9 頭像換新、全 avo 色板、路徑不變、t9 保留眼鏡
- [x] Footer 白 bar：依 pathname，/ 用 avo-drenched 無縫接續、內頁 bg-avo-dark

## 給 Stan 的註記（Nav 深色化，我沒動 Nav.tsx）
Nav 現在是 `bg-avo-cream/90 + border-avo-light`（近白），在 Landing（/，深綠 drench）上仍是一條淺 bar 壓深底，
跟 footer 原本的問題同類。但 Nav.tsx 是後端 agent 在改登入狀態，我沒碰。
建議二選一（等後端收工後）：
1. Nav.tsx 依 `usePathname()==='/'` 換 `avo-drenched/透明 + avo-rule-on-dark`（跟我的 Footer 對稱做法）。
2. 或 layout 層給 `/` 一個 class，用 CSS 覆蓋 Nav 底色。
我把 Footer 的判斷式留在 components/Footer.tsx 當範本，照抄即可。

## 邊界摩擦紀錄
- `app/discover/page.tsx` 同時在我（砍區塊→改成不讀 db）與後端（把 db 讀取改 async）範圍。
  我的精簡版已不讀 db，等於讓後端那份 async 改動在本檔作廢。若後端又覆寫，以「精簡版不讀 db」為準。
- tutors/match/page.tsx 我只動 wrapper className，db 讀取（已被後端改 async）原封不動。

