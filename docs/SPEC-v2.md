# Spec v2：Guacamole AI — 從 demo 變平臺

版本 v2.0 ｜ 2026-07-07 ｜ 狀態：**待 Stan 過規格門後派工**
本檔延伸 `SPEC.md`（v1）。衝突處以本檔為準；v1 未變動的頁面規格仍有效。

## 0. 目標

把已上線的 demo 升級成可用平臺：
- 真帳號（學生／講師兩種角色），Auth.js + Postgres。
- **講師能真的上架**：註冊 → 填/AI 生成能力側寫卡 → 發佈 → 出現在 /tutors。
- **有護欄的 AI 助理**：只回答平臺相關問題，並探詢學生程度後推薦講師。
- **編輯/排版風重設計**：甩開 cream + 卡片格的 AI 樣板。
- **Landing 分流**：一進站問「我是講師」還是「我要找講師」。

## 1. 已定案決策（2026-07-07，Stan 拍板）

- 後端＝**全 Next.js**：Auth.js(NextAuth v5) + PostgreSQL + Prisma，部署 Zeabur。
- 設計＝**編輯/排版風**：丟 cream 底、打破卡片單調、大字、非對稱、克制動態。
- 順序＝**兩條並行**（設計線 ∥ 後端線，前置共用基礎先落地）。

## 2. 技術棧（在 v1 上增修）

新增：`next-auth@5`、`@auth/prisma-adapter`、`prisma` + `@prisma/client`、PostgreSQL（Zeabur 服務）。
沿用：Next 15 App Router、TS、Tailwind v4、`@google/genai`。
退場：`better-sqlite3` 讀取路徑與 `DATA_BACKEND=json`。seed 改成 upsert 進 Postgres。`lib/db.ts` 以 Prisma 重寫，**對外回傳型別（Tutor/PublicTutor）保持不變**，好讓設計線不被卡。

## 3. 角色與帳號

- **訪客**（無帳號）：瀏覽、用 AI 助理、看講師。
- **學生帳號**：同上 +（未來）收藏講師、聯絡。MVP 帳號存在即可，個人頁最小。
- **講師帳號**：`/dashboard` 管理自己的講師頁（上架核心）。

## 4. 資料模型（Prisma / Postgres，取代 v1 SQLite schema）

```prisma
enum Role { STUDENT TUTOR }

model User {            // Auth.js 用；含 Account/Session/VerificationToken（adapter 標準表）
  id, email @unique, name, image, role Role @default(STUDENT)
  passwordHash String?  // Credentials 登入用；OAuth 使用者可為 null
  tutorProfile TutorProfile?
  createdAt, updatedAt
}

model TutorProfile {
  id, userId @unique, slug @unique
  title, bio, avatar, hourlyRate Int, acceptsProjects Bool
  domains String[], skills String[], teachLevels String[]
  githubUsername String?
  isReal Bool @default(false), published Bool @default(false)
  hiddenScore Float        // server-only，永不進 client payload
  aiProfile Json           // {radar:{llm,cv,mlBasics,engineering,teaching,influence}, summary, difficulty, reviewDigest}
  github Json              // {username, repos[], langDist, activityNote}
  portfolio Json           // [{title,desc,link}]
  plans Json               // [{name,price,desc}]
  reviews Review[]
  endorsements Endorsement[]
  createdAt, updatedAt
}
model Review { id, tutorProfileId, author, rating Int, text }
model Endorsement { id, tutorProfileId, endorserName, endorserTitle, quote }
```

`toPublic()` 仍是傳 client 前唯一出口，剝掉 `hiddenScore`；測試把關。

## 5. 講師上架（`/dashboard`，供給側核心新功能）

