# DESIGN.md —— 酪梨醬 AI 家教網（Guacamole AI）

編輯/排版風的設計基礎。這份文件是設計線的單一事實來源，跟 `docs/SPEC-v2.md` §8 對齊。
色板、字體、版型 primitives、動態規則都定案在這裡；要改視覺方向先改這份，再改 code。

寫這份的目標很直接：甩開 2026 的 AI 樣板臉——cream 底、五排一模一樣的圓角卡片、置中 hero 三件式、每段「大標＋一句副標」同一個節奏。

---

## 0. 一句話定位

一個用 AI 評估「教 AI 的人」、也用 AI 幫你媒合的平臺。視覺上要看起來像一個有主張的產品，不是又一頁 SaaS 模板。

方向：**drenched 深墨綠浸染 + 大字 serif 排版 + 吉祥物當真實錨點**。品牌綠是結構色，不是灑在米底上的點綴。

---

## 1. 色板（定案，OKLCH）

### 選 (a) 近黑深綠 drenched，不是 (b) off-white

我選 (a)。理由：

- 品牌一開始就 commit 了酪梨綠（`--avo-dark #2E4A1F`）。impeccable 的 register 規則講明「既有品牌已經認定的顏色，身分保留優先」——所以我把同一個色相往深處拉成一塊近黑深綠當底，而不是另外發明一個新底色。
- 家教／媒合這個類別的反射動作是 cream-SaaS（暖米＋綠）或 navy-trust（深藍講信任）。近黑深綠的 ground 在這個類別裡少見，剛好躲開「看類別就猜得到配色」的第一層與第二層 AI 反射。
- drenched 的份量感也符合這個平臺想給的第一印象：底子是硬的、資料是機器可讀的，不是軟綿綿的補習班傳單。

**分工**：Landing 這種「設計就是產品」的門面走 drenched 深綠浸染；內頁（/tutors、/match、/classroom 這些讀重、表單重的頁）走乾淨近白 ground，深綠只在 nav/footer/版塊/CTA 出現。這樣資料頁不會被大片深色壓得難讀。

### Tokens

token 名稱全部保留（`bg-avo-dark` / `avo-main` / `avo-light` / `avo-cream` / `text-avo-ink` …），只換數值——現有其他頁不會壞。新增的角色另立新 token。

| token | OKLCH | 角色 | 語義變更 |
|---|---|---|---|
| `--color-avo-dark` | `oklch(0.30 0.055 140)` | 果皮深綠：深色版塊、nav 字、footer 底 | 沿用 |
| `--color-avo-main` | `oklch(0.64 0.13 132)` | 果肉綠：主色、CTA、連結、強調 | 沿用 |
| `--color-avo-light` | `oklch(0.88 0.06 128)` | 淺果肉：淺底塊、hover、chip | 沿用 |
| `--color-avo-cream` | `oklch(0.985 0.006 130)` | **內頁乾淨底色（近白）** | **變了**：舊值是暖米頁底 `#F8F6EC`，現在是 chroma 極低、往品牌綠偏一點點的近白 ground。名字留著只為相容，語義已不是「奶油白頁底」 |
| `--color-avo-ink` | `oklch(0.28 0.045 140)` | 內文字色（比舊值再壓深，保 ≥4.5:1） | 沿用（壓深） |
| `--color-avo-seed` | `oklch(0.56 0.085 62)` | 果核棕：徽章、次要強調 | 沿用 |
| `--color-avo-drench` | `oklch(0.22 0.045 145)` | **承諾色**：Landing / footer / 深色浸染區塊的底 | 新增 |
| `--color-avo-paper` | `oklch(0.95 0.012 120)` | 深底上的主字（暖白，不刺眼） | 新增 |

### 對比

- 近白 ground（cream 0.985）上放 ink（0.28）：對比遠超 4.5:1，內文安全。
- 深綠 drench（0.22）上放 paper（0.95）：亮對暗，body 安全；淡化字最低守在 `paper/70`（≈ 0.66 L）確保仍過關，不用更淡的「為了優雅」灰。
- main（0.64）當連結色在深底上夠亮；當 CTA 填色時上面壓 `avo-dark`（深綠字）而不是白字，對比更紮實也更有品牌味。

---

## 2. 字體（對比軸配對）

三支，走「serif × sans × mono」的對比軸，不是兩支長很像的 sans 硬湊。

| 角色 | 字體 | 用途 |
|---|---|---|
| display / 大標 | **Noto Serif TC** | hero 標題、門的 label。給編輯感、撐得起大字，支援中文 |
| body / UI | **Noto Sans TC** | 內文、按鈕、導覽，全站 workhorse |
| 數字 / 代碼 | **JetBrains Mono** | 時薪、評分、GitHub 統計、kicker 小字 |

由 next/font 在 `app/layout.tsx` 載入，掛成 CSS 變數（`--font-noto-serif-tc` 等），`globals.css` 的 `--font-serif/sans/mono` 接線。

### 一個誠實的取捨：為什麼還是 serif

impeccable 的 register 把「display serif + 小 mono 標籤 + 分隔線 + 單色克制」整包列為現在已經氾濫的 editorial-typographic lane（Fraunces/Recoleta 斜體大標那種指紋）。我沒有照抄那個指紋：

