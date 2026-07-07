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
