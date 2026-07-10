# DESIGN.md —— 酪梨醬 AI 家教網（Guacamole AI）

編輯/排版風的設計基礎。這份文件是設計線的單一事實來源，跟 `docs/SPEC-v2.md` §8 對齊。
色板、字體、版型 primitives、動態規則都定案在這裡；要改視覺方向先改這份，再改 code。

寫這份的目標很直接：甩開 2026 的 AI 樣板臉——cream 底、五排一模一樣的圓角卡片、置中 hero 三件式、每段「大標＋一句副標」同一個節奏；也甩開「整頁浸染酪梨綠」的單薄感。

---

## 0. 一句話定位

一個用 AI 評估「教 AI 的人」、也用 AI 幫你媒合的平臺。視覺上要看起來像一個有主張的產品，不是又一頁 SaaS 模板。

方向：**深中性／深橄欖灰門面 + 酪梨綠當強調 + 果核棕第二強調 + 大字 serif + 吉祥物當真實錨點（只在 Landing）**。綠是 CTA／連結／active，不是結構浸染色。

---

## 1. 色板（定案，OKLCH）

### 綠是強調，不是浸染

- 品牌 commit 了酪梨綠（`--avo-main`）。身分保留：綠出現在主按鈕、連結、吉祥物相關強調、active 態。
- Landing／footer 深底改成**深中性橄欖灰**（`--avo-drench`），chroma 壓低，避免整頁「太綠」。
- 內頁 ground（`--avo-cream`）再中性一點；綠只給主按鈕與 active。
- 第二強調 `--avo-seed`（果核棕）：價格、徽章、次要 CTA。
- 可加極淡紙感噪點（`.avo-drenched::before`），不要玻璃擬態、不要紫漸層。

**分工**：Landing 走深中性門面；內頁（/tutors、/match、/classroom）走近白 ground。訪客主線只有一條：`/` → 媒合／瀏覽講師；`/discover` redirect 到 `/`。

### Tokens

token 名稱全部保留，只換數值。

| token | OKLCH | 角色 |
|---|---|---|
| `--color-avo-dark` | `oklch(0.32 0.035 140)` | 深橄欖灰：深色版塊字、nav 字 |
| `--color-avo-main` | `oklch(0.64 0.13 132)` | 果肉綠：主 CTA、連結、active |
| `--color-avo-light` | `oklch(0.90 0.04 128)` | 極淺果肉：hover、chip |
| `--color-avo-cream` | `oklch(0.985 0.003 100)` | 內頁近中性白 ground |
| `--color-avo-ink` | `oklch(0.28 0.025 140)` | 內文字色（≥4.5:1） |
| `--color-avo-seed` | `oklch(0.56 0.085 62)` | 果核棕：價格、徽章、次要 CTA |
| `--color-avo-drench` | `oklch(0.23 0.018 130)` | Landing／footer 深中性底 |
| `--color-avo-paper` | `oklch(0.95 0.008 95)` | 深底上的主字（暖紙白） |

### 對比

- cream 上放 ink：內文安全。
- drench 上放 paper：body 安全；淡化字最低 `paper/70`。
- main 當 CTA 填色時上面壓 `avo-dark`（深綠字）而不是白字。
- seed 用在價格／徽章，與綠分工，避免全站只有一種強調色。

---

## 2. 字體（對比軸配對）

三支，走「serif × sans × mono」的對比軸。

| 角色 | 字體 | 用途 |
|---|---|---|
| display / 大標 | **Noto Serif TC** | hero 標題。給編輯感、撐得起大字，支援中文 |
| body / UI | **Noto Sans TC** | 內文、按鈕、導覽 |
| 數字 / 代碼 | **JetBrains Mono** | 時薪、評分、GitHub 統計、kicker 小字 |

由 next/font 在 `app/layout.tsx` 載入。標題用 upright serif（不斜體）；不放 tracked-uppercase eyebrow 在每個段落上面。吉祥物是真實圖像，Nav 小 logo OK，**不要每頁 hero 都放大吉祥物**——Landing 留一個即可。

### 尺度

- 大標用 `clamp()`，hero 上限 `5.25rem`。
- 字距 floor：display `-0.03em`。
- `.avo-display` / `.avo-prose`；深底上行高多給一點。

---

## 3. 版型 primitives

- `.avo-drenched` —— 深中性底 + 極淡噪點 + 字 paper。
- `.avo-rule` / `.avo-rule-on-dark` —— 細分隔線。
- `.avo-display` / `.avo-prose` / `.avo-panel` / `.avo-kicker`。
- 語義 z-index：`--z-sticky` / `--z-nav` / `--z-toast`。

版面原則：

- **一條學生主線**。`/` 價值主張 + 主 CTA「開始媒合」+ 次 CTA「瀏覽講師」；講師入口收成次要。Nav＝找講師｜AI 媒合（教室體驗不進頂欄）。
- **非對稱** Landing hero：大字在左、吉祥物在右下。
- **份量不等**。主 CTA 填色、次 CTA 描邊；不要兩張一樣的門。
- cards 只在真的是最好的載體時才用（講師卡是可點實體）。Landing 不堆卡片格。

---

## 4. 動態（克制）

- 時長 150–250ms，ease-out，不 bounce。
- Landing 進場：staggered 淡入上移；`prefers-reduced-motion: reduce` 必備。
- reveal 只加在本來就看得見的內容上。

---

## 5. 怎麼避開 AI slop（專案守則）

- **不要整頁浸染綠。** 深底是中性橄欖灰；綠只當強調。
- **不要 cream／暖米 body。** ground 近中性白。
- **不要雙首頁。** `/` 與 `/discover` 合併；discover redirect。
- **不要五排一模一樣的圓角卡片**、不要每段 tracked eyebrow、不要 side-stripe、不要漸層文字、不要玻璃擬態。
- **不要把已上線功能標成「即將推出」。** 誠實區只留真的未做（例如影片自介）。
- 站名/slogan **只從 `lib/brand`**。雙語走 `t({zh,en})`。
- RWD 到 390px；深底淡化字最低 `paper/70`。
- `hiddenScore` 絕不進 client。

---

## 6. 檔案地圖（設計線範圍）

- `app/globals.css` —— tokens、primitives、噪點、reduced-motion。
- `app/layout.tsx` —— 字體載入、body ground。
- `app/page.tsx` + `app/_landing/Landing.tsx` —— 唯一訪客首頁。
- `app/landing-strings.ts` —— Landing 雙語字串。
- `app/discover/page.tsx` —— redirect → `/`。
- 共用 chrome：`Nav` / `Footer` / `TutorCard` / `Badge`；Nav 學生主線＝找講師｜AI 媒合。
