# 酪梨醬 AI 家教網（Guacamole AI）— 黑客松 Demo 規格書

版本 v1.1 ｜ 2026-07-07 ｜ 交付期限：2026-07-07 23:59（台北時間）
狀態：已核可，開工中（名稱與網域已由 Stan 定案）

> **給實作 AI 的說明**：本文件是唯一規格來源。專案根目錄為 `C:\Users\stans\Projects\avomole\`（已 git init）。這是一個「展示功能全貌」的 Demo 網站，不是生產系統——每個畫面都要存在且好看，但背後不必都是真的。P0 = 今晚必須完成；P1 = 盡量；P2 = 有剩餘時間才做。優先做完所有 P0 再碰 P1。

---

## 0. 一句話定位

**AI 領域人才的專門媒合平臺：用 AI 來評估「教 AI 的人」，用 AI 來媒合「學 AI 的人」。**

傳統家教網的信任來源是學歷與考試成績；AI 講師的信任來源是 GitHub、實務作品與社群影響力——而這些資料是機器可讀的。所以「用 AI 引擎自動評估講師」在這個領域成立，這是本平臺與一般接案平臺的根本差異。

## 1. 交付物與成功標準

- 一個公開網址（Zeabur 部署，先用 `*.zeabur.app`，之後可綁 `avomole.dev`）。
- 評審**無人導覽**可自行逛完三大亮點：AI 對話媒合、AI 講師側寫卡、AI 課後摘要。
- 桌面與手機（寬 390px）都不破版。
- 品質門檻：無 console error、站內無 404 連結、AI 聊天在 API 失敗時有罐頭退路、雙語切換不破版。

## 2. 品牌

| 項目 | 定案 |
|---|---|
| 中文名 | 酪梨醬 AI 家教網 |
| 英文名 | Guacamole AI |
| 名稱由來 | AI → 聰明的水果 → 酪梨 avocado → guacamole（酪梨醬）→ 字裡藏著 **mole**（鼴鼠） |
| 吉祥物 | 一顆戴眼鏡、看起來很聰明的酪梨，騎在一隻鼴鼠上（SVG 手繪風即可） |
| Slogan | 中：「學 AI，找酪梨醬。」／英：「Dip into AI.」 |

（專案目錄與 repo 名沿用 `avomole`，不影響品牌顯示。）

**色彩 tokens**（定義為 CSS variables / Tailwind theme）：

- `--avo-dark` `#2E4A1F` 果皮深綠（標題、nav）
- `--avo-main` `#6B9E3E` 果肉綠（主色、按鈕）
- `--avo-light` `#C9DCA6` 淺果肉（卡片底、hover）
- `--avo-cream` `#F8F6EC` 奶油白（頁面底色）
- `--avo-seed` `#9C6B3F` 果核棕（強調、徽章）
- 內文字色 `#22301A`

字體：`Noto Sans TC`（全站）＋ `JetBrains Mono`（數字、代碼、GitHub 統計）。Google Fonts 載入。

**品牌名實作規則**：中英文站名、slogan 一律取自 `lib/brand.ts` 的常數（並同步存在於兩個 locale 字典），任何頁面不得寫死站名字串——改名必須是改一處的事。

**頁尾聲明（每頁必有）**：「本網站為黑客松 Demo。講師、評價與推薦資料除特別標示外均為虛構示意。」

## 3. 技術棧（定案，不要更換）

- **Next.js 15（App Router）+ TypeScript + Tailwind CSS**。UI 元件自寫，不引入大型元件庫。
- **資料庫：SQLite**（`better-sqlite3`）。`scripts/seed.ts` 從 `data/tutors.json` 產生 `data/avomole.db`，db 檔隨 repo 提交。所有資料存取只透過 `lib/db.ts` 這一層（未來換 Postgres 只改這層）。
  - **退路**：若 `better-sqlite3` 在部署環境編譯失敗，設 env `DATA_BACKEND=json`，`lib/db.ts` 改為直接讀 `data/tutors.json`，對外介面完全不變。不得因 DB 問題卡住部署。
- **LLM：Google Gemini API**，SDK 用 `@google/genai`。模型由 env `GEMINI_MODEL` 控制，預設 `gemini-2.5-flash`。**只在 server route 呼叫**，key 讀 env `GEMINI_API_KEY`，絕不出現在前端 bundle。
- **部署：Zeabur**。所需 env：`GEMINI_API_KEY`、`GEMINI_MODEL`（可省略）、`DATA_BACKEND`（可省略）。
- **i18n：不用框架**。`lib/i18n.tsx` 提供 React context（`useLang()` 回傳 `{lang, setLang, t}`，`t()` 吃 `{zh, en}` 物件）。Nav 右上「中／EN」切換，選擇存 localStorage。**字串存放規則（平行開發防衝突）**：Nav/Footer 等共用 chrome 字串放 `lib/chrome-strings.ts`（僅 scaffold 任務可改）；各頁面自己的字串放該頁目錄下的 `strings.ts`，不碰共用檔。UI 介面文案全雙語；mock 內容（自傳、評價內文）維持中文，英文模式下在內容區顯示小標「Demo content in Chinese」。
- **工程紀律**（Stan 的通則）：每完成一個 P0 區塊就 commit（`feat: ...`），維護 `CHANGELOG.md`；禁 `git add -A`，指定路徑 add。

