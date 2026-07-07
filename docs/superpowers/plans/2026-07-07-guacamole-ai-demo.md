# Guacamole AI（酪梨醬 AI 家教網）Demo 實作計畫

> **For agentic workers:** 本計畫配合 orchestrator 以平行 subagent 執行（superpowers:dispatching-parallel-agents 模式）。每個 agent 只負責自己的 Task，**完整需求一律以 `SPEC.md` 為準**——先讀完 SPEC.md 再動工。
> **格式偏離聲明**：因 23:59 截止且執行者為 Opus 級 agent，本計畫不含逐步 TDD 程式碼，改鎖「檔案邊界＋介面契約＋驗證」。邏輯層（db、罐頭媒合）仍要求單元測試。

**Goal:** 今晚上線 SPEC.md 所述的黑客松 demo 網站（Zeabur + guacamole.stan-shih.com）。

**Architecture:** Next.js 15 App Router 單 repo；SQLite（可退 JSON）資料層；一支 server route 代理 Gemini；四個頁面群平行開發，靠本文件的介面契約對齊。

**Tech Stack:** Next.js 15 + TypeScript + Tailwind CSS + better-sqlite3 + @google/genai。

## Global Constraints（每個 Task 隱含遵守）

- 需求唯一來源＝`SPEC.md`（v1.1）。衝突時 SPEC 優先，本計畫只補「怎麼分工」。
- 品牌字串只從 `lib/brand.ts` 取；頁面字串放各頁 `strings.ts`；共用 chrome 字串只有 Task 1 可寫 `lib/chrome-strings.ts`。
- `hidden_score`／`hiddenScore` 不得出現在任何 client component、props 或 API response。
- 色彩／字體 tokens 依 SPEC §2；全頁面含 Footer 示意聲明；RWD 到 390px。
- **平行紀律**：只碰自己 Task 列出的檔案；除 Task 1 外一律**不執行 git commit**（orchestrator 統一 commit）；不升級/更換依賴。
- 完成時回報：做了什麼、驗證結果（實際指令輸出）、已知未竟事項。

## 介面契約（全 Task 共識，Task 1 負責落地）

```ts
// lib/types.ts —— 逐字使用，欄位名不得改
export type Level = 'beginner' | 'intermediate' | 'advanced';
export interface Repo { name: string; desc: string; stars: number; lang: string; }
export interface Tutor {
  id: number; slug: string; name: string; nameEn: string;
  title: string; avatar: string; bio: string; hourlyRate: number;
  domains: string[]; skills: string[]; teachLevels: Level[];
  acceptsProjects: boolean; isReal: boolean; hiddenScore: number;
  aiProfile: {
    radar: { llm: number; cv: number; mlBasics: number; engineering: number; teaching: number; influence: number };
    summary: string; difficulty: number; reviewDigest: string;
  };
  github: { username: string; repos: Repo[]; langDist: Record<string, number>; activityNote: string };
  portfolio: { title: string; desc: string; link: string }[];
  plans: { name: string; price: number; desc: string }[];
}
export interface Review { id: number; tutorId: number; author: string; rating: number; text: string; }
export interface Endorsement { id: number; tutorId: number; endorserName: string; endorserTitle: string; quote: string; }
```

```ts
// lib/db.ts —— server-only。SQLite 讀 data/avomole.db；env DATA_BACKEND=json 時直接讀 data/tutors.json
export function getTutors(): Tutor[];                 // 不含 hiddenScore？含。但只准 server 端用
export function getTutorBySlug(slug: string): Tutor | null;
export function getReviews(tutorId: number): Review[];
export function getEndorsements(tutorId: number): Endorsement[];
export function toPublic(t: Tutor): Omit<Tutor, 'hiddenScore'>;  // 傳給 client 前必經
```

```ts
// data/tutors.json 形狀（Task 2 產出、seed 與 json-backend 共用）
{ "tutors": Tutor[], "reviews": Review[], "endorsements": Endorsement[] }
```