- 標題用 **upright serif（不斜體）**，不是 Fraunces 那種招牌斜體大標。
- **不放** tracked-uppercase 的小標 eyebrow 在每個段落上面。
- 吉祥物是**真實圖像**，不是純文字排版頁（純文字排版正是那個 lane 的失敗樣態）。
- Noto Serif TC 是為了中文標題撐場，本來就跟拉丁 editorial 指紋不同路。

所以 serif 用在這裡是為了中文大標的份量與識別，不是去 cosplay 雜誌封面。

### 尺度

- 大標用 `clamp()`，hero 上限 `5.25rem`（≈84px，守在 impeccable 的 96px 天花板內）。
- 字距 floor：display `-0.03em`（守在 `-0.04em` 內，不讓字黏在一起）。
- 標題掛 `text-wrap: balance`（`.avo-display`），長內文掛 `text-wrap: pretty`（`.avo-prose`），內文寬度 cap 在 68ch。
- 深底上的字行高多給一點（淡色字視覺上更細，需要呼吸）。

---

## 3. 版型 primitives

放在 `globals.css`，用 class 掛，取代到處 new 一個卡片盒。

- `.avo-drenched` —— 深綠浸染區塊（背景 drench + 字 paper）。Landing、footer 直接掛。
- `.avo-rule` / `.avo-rule-on-dark` —— 一條細分隔線。用線跟留白分段，不是每段都塞進一個 border 卡片。
- `.avo-display` —— serif、緊排、balance 換行的大標樣式。
- `.avo-prose` —— pretty 換行、68ch 上限的長內文。
- 語義 z-index：`--z-sticky: 30` / `--z-nav: 50` / `--z-toast: 60`，不寫 999。

版面原則：

- **非對稱**。Landing hero 是 `1.35fr / 1fr` 兩欄，大字在左、吉祥物錨在右下，不置中三件式。
- **份量不等**。兩道門一個填色大份量（找講師，多數訪客走這邊）、一個描邊輕份量（我是講師），刻意打破「兩張一樣的卡片」反射。
- **留白有節奏**。版塊之間用 `clamp()` 拉開，緊的地方緊、鬆的地方鬆，不是每段等距。
- cards 是懶人解，只在真的是最好的載體時才用（講師卡是，因為它就是一個可點的實體）。Landing 一張卡片盒都不放。

---

## 4. 動態（克制）

- 時長 150–250ms（`--dur-fast 150ms` / `--dur-base 220ms`），曲線 ease-out（`--ease-out-quart`），不 bounce、不 elastic。
- Landing 進場：一次性的 staggered 淡入上移（`.avo-enter` + 每個子元素錯開 `animation-delay`），不是每段都 fade-on-scroll。門的 hover 只做 `-translate-y-1` 跟箭頭位移，很輕。
- **`prefers-reduced-motion: reduce` 是必備**：關掉位移跟 smooth scroll，`.avo-enter` 退化成純淡入，全域把 animation/transition 時長壓到 0.01ms。已寫在 `globals.css`。
- reveal 動畫只加在「本來就看得見」的內容上——不靠 class 才顯示內容（headless render 或背景分頁不會觸發，會 ship 空白）。

---

## 5. 怎麼避開 AI slop（專案守則）

動手前對一遍這張清單，中了就重寫那個元素：

- **不要 cream body。** ground 是近白（chroma 極低），Landing 是深綠浸染。暖米頁底＝2026 AI 預設臉，禁。
- **不要五排一模一樣的圓角卡片。** 用線、版塊、份量差、非對稱來分段。同一頁不要出現一整排 icon + 標題 + 一句話的等大卡片。
- **不要每段一個 tracked-uppercase eyebrow**，也不要 `01 / 02 / 03` 當每段的裝飾編號。門上的小標是有意義的角色字（想學／想教），不是流水號 scaffold。
- **不要 side-stripe border**（>1px 的單邊色條當強調）。要框就整框，或用背景色塊，或什麼都不要。
- **不要漸層文字**（`background-clip: text` + 漸層）。強調靠字重跟字級。
- **不要玻璃擬態當預設**、不要 hero-metric 大數字樣板。
- **不要假名跟太整齊的數字**（Jane Doe、99.99%、10x）。mock 內容用具體、參差的值。
- **不要文字溢出容器。** 大標配大 clamp 配窄格會在平板/手機爆版——每個斷點都要試標題文案，尤其 390px。
- **不要 editorial 雜誌指紋**（斜體 Fraunces 大標 + drop cap + broadsheet 三欄）。serif 是為了中文標題份量，不是去演雜誌封面。
- 站名/slogan **只從 `lib/brand`**，任何頁面不寫死。雙語走 `lib/i18n` 的 `t({zh,en})`。
- RWD 到 390px 不破版；深底上淡化字最低守 `paper/70`，不為了優雅用更淡的灰。

---

## 6. 檔案地圖（設計線範圍）

- `app/globals.css` —— tokens、字體接線、版型 primitives、動態、reduced-motion。
- `app/layout.tsx` —— 三支字體載入、body ground、`SessionProvider slot` 註解（後端線之後掛 next-auth）。
- `app/page.tsx` + `app/_landing/Landing.tsx` —— Landing 分流頁（品牌 hero + 兩道門）。
- `app/landing-strings.ts` —— Landing 雙語字串。
- `app/discover/` —— 原首頁原樣搬來（`page.tsx` + `_home/`），之後設計線再重設計成精簡學生首頁。
- 共用 chrome（Nav/Footer/TutorCard/Badge）沿用，token 換值後對比仍成立，未改結構。