### 檔案結構（建議）

```
app/
  layout.tsx  page.tsx              # 首頁
  tutors/page.tsx  tutors/[slug]/page.tsx
  match/page.tsx
  classroom/page.tsx
  login/page.tsx
  api/chat/route.ts
  api/classroom-qa/route.ts         # P1
components/   lib/db.ts  lib/i18n.tsx  lib/gemini.ts
data/tutors.json  data/avomole.db   scripts/seed.ts
locales/zh-TW.json  locales/en.json
public/mascot.svg  public/avatars/*.svg
```

## 4. 頁面規格

### 4.1 `/` 首頁（P0）

由上而下：

1. **Nav**：吉祥物小 logo＋「酪梨 AI 家教網」、連結（找講師、AI 媒合、教室體驗）、右側「登入」鈕與「中／EN」切換。訪客狀態在 nav 顯示「訪客模式」pill。
2. **Hero**：吉祥物插圖（酪梨騎鼴鼠 SVG）＋ slogan ＋一個大輸入框（placeholder：「告訴酪梨你想學什麼…」），送出即導向 `/match?q=<輸入文字>` 並自動發問。
3. **三亮點卡**：AI 對話媒合／AI 講師能力側寫／AI 課後摘要，各附一句說明與入口連結。
4. **精選講師**：4 張講師卡（含 Stan 的真人卡，見 §5）。
5. **領域分類導覽**：LLM 應用、Agent 開發、電腦視覺、MLOps、資料科學、AI 入門 → 連到 `/tutors?domain=<x>`。
6. **名人推薦牆**：3 位虛構「認證帳號」頭像＋推薦語＋藍勾勾樣式徽章。
7. **Roadmap 區塊**：「即將推出」三卡——學習路徑規劃、自動作業生成與批改、個人學習知識庫。
8. Footer：示意聲明、GitHub repo 連結。

### 4.2 `/tutors` 講師列表（P0)

- 頂部篩選列:領域（多選 chips）、程度（初／中／高）、時薪區間（滑桿或三檔）、「可接案」開關。前端過濾即可。
- 卡片 grid（RWD：桌面 3 欄、手機 1 欄）：頭像、姓名、title、技能 chips（最多 4 個＋「+n」）、時薪、評分星、名人推薦徽章（有才顯示）。點卡進個人頁。

### 4.3 `/tutors/[slug]` 講師個人頁（P0，全站最重的頁）

1. **頭部**：頭像、姓名、title、徽章（「名人推薦」「可接案」「真實資料」）、時薪、「預約試教」按鈕（點擊彈 toast：「Demo 版尚未開放預約，歡迎以訪客身份繼續探索」）。
2. **AI 能力側寫卡**（視覺重點，淺綠底、標註「由 AvoMole AI 引擎生成」）：
   - 六軸雷達圖（**SVG 自繪**，不引圖表庫）：LLM、電腦視覺、ML 基礎、工程實務、教學經驗、社群影響力（0–100）。
   - AI 短評一段（seed 資料內建，非即時生成）。
   - 適教程度 chips（初階／中階／高階）與專案難度分級（★1–5）。
3. **GitHub 區**：repo 卡片（名稱、描述、星數、主語言）、語言分佈橫條、一句貢獻概況。資料來自 seed（Stan 的卡用真實 repo 資料，手動整理進 seed；**即時抓 GitHub API 為 P2，今晚不做**）。
4. **作品集**：2–3 個專案卡（標題＋描述＋示意連結）。
5. **評價區**：評價列表＋頂部「AI 評價摘要」框（例：「87% 學生提到講解淺顯易懂」，seed 內建）。
6. **課程方案**：1–3 個方案價目卡（單堂體驗／十堂方案等）。

### 4.4 `/match` AI 媒合聊天室（P0，全站最大亮點）

