# CHANGELOG

酪梨醬 AI 家教網（Guacamole AI）黑客松 demo 開發紀錄。

## Wave 0 — Scaffold 與核心基礎

### 完成 Task 1（seed、測試、部署設定）
- 新增 `scripts/seed.ts`：讀 `data/tutors.json`，建出 `data/avomole.db`（SQLite）。匯出 `buildDb`/`loadData` 給測試重用；`data/tutors.json` 不存在時退 sample。產出的 db 檔隨 repo 提交。
- 新增 `tests/db.test.ts` + `vitest.config.ts`：涵蓋 JSON 與 SQLite 兩種 backend 的 `getTutorBySlug`、`toPublic`（驗證 hiddenScore 被剝除）。
  - vitest 需把 `server-only` alias 成空模組（`tests/stubs/empty.ts`），否則 db.ts 的 server 守衛在 node 測試環境會 throw。
  - vitest 給 inline 空 PostCSS 設定，避開 Tailwind v4 的 `postcss.config.mjs` 在 vite 管線下被判無效 plugin。
- `next.config.ts` 加 `serverExternalPackages: ['better-sqlite3']`：原生模組不可被 server bundler 打包，否則 build 失敗。
- `tsconfig.json` 排除 `scaffoldtmp`、`.next`：避免型別檢查掃進中斷 scaffold 殘留的 2 萬個檔案。

### 資料 backend 退路
`better-sqlite3` 若在部署環境編譯失敗，設環境變數 `DATA_BACKEND=json`，`lib/db.ts` 改直接讀 `data/tutors.json`，對外介面不變、不阻斷部署。

### 已知待辦（環境限制）
- `scaffoldtmp/`（中斷 scaffold 殘留）已在 `.gitignore`、tsconfig 已排除、不進 build 與 commit；本機刪除指令被 careful 守衛擋下，留給 Stan 手動 `Remove-Item -Recurse -Force scaffoldtmp`。

## Wave 1 — 頁面群（四個平行任務）

### Task 3：/tutors 列表 ＋ /tutors/[slug] 個人頁
- 列表頁：Server Component 讀 db、算平均評分後傳 client 篩選器；領域多選、程度、時薪三檔、可接案開關前端過濾；`?domain=` 白名單預選（首頁分類導覽入口）。桌面 3 欄 / 手機 1 欄。
- 個人頁：§4.3 六區塊全做（頭部徽章、AI 側寫卡含 RadarChart、GitHub repo/語言橫條、作品集、評價＋AI 摘要、方案）；預約鈕出 toast。
- 兩頁 `force-dynamic`；只有 page.tsx 碰 db，互動下放 `_components/` client 子元件。

### Task 4：/match 聊天 ＋ /api/chat ＋ Gemini ＋ 罐頭退路
- `lib/canned-match.ts`：純函式關鍵字→領域對照，命中域取 hiddenScore 前 2 名，只回 {slug,reason}。
- `lib/gemini.ts`：`@google/genai`，JSON mode（responseSchema）、system prompt 照 §6、10s timeout、最近 10 則歷史。
- `app/api/chat/route.ts`：同 IP 每分鐘 10 次防刷；有 key 試 Gemini、任何錯誤退 canned 且 `offline:true`；無 key 直接 canned；驗證 slug 存在；回應絕無 hiddenScore。
- `/match`：Server 傳 PublicTutor 給 client 聊天室；`?q=` 自動發問；推薦以內嵌 TutorCard 呈現、offline 標「離線建議」。
- `tests/canned-match.test.ts`：關鍵字路由、slug 存在、輸出無 hiddenScore。

### Task 5：/classroom 教室體驗
- Server Component 讀 `data/classroom.json`，四區塊：上課資訊卡（Meet 連結＋三步驟）、AI 課程摘要（時間軸點擊 tooltip、重點、名詞卡 hover 翻面）、練習題（展開 AI 批改示範）、知識庫問答（罐頭三按鈕，依砍單順序不做真 AI）。
- 翻面/展開純 CSS transform + React state，不引動畫庫。

### Task 6：首頁完整版 ＋ /login
- 首頁 async Server Component：hero 搜尋框導 /match?q=、三亮點卡、精選 4 卡（含 Stan 真人卡）、六領域導覽、名人推薦牆（去重取 3 位認證帳號）、Roadmap 三卡。
- `/login`：完整登入 UI，提交/點擊 → toast → 導回首頁。

