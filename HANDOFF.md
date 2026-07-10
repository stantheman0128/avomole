# Project Handoff

## Latest Session: 2026-07-10

### 這是什麼專案

酪梨醬 AI 家教網（Guacamole AI）：AI 領域人才的媒合平臺，用 AI 讀講師的 GitHub 生成能力側寫卡、用 AI 對話幫學生媒合講師。從黑客松 demo 長成有真後端的完整產品。

- 正式站：https://guacamole.stan-shih.com （備用 https://guacamole-ai.zeabur.app）
- 需求文件：`SPEC.md`（v1 demo 規格）、`docs/SPEC-v2.md`（真後端與重設計規格，以此為準）
- 逐版變更：`CHANGELOG.md`；部署識別碼與重部署指令：`CLAUDE.md`
- 設計系統（編輯排版風、色板、動態規則）：`DESIGN.md`

### 技術棧

Next.js 15（App Router）+ TypeScript + Tailwind v4、PostgreSQL（Zeabur）+ Prisma、Auth.js v5（Email 密碼 + Google OAuth）、Gemini API（`@google/genai`，模型 `gemini-2.5-flash`）、GitHub REST API。部署在 Zeabur（Stan 自租的 Tencent Tokyo 伺服器）。

### 怎麼跑起來

- 本機開發：`npm install && npm run dev`。注意本機連不到 Zeabur 的資料庫（`DATABASE_URL` 是 Zeabur 變數模板，只在容器內展開），所以本機看 DB 相關頁會失敗，介面開發不受影響。
- 測試：`npm test`（12 綠；2 個 DB 整合測試在本機自動跳過）。
- 部署：在**專案目錄內**跑 `npx zeabur@latest deploy --project-id 6a4d0b44721fddff77e8513b --service-id 6a4d0b69c2881a93656dfaa3 --json`。在上層目錄跑會靜默失敗（無輸出、不觸發建置）。
- 改了 `prisma/schema.prisma` 之後：部署完在容器內跑 `npx zeabur@latest service exec ... -- npx prisma db push --skip-generate`，需要資料就再 `-- npm run seed`。本機 push 不到雲端 DB。
- 環境變數（只列名稱，值都在 Zeabur 後臺）：`DATABASE_URL`、`AUTH_SECRET`、`AUTH_TRUST_HOST`、`AUTH_URL`、`GEMINI_API_KEY`、`GEMINI_MODEL`、`GOOGLE_ID`、`GOOGLE_SECRET`、`NEXT_PUBLIC_GOOGLE_ENABLED`。`GITHUB_TOKEN` 可選（沒設走未認證流量，每小時 60 次）。

### 功能現況（全部在正式站實測過）

已上線且是真功能：Landing 角色分流、AI 對話媒合（/match）、講師列表與個人頁（雷達圖 + 真 GitHub 區）、講師註冊上架全流程（/dashboard：草稿、編輯、AI 讀 GitHub 生成側寫卡、發佈）、學生「成為講師」一鍵升級、學習路徑（/learning-path）、程度診斷（/assessment）、並排比較（/compare）、課綱產生器（/syllabus）、定價建議（/pricing）、反向媒合（/requests）、教室頁課後摘要與作業示範、課堂知識庫真 AI 問答（只答本課內容）、Email 與 Google 雙登入、中英雙語（介面與示範內容都有英文版）。

示意版：進度儀表板（/progress，標示 Demo data）。未做：影片自介 + AI 字幕（需要影片上傳與轉檔基礎建設，roadmap 上保留示意框，這是刻意決定）。

### 關鍵決策（為什麼這樣做）

- 資料只經 `lib/db.ts` 進出，`hiddenScore`（內部品質分數）靠 `toPublic()` 在 server 剝除後才進 client，測試把關。這是全案最重要的鐵則。
- 講師發佈制：註冊後是草稿，按發佈才出現在列表，避免空帳號洗版。
- AI 全部帶罐頭退路：沒有 `GEMINI_API_KEY` 或呼叫失敗時回預先寫好的內容並標 `offline`，介面永不白屏。
- 講師 slug 只允許 ASCII（中文名退回 email 帳號），因為含中文的 slug 在路由上會 404。
- 登入與登出用 `redirect:false` 加瀏覽器端 `window.location` 硬導向，因為 Auth.js 在 Zeabur 反向代理後面會把導向網址解成容器內部的 localhost:8080。
- jwt 對還不是講師的 token 每次重查 role，讓「成為講師」升級即時生效、不用重新登入；講師則走快取。
- seed 的九位假講師帳號 `passwordHash` 為 null（不能登入），因為 repo 公開後寫死的共用密碼等於任何人都能改假講師的頁面。

### 已知問題與注意事項

- Tokyo 伺服器記憶體吃緊，guacamole 曾被驅逐重啟一次。已暫停同機的 banini-tracker 與 threads-menu 騰出記憶體；要更保險可在 Zeabur 後臺給服務設 memory request（CLI 沒有這個功能）。
- Google 註冊的使用者預設是學生，想教課要進後臺按「成為講師」。
- 部署後瀏覽器裡開著的舊頁面送表單可能報 Server Action not found，重新整理即可（build 之間 action id 會換）。
- `scaffoldtmp/` 是早期中斷殘留，已被 gitignore 與 tsconfig 排除，可整個資料夾刪掉。

### 下一步（如果要繼續）

1. 影片自介 + AI 字幕：需要檔案上傳、儲存與字幕管線，估工最大，roadmap 唯一缺口。
2. 進度儀表板接真資料：需要先有「上課紀錄」的資料模型，目前是示意資料。
3. 給 Zeabur 服務設 memory request/limit（後臺操作），根治驅逐風險。
4. 設 `GITHUB_TOKEN` 提高 GitHub 抓取流量上限（講師多起來才需要）。

### 給下一個 AI 的提示

- 動資料庫 schema 的流程固定是：改 schema、部署、進容器 db push（見上面「怎麼跑起來」），不要嘗試從本機連 DB。
- `zeabur deploy` 一定要在 avomole 目錄內跑。
- `NEXT_PUBLIC_*` 變數是 build 時燒進去的，改了要重新部署，光重啟沒用。
- 講師相關資料進 client 前一律過 `toPublic()`，別讓 `hiddenScore` 出現在任何 props、API 回應或 client bundle。
- UI 字串走 `lib/i18n` 的 `t({zh,en})`，共用字串在 `lib/chrome-strings.ts`，各頁自己的在該頁 `strings.ts`；站名只從 `lib/brand.ts` 取。
- 色彩只用 `avo-*` tokens（定義在 `app/globals.css`，規則在 `DESIGN.md`）。
- seed 可重複執行（upsert 加冪等清灌），跑完會自動把 Postgres 的 seq 序列推到正確位置，別拿掉那段 setval。