- 聊天 UI：訊息列表、輸入框、3 個建議 prompt chips（「我有 Python 基礎，想學 fine-tuning」「完全新手，想入門 AI」「想找人指導我的 RAG 專案」）。支援 `?q=` 自動送出第一問。
- **`POST /api/chat`**：body `{messages: [{role, content}]}`。Server 端組 system prompt（§6），呼叫 Gemini（JSON mode：`responseMimeType: "application/json"` ＋ responseSchema），回 `{reply, recommendations: [{tutor_id, reason}]}`。
- 前端把 `recommendations`（以 slug 對應講師）渲染成**內嵌講師推薦卡**：頭像、姓名、推薦理由、「看個人頁」連結。這個「AI 回答裡長出可點的講師卡」就是 demo 的高潮畫面。
- **錯誤處理（必做）**：10 秒 timeout、非 200、JSON 解析失敗 → 走罐頭退路：依使用者文字做關鍵字比對（領域詞→domains），選 2 位講師回覆固定格式建議，卡片標註「離線建議」。UI 永不白屏、永不裸露錯誤訊息。
- 簡單防刷：同 IP 每分鐘 10 次（記憶體 Map 即可，單容器夠用）。

### 4.5 `/classroom` 教室體驗示範頁（P0，允許最後完成）

以一堂虛構課「LoRA 微調實戰（第 3 堂）」為例，展示上課前後的完整體驗：

1. **上課資訊卡**：Google Meet 連結（放真的 meet.google.com 連結格式）、如何進入教室的三步驟說明、「本課將錄影並由 AI 產生摘要」告知。
2. **AI 課程摘要**（完整假輸出，seed 靜態內容）：章節時間軸（00:00 複習上堂、08:12 LoRA 原理、23:40 實作…；點擊顯示 tooltip「Demo：錄影檔未附」）、重點條列 5–8 條、專有名詞卡 3 張（LoRA rank、學習率、過擬合——正面名詞、背面白話解釋，hover 翻面）。
3. **本課練習題**：3 題示意（選擇×2、簡答×1），每題可展開「AI 批改示範」：假的學生答案＋AI 給的批改與建議。
4. **課堂知識庫問答框**（P1）：輸入問題 → `POST /api/classroom-qa`，以本課摘要為 context 呼叫 Gemini 回答；沒時間就做成罐頭問答（3 個預設問題可點）。

### 4.6 `/login` 登入頁（P0）

- 完整登入 UI：email＋密碼欄、「使用 Google 登入」鈕、註冊連結。
- 任何提交／點擊 → toast「Demo 版請以訪客身份繼續探索 🥑」→ 導回首頁。
- 這頁的目的：讓評審看到「帳號系統在規劃內」，而非做半套真登入。

### 4.7 `/roadmap` 學習路徑示意頁（P2）

靜態一頁：範例目標「三個月做出自己的 RAG 應用」→ 三階段時間軸，每階段配建議課程與講師卡。沒時間就砍，首頁 Roadmap 區塊已足夠。

## 5. 資料模型與 mock 資料

### SQLite schema

```sql
CREATE TABLE tutors (
  id INTEGER PRIMARY KEY, slug TEXT UNIQUE, name TEXT, name_en TEXT,
  title TEXT, avatar TEXT, bio TEXT, hourly_rate INTEGER,
  domains TEXT,        -- JSON array
  skills TEXT,         -- JSON array
  teach_levels TEXT,   -- JSON array: ["beginner","intermediate","advanced"]
  accepts_projects INTEGER, is_real INTEGER,
  hidden_score REAL,   -- 0-100，只進 AI prompt，永不顯示於 UI
  ai_profile TEXT,     -- JSON: {radar:{llm,cv,ml_basics,engineering,teaching,influence}, summary, difficulty, review_digest}
  github TEXT,         -- JSON: {username, repos:[{name,desc,stars,lang}], lang_dist:{...}, activity_note}
  portfolio TEXT,      -- JSON array: [{title, desc, link}]
  plans TEXT           -- JSON array: [{name, price, desc}]
);
CREATE TABLE endorsements (id INTEGER PRIMARY KEY, tutor_id INTEGER,
  endorser_name TEXT, endorser_title TEXT, quote TEXT);
CREATE TABLE reviews (id INTEGER PRIMARY KEY, tutor_id INTEGER,
  author TEXT, rating INTEGER, text TEXT);
```

### Seed 內容要求

