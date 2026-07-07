# Guacamole AI v2 實作計畫（設計線 ∥ 後端線）

需求唯一來源＝`docs/SPEC-v2.md`（+ 未變動處看 `SPEC.md`）。本檔只講「怎麼分工」。
執行前提：Stan 已過規格門。subagent 一律 model opus，遵守檔案邊界。

## 架構總覽

一個 Next.js codebase。兩條並行線靠「介面契約」對齊，共用基礎先落地。

```
Phase 0（前置，先落地）
  0A 設計基礎：DESIGN.md + 新 tokens(globals.css) + 版型 primitives + 字體
  0B 資料/認證基礎：Prisma schema + Postgres 接線 + lib/db 以 Prisma 重寫(型別不變) + Auth.js 骨架 + seed 遷移
        ↓                                   ↓
Wave A（設計線，∥）                    Wave B（後端線，∥）
  Landing 分流、學生首頁重設計、          真 /login+/signup、/dashboard 講師 CRUD、
  /tutors、/tutors/[slug]、/match、       /api/assistant 護欄助理、角色守衛、
  /classroom 視覺重設計、移除業界推薦牆     AI 側寫生成 endpoint
        ↓                                   ↓
Wave C 整合 QA（build+auth 流程+真 CRUD 端到端+重跑 impeccable critique）
        ↓
Wave D 部署（Zeabur 加 Postgres、migration、env、驗證）
```

## 介面契約（兩線共識）

- `lib/types.ts`：`Tutor`/`PublicTutor` 維持；必要時只加 `published`、`githubUsername`（已相容）。
- `lib/db.ts`：`getTutors/getTutorBySlug/getReviews/getEndorsements/toPublic` **簽名不變**，改 Prisma-backed（0B）。Postgres 未上線前先以 seed/JSON backing，讓設計線頁面照渲染。
- 設計 tokens：0A 先落地 `globals.css` 的新 token 名（保留 avo-* 命名相容或提供對照），Wave B 的新頁面直接沿用，不自訂色。
- 新增路由歸屬：`/login`(改真)、`/signup`、`/dashboard/**`、`/api/auth/**`、`/api/assistant`、`lib/auth.ts`、`prisma/**` ＝**後端線**。`/`(landing)、學生首頁、既有四頁重設計、`components/**`、`globals.css`、`layout.tsx` ＝**設計線**。
- 衝突面：`layout.tsx`（掛 SessionProvider vs 掛新版 chrome）→ 0 階段先由設計線定 layout 結構、預留 `<SessionProvider>` 插槽，後端線只填 provider。

## Phase 0（前置，必須先過）

- **0A 設計基礎（設計線先手）**：寫 `DESIGN.md`（編輯/排版風：色板落地、字體配對、版型 primitives、動態規則）；改 `globals.css` tokens（丟 cream、定新 body/ink/accent）；建 3-4 個版型 primitive（Section/Divider/Prose/Stat 之類，非卡片盒）；layout 預留 SessionProvider 插槽。
  - Verify：`npm run build` 過；既有頁面在新 token 下不破。
- **0B 資料/認證基礎（後端線先手）**：`prisma/schema.prisma`（§4 模型）；`lib/prisma.ts`；`lib/db.ts` 以 Prisma 重寫（型別不變）；`lib/auth.ts`（Auth.js v5：Credentials + Google，Prisma adapter）；`scripts/seed.ts` 改 upsert 9 位 seed 講師進 Postgres；`.env.example`（DATABASE_URL、AUTH_SECRET、GOOGLE_ID/SECRET）。
  - Verify：本機起一個 Postgres（或 Zeabur 先開）跑 `prisma migrate dev` + `npm run seed`；db 單元測試（兩查詢 + toPublic 剝 hiddenScore）綠。

## Wave A：設計線（Phase 0A 後，可平行多 agent）

- A1 Landing `/`：兩道門（我是講師／我要找講師）分流，編輯風 hero。
- A2 學生首頁（重設計、精簡、**移除業界推薦牆**）+ 三亮點改非卡片版塊 + 領域導覽。
- A3 `/tutors` 列表 + `/tutors/[slug]` 個人頁視覺重設計（雷達/GitHub 區當視覺主角、破卡片格）。
- A4 `/match` + `/classroom` 視覺重設計沿用新版型。
- Verify：每頁桌面+390px 不破、無 console error、雙語不破；重跑 `impeccable critique` 反樣板維度 ≥3。

## Wave B：後端線（Phase 0B 後，可平行多 agent）

- B1 Auth：真 `/login` + `/signup`（Email 密碼 + Google），session 持久，`role` 選擇（signup 分流帶入）。
- B2 `/dashboard` 講師 CRUD：編輯所有 profile 欄位、portfolio/plans 增刪、`published` 切換；只有本人可編。
- B3 AI 側寫生成 `/api/tutor/ai-profile`：Gemini 吃 skills+github 產 aiProfile 草稿；hiddenScore server 推導。
- B4 護欄助理 `/api/assistant` + `lib/platform-facts.ts`：邊界 system prompt、探詢程度、推薦已發佈講師、罐頭退路。
- Verify：註冊→填→AI 生成→發佈→出現在 /tutors 端到端；助理離題會拒；角色守衛擋非本人；`npm test` 綠。

## Wave C：整合 QA
`npm run build` + Playwright 走「訪客找講師」與「講師上架」兩條真流程（桌面+390px）；核對 SPEC-v2 §10；重跑 impeccable critique 對照分數；修到全過。

## Wave D：部署
Zeabur 加 PostgreSQL 服務 → 設 `DATABASE_URL`/`AUTH_SECRET`/`GOOGLE_*`/`GEMINI_API_KEY` → `prisma migrate deploy` + seed → 驗證兩網址 + 真註冊/上架流程。

## 風險與緩解

- **並行撞 layout/globals**：Phase 0 先定契約與插槽，後端線不碰設計檔。
- **Auth.js v5 + Next15 設定雷**：0B 先跑通最小登入再擴充；用 context7 查現行 API。
- **Postgres 未就緒擋設計線**：lib/db 型別不變 + seed backing，設計線不依賴真 DB。
- **hiddenScore 洩漏**：toPublic 單一出口 + 測試 + client payload 掃描（沿用現行把關）。
- **範圍膨脹**：Roadmap 功能（學習路徑/診斷/並排/儀表板）本波不做，維持 SPEC-v2 邊界。