```ts
// lib/i18n.tsx
export type Lang = 'zh' | 'en';
export function LangProvider(props: { children: React.ReactNode }): JSX.Element; // layout 已包好
export function useLang(): { lang: Lang; setLang: (l: Lang) => void; t: (s: { zh: string; en: string }) => string };
// lib/brand.ts
export const BRAND = { zh: '酪梨醬 AI 家教網', en: 'Guacamole AI', sloganZh: '學 AI，找酪梨醬。', sloganEn: 'Dip into AI.' };
```

```ts
// components/（Task 1 產出，含最小樣式即可，頁面 Task 可加變體 props）
<TutorCard tutor={PublicTutor} />          // 列表/首頁/推薦卡共用
<Badge kind="endorsed" | "real" | "projects" />
<RadarChart radar={Tutor['aiProfile']['radar']} size={number} />   // 純 SVG
<LevelChips levels={Level[]} />
showToast(msg: string): void               // lib/toast.tsx，Provider 已掛在 layout
```

```
POST /api/chat
body: { messages: { role: 'user' | 'assistant', content: string }[] }
200:  { reply: string, recommendations: { slug: string, reason: string }[], offline?: boolean }
429:  { error: 'rate_limited' }
```

## Wave 0（平行 2 agents）

### Task 1: Scaffold ＋ 核心基礎（唯一可 commit 的 agent）

**Files（Create）:** Next.js 專案骨架（`package.json`、`app/layout.tsx`、`app/page.tsx` 僅 hero 佔位）、`lib/{types,brand,db,i18n,toast,chrome-strings}.ts(x)`、`components/{Nav,Footer,TutorCard,Badge,RadarChart,LevelChips}.tsx`、`scripts/seed.ts`、`tests/db.test.ts`、`tailwind` 主題 tokens、`data/tutors.sample.json`（2 筆假資料，僅供開發期；不得建立 `data/tutors.json`）、`.gitignore`、`CHANGELOG.md`。
**Interfaces:** 落地上方全部契約。Produces＝其餘所有 Task 的地基。
**要點:** `create-next-app` 非互動 flags；better-sqlite3 失敗即實作 json backend 並在回報註明；seed：`data/tutors.json` 不存在時 fallback 讀 sample；db 單元測試（vitest 或 node:test）覆蓋兩種 backend 的 `getTutorBySlug`／`toPublic` 去除 hiddenScore。
**Verify:** `npm run build` 過、`npm test` 綠、`npm run seed` 產出 db 檔。
**Commit:** 分 2-3 個語意 commit（scaffold / core libs / components）。

### Task 2: 內容與資產（不寫程式、不 commit）

**Files（Create）:** `data/tutors.json`（9 位講師完整資料，欄位嚴格照契約）、`data/classroom.json`（SPEC §4.5 那堂「LoRA 微調實戰」的全部 mock 內容：章節時間軸、重點、名詞卡、3 題練習＋AI 批改示範文本）、`public/mascot.svg`（戴眼鏡酪梨騎鼴鼠，手繪風、扁平色塊，用 SPEC 色板）、`public/avatars/t1.svg`～`t9.svg`（幾何頭像，各不同配色）。
**Interfaces:** Consumes＝契約中 `data/tutors.json` 形狀。Produces＝全站內容。
**要點:** 內容要求全在 SPEC §5（8 虛構＋Stan 真卡）。Stan 的 GitHub 用 WebFetch 抓 `https://github.com/stantheman0128?tab=repositories` 取**真實公開 repo**（名稱/描述/星數/語言如實；抓不到就只放確知的公開 repo 並註明）。文案全繁中、自然口語、不要 AI 腔（避免「不僅…更是…」、排比三連）。`hiddenScore` 60–95 打散且與雷達大致一致。
**Verify:** 自行用 node 腳本或人工核對 JSON parse 通過、欄位齊全、slug 唯一。