- **8 位虛構講師**＋**1 位真實講師（Stan Shih）**，共 9 位。
- 虛構講師用台灣常見姓名（例：林品睿、張筱涵、吳建霖、陳威廷、黃郁婷…），頭像用 SVG 生成的幾何頭像（不用真人照片）。領域、程度、價位要打散：至少涵蓋 LLM 應用×2、Agent 開發、電腦視覺、MLOps、資料科學、AI 入門；時薪 NT$600–2500；初中高階都有人教。
- **Stan 的真人卡**：`is_real=1`，name「Stan Shih」，GitHub username `stantheman0128`，repo 精選由 Stan 提供或實作 agent 從其公開 GitHub 頁面整理 3–5 個（星數如實），徽章顯示「真實資料」。側寫卡雷達與短評可由實作 agent 根據 repo 合理撰寫。
- 每位講師 2–4 則評價、`ai_profile.review_digest` 一句 AI 摘要。
- **3 位虛構名人認證帳號**（例：「陳志明・AI 補教名師」「林教授・大學 AI 實驗室主持人」「DataQueen・百萬訂閱科技 YouTuber」），合計推薦至少 4 位講師。**不得使用真實人物姓名**（頁尾已有虛構聲明，仍以虛構名為原則）。
- `hidden_score` 人工設定（60–95 打散），與雷達圖大致一致。

## 6. AI Prompt 規格（`/api/chat`）

System prompt 模板（server 端組裝，`{TUTORS_JSON}` 為全部講師的精簡摘要：slug、name、title、domains、skills、teach_levels、hourly_rate、hidden_score、ai_profile.summary）：

```
你是「酪梨醬 AI 家教網（Guacamole AI）」的媒合助理，一顆聰明友善的酪梨。
以下是平臺全部講師資料（JSON）：{TUTORS_JSON}

規則：
1. 根據使用者的學習需求、程度與預算，推薦 1-3 位講師。
2. hidden_score 是內部品質分數，可用於排序取捨，但絕對不能在回覆中
   提及這個分數或它的存在。
3. 每位推薦必須給具體理由：引用該講師的技能、專案、教學經驗或評價摘要。
4. 若使用者需求超出平臺講師範圍，誠實說明並推薦最接近的人選。
5. 回覆語言跟隨使用者（繁體中文或英文）。語氣親切、精簡，不超過 150 字。
6. 嚴格輸出 JSON：{"reply": string, "recommendations": [{"slug": string, "reason": string}]}
   其中 slug 必須是講師資料中存在的 slug。
```

- Gemini 呼叫帶 `responseMimeType: "application/json"` 與對應 `responseSchema`。
- `recommendations` 可為空陣列（純聊天回覆）。
- 對話歷史直接轉成 Gemini 的 contents 格式送出，最多帶最近 10 則。

## 7. Demo 敘事線（3 分鐘，同時是驗收路徑）

1. 首頁 hero → 輸入「我有 Python 基礎，想學 fine-tuning」→ 跳轉 `/match` 自動發問。
2. AI 回覆＋2 張推薦卡（附理由）→ 點進 Stan 的講師頁。
3. 看 AI 能力側寫卡（雷達圖）→ 往下看真實 GitHub repo 區 → 名人推薦徽章。
4. 點「預約試教」→ Demo toast → 前往 `/classroom`。
5. 看 AI 課程摘要時間軸 → 展開一題「AI 批改示範」。
6. 右上角切 EN → 介面變英文不破版 → 回首頁看 Roadmap 區塊收尾。

## 8. 驗收 checklist（完工前逐項確認）

- [ ] 上述敘事線 6 步在桌面與手機（390px）都能走完且不破版。
- [ ] `/api/chat` 真呼叫 Gemini 成功回推薦卡；**拔掉 API key 再測一次**，罐頭退路正常。
- [ ] 全站無 console error、無 404 連結。
- [ ] 中英切換每頁都試過。
- [ ] 頁尾示意聲明存在於所有頁面。
- [ ] `hidden_score` 未出現在任何 UI 或前端 bundle 可見處（只在 server）。
- [ ] Zeabur 部署成功，公網網址可訪問。

## 9. 明確不做（本版）

金流、真帳號系統、即時訊息、行事曆整合、真影片播放、接案發案流程、即時 GitHub API 抓取、社群數據爬蟲（hidden_score 為示意值）、SEO。

## 10. 部署與網域（定案：選項 B）

1. Zeabur 新專案 `guacamole-ai`，連 GitHub repo 或直接部署，設定 env `GEMINI_API_KEY`。
2. 先用 Zeabur 預設網址上線當保底。
3. 正式網址：**`guacamole.stan-shih.com`**——stan-shih.com 的 DNS 在 Stan 的 Cloudflare 帳號，新增 CNAME 指向 Zeabur 提供的目標；若 TLS 憑證簽發卡住，把該筆紀錄設為 DNS only（灰雲）再重試。Zeabur 端用自訂網域綁定完成。

## 11. Roadmap（簡報／首頁用，不實作）

學習路徑規劃（目標→階段→配講師）、程度診斷測驗、反向媒合（學生發需求、講師應徵）、講師並排比較、AI 課綱產生器、定價建議、個人學習知識庫（跨課 RAG 問答）、自動作業生成與批改、接案完整流程、真實社群數據接入隱藏評分引擎。
