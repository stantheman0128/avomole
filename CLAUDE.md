# avomole（酪梨醬 AI 家教網 / Guacamole AI）

黑客松 demo。需求唯一來源＝`SPEC.md`；實作計畫在 `docs/superpowers/plans/`。

## 技術
Next.js 15 App Router + TS + Tailwind v4 + better-sqlite3（可退 `DATA_BACKEND=json`）+ `@google/genai`。
資料只經 `lib/db.ts`；`hiddenScore` 絕不進 client/props/API response（一律 `toPublic()`，測試把關）。

## 常用指令
- `npm run seed`：`data/tutors.json` → `data/avomole.db`（db 檔隨 repo 提交）
- `npm run build` / `npm start` / `npm test`
- 本機預覽：Projects 層 `.claude/launch.json` 的 `avomole-dev`（port 3100）

## Zeabur 部署
- Project ID: `6a4d0b44721fddff77e8513b`（名稱 guacamole-ai，Tencent Tokyo 2C/2GB 自租伺服器）
- Service ID: `6a4d0b69c2881a93656dfaa3`
- Environment ID: `6a4d0b44104975fcb4675b3d`
- 預設網址: https://guacamole-ai.zeabur.app
- 自訂網址: guacamole.stan-shih.com（Cloudflare CNAME → guacamole-ai.zeabur.app，DNS only 灰雲）
- **重新部署**（更新同一服務、勿建重複）：
  `npx zeabur@latest deploy --project-id 6a4d0b44721fddff77e8513b --service-id 6a4d0b69c2881a93656dfaa3 --json`
- 環境變數：`DATA_BACKEND=json`（部署用安全退路，免原生模組風險）、`GEMINI_MODEL=gemini-2.5-flash`；
  `GEMINI_API_KEY` 未設時全站自動走罐頭退路（`/api/chat` offline）。設 key 後即啟用真 Gemini。