## Wave 1（Wave 0 完成後，平行 4 agents，均不 commit）

### Task 3: `/tutors` 列表 ＋ `/tutors/[slug]` 個人頁
**Files:** `app/tutors/page.tsx`、`app/tutors/[slug]/page.tsx`、`app/tutors/strings.ts`、頁面私有元件放 `app/tutors/_components/`。
**Interfaces:** Consumes db.ts＋共用元件；個人頁含 SPEC §4.3 全部六區塊（側寫卡用 `RadarChart`）。Server component 取數後以 `toPublic()` 傳 client。
**Verify:** 9 位講師頁面全可開、篩選運作、預約鈕出 toast。

### Task 4: `/match` 聊天 ＋ `/api/chat` ＋ Gemini
**Files:** `app/match/page.tsx`、`app/match/strings.ts`、`app/api/chat/route.ts`、`lib/gemini.ts`、`lib/canned-match.ts`、`tests/canned-match.test.ts`。
**Interfaces:** API 契約如上；`cannedMatch(text: string, tutors: Tutor[]): { reply: string; recommendations: { slug: string; reason: string }[] }`（關鍵字→domains 對照表；命中域取 hiddenScore 前 2 名）。Gemini 規格照 SPEC §6（JSON mode、10s timeout、每 IP 每分鐘 10 次）。
**Verify:** 無 `GEMINI_API_KEY` 時全流程走罐頭且 UI 標「離線建議」；`npm test` 綠；`?q=` 自動發問。

### Task 5: `/classroom` 教室體驗頁
**Files:** `app/classroom/page.tsx`、`app/classroom/strings.ts`、`app/api/classroom-qa/route.ts`（P1，時間不夠改 3 個罐頭問答鈕）、私有元件 `app/classroom/_components/`。
**Interfaces:** 內容全部讀 `data/classroom.json`（經 server component）；名詞卡 hover 翻面；時間軸點擊出 tooltip「Demo：錄影檔未附」。
**Verify:** SPEC §4.5 四區塊齊、翻面與 tooltip 動作正常。

### Task 6: `/` 首頁完整版 ＋ `/login`
**Files:** `app/page.tsx`（覆寫 Task 1 佔位）、`app/home-strings.ts`、`app/login/page.tsx`、`app/login/strings.ts`。
**Interfaces:** 首頁八區塊照 SPEC §4.1（hero 搜尋框導 `/match?q=`；精選 4 卡含 Stan；名人牆讀 endorsements；Roadmap 三卡）。登入頁照 §4.6（提交→toast→導回）。
**Verify:** 首頁在 390px 與桌面皆不破版、所有連結有效。

## Wave 2（整合驗收，1 agent）

### Task 7: 整合 QA ＋ 修復
**Files:** 允許修任何檔案（修 bug 目的）。
**步驟:** `npm run seed && npm run build && npm start` → 用 Playwright 走 SPEC §7 六步敘事線（桌面＋390px）→ 核對 §8 checklist 逐項 → console error／404／中英切換全查 → 逐項修復 → 回報每項證據（截圖或輸出）。
**Verify:** §8 checklist 全勾（除 Zeabur 部署與真 key 測試留給 orchestrator）。

## Wave 3（orchestrator 本人）

Code review 抽查 → 統一 commit/CHANGELOG 收尾 → Zeabur 部署（env `GEMINI_API_KEY`）→ 綁 `guacamole.stan-shih.com`（Cloudflare CNAME）→ 真 key 實測 `/api/chat` ＋ 拔 key 罐頭演練 → 交付 Stan。

## Self-Review 紀錄

- Spec 覆蓋：§4.1-4.7（4.7 P2 不排）、§5（T2）、§6（T4）、§7-8（T7）、§10（Wave 3）✓
- 型別一致：全部 Task 引用同一份契約區塊 ✓
- 佔位語掃描：無 TBD；T5 的 P1 降級路徑已寫明 ✓