### 整合驗證
`npm run seed && npm run build` 全綠（8 路由）、`npm test` 6/6 綠。

## Wave 2 — 整合 QA（Task 7）

實機（dev server, port 3100, 無 GEMINI_API_KEY）走完 SPEC §7 六步敘事線，桌面與手機 390px 各驗一次：
- 首頁 hero 輸入 → `/match?q=` 自動發問 → `POST /api/chat 200`，**無 key 走罐頭退路**：回 2 張內嵌講師卡＋「離線建議」標籤，reply 自然、`offline:true`、回應無 hiddenScore。
- Stan 個人頁：雷達圖 SVG、GitHub repo、真實資料徽章齊；**DOM 掃描確認無 hiddenScore/hidden_score 外洩**。預約試教 → toast 正常。
- `/classroom` 四區塊齊（Meet 連結、8 段時間軸、名詞卡翻面、練習題、罐頭問答）。
- 中/EN 切換：nav、區塊標題、footer 聲明、品牌名全切換，mock 內容顯示「Demo content in Chinese」，不破版。
- `/login` 提交 → toast「Demo 版請以訪客身份繼續探索 🥑」→ 導回首頁。
- RWD：home/tutors/個人頁/match/classroom 在 390px 全部零水平溢出。
- 全程無 console error、無站內 404。

### 修正
- `components/TutorCard.tsx`：星等 aria-label 用 `toFixed(1)`，避免首頁把原始平均分浮點（如 4.6666…）塞進無障礙標籤。
- `app/layout.tsx`：metadata 設 `icons: { icon: '/mascot.svg' }`，消除 `/favicon.ico` 404 console error。

## Wave 3 — 部署（Zeabur）

- 於 Stan 自租的 Tencent Tokyo 2C/2GB dedicated server 建專案 `guacamole-ai` 並 direct deploy。
- 環境變數：`DATA_BACKEND=json`（部署用安全退路，runtime 不載原生模組）、`GEMINI_MODEL=gemini-2.5-flash`。
- 預設網址上線：**https://guacamole-ai.zeabur.app**（TLS 憑證真瀏覽器可信；Windows curl schannel 的 UNTRUSTED_ROOT 為本機憑證庫問題、非真問題）。
- Prod 驗證（真 Chromium）：首頁 console 0 error、`?q=` 自動發問渲染 2 張推薦卡＋「離線建議」、DOM 無 hiddenScore、六頁全 200、`/api/chat` 罐頭路徑正常。
- 自訂網域 `guacamole.stan-shih.com` 已於 Zeabur 綁定（PROVISIONING），待 Stan 於 Cloudflare 加 CNAME → `guacamole-ai.zeabur.app`（DNS only 灰雲）。
- 部署識別碼記於 `CLAUDE.md`。

### 收尾（Codex 吉祥物 + 自訂網域上線）
- 換上 Codex 產的正式吉祥物：`public/mascot.png`（戴眼鏡酪梨騎鼴鼠，1024²、透明底）用於 hero/nav/login；`public/icon.png`（酪梨頭）用於 favicon。hero/nav/login 引用改 `/mascot.png`、favicon 改 `/icon.png`（皆正方形、套原尺寸）。
- **`https://guacamole.stan-shih.com` 已上線**（Stan 完成 Cloudflare CNAME，DNS 解析 → guacamole-ai.zeabur.app → 43.167.169.222，TLS 憑證受信任、HTTP 200）。

## 收尾批次（2026-07-09/10）
- Nav 深色版：Landing（/）的 Nav 改 drench 深綠接續（同 Footer 的 pathname 模式），最後一條淺 bar 壓深底消失。
- 「成為講師」補選角色：學生（含 Google 註冊者，預設學生）可在後臺一鍵升級成講師；jwt 對非 TUTOR 重查 role，升級免重新登入；升級後自動建講師草稿。
- 測試：baseSlug ASCII 回歸（CJK slug 404）、deriveHiddenScore 值域、罐頭退路不變量（syllabus 週數/pricing low≤high/learning-path 領域對得到講師）。12 測綠。
- 維運：guacamole-ai 曾因 Tokyo 2GB 節點記憶體壓力被驅逐一次（非程式 crash）；已暫停 banini-tracker、threads-menu 騰 RAM（english-companion 本來就是空專案）。記憶體 request/limit 無 CLI 介面，如需設定走 Zeabur dashboard。