- Auth-gated：只有 `role=TUTOR` 且是本人能編輯自己的 `TutorProfile`。
- 可編輯：title、bio、avatar、domains、skills、teachLevels、hourlyRate、acceptsProjects、githubUsername、portfolio[]、plans[]。
- **AI 側寫生成鈕**：server 呼叫 Gemini，吃「skills + githubUsername + 自介」產出 `aiProfile` 草稿（radar/summary/difficulty），講師可微調可見的雷達；`hiddenScore` 由 server 從雷達推導、使用者不可直接設、永不顯示。
- `published` 切換：發佈後才出現在 /tutors 與媒合池。
- 表單驗證、樂觀更新、錯誤態齊全。

## 6. 有護欄的 AI 助理

- `/api/assistant`（或擴充 `/api/chat`）：system prompt 硬邊界——
  1. 只回答「本平臺相關」問題（功能、怎麼用、找講師、上架）；離題禮貌拒絕並拉回。
  2. 主動探詢學生程度／預算／目標，理解後推薦 1-3 位**已發佈**講師並附理由。
- 平臺事實放 `lib/platform-facts.ts`（內容 Stan 之後填；先搭好結構與邊界）。
- 保留無 key 的罐頭退路。

## 7. Landing 與資訊架構

- 新 `/` Landing：品牌 + 兩道門（我是講師／我要找講師），極簡、編輯風。
- 「我要找講師」→ 學生首頁（重設計、精簡；**移除業界推薦牆**）或直接進 /match、/tutors。
- 「我是講師」→ 講師價值主張 → 註冊(role=tutor) → `/dashboard`。
- **砍**：首頁「業界推薦」牆。（假設：講師個人頁的「名人推薦」徽章保留，只砍首頁那一排。）

## 8. 設計方向：編輯/排版風（DESIGN.md 定案）

- 色板：body 丟 `--avo-cream`；承諾一個飽和/深色主色當底，酪梨綠當**強調**不當洗底。
- 字體：標題用一支 display/編輯感字體 + UI 用一支 workhorse sans（對比軸配對），數字續用 JetBrains Mono。大字、非對稱、留白節奏、用分隔線/版塊取代到處是卡片盒、克制動態（150–250ms、`prefers-reduced-motion`）。
- 打破「五排一模一樣的卡片格」。

## 9. Boundaries

- **Always**：hiddenScore server-only（toPublic + 測試）；繁中；品牌只從 `lib/brand`；granular commit 指定路徑；`lib/db` 對外型別穩定（不擋設計線）。
- **Ask first**：超出本規格的 schema 變動；清單外新依賴；破壞性資料遷移；刪 v1 頁面。
- **Never**：commit `DATABASE_URL`/secrets；洩漏 hiddenScore；假完工。

## 10. 成功標準（可測）

- Email+Google 註冊/登入可用、session 持久、角色有擋。
- 一位講師能：註冊 → 填 + AI 生成側寫卡 → 發佈 → 在 /tutors 看到自己，全程真 DB。
- 助理離題會拒絕、會探詢程度、推薦已發佈講師；無 key 罐頭仍運作。
- Landing 依角色分流；業界推薦牆移除；重設計後**重跑 impeccable critique 明顯進步**（反樣板維度 ≥3、無 cream/卡片格 tell、AI-slop 判定翻成 pass）。
- 桌面 + 390px 無破版、無 console error、hiddenScore 不在任何 client payload。
- Zeabur 部署含 Postgres、migration 有跑、現有網址與 guacamole.stan-shih.com 續服務。

## 11. 待確認假設（規格門要你點頭或修）

1. 角色＝學生 + 講師兩種（demo 不做 admin 後臺 UI）。
2. 講師側寫卡雷達＝AI 從 GitHub+skills 生草稿，講師可微調「可見雷達」，但 hiddenScore 由 server 推導、使用者不可設。
3. 現有 9 位 seed 講師＝以「預先發佈」profile 遷進 Postgres（含 Stan 真人卡）。
4. 預約試教維持 demo（或要變成真的「聯絡/預約請求」？先假設維持 demo）。
5. 只砍首頁業界推薦牆；講師個人頁的名人推薦徽章保留。
6. 真 GitHub API 抓取仍列 P2（講師手填 repo／AI 生草稿）；不在本波。
