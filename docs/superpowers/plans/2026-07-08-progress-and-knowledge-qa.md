# Progress Dashboard + Knowledge Q&A Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a demo-data learning progress dashboard at `/progress`, and upgrade the classroom knowledge Q&A from three canned buttons to a real Gemini-backed Q&A grounded in the current session's summary, with the canned questions kept as shortcuts and offline fallback.

**Architecture:** Two independent features. (1) `/progress` is a pure client page rendering hardcoded demo data in the editorial style, no DB. (2) Knowledge Q&A adds a new `lib/gemini-knowledge.ts` (same `@google/genai` pattern as `lib/gemini-features.ts`), a new `POST /api/classroom-qa` route (mirrors `app/api/learning-path/route.ts`: force-dynamic, per-IP 10/min limit, canned fallback, `offline` flag), and rewrites `KnowledgeQA.tsx` into an input-driven client component; `page.tsx` builds a `courseContext` string server-side and passes it as a prop.

**Tech Stack:** Next.js 15 App Router, TS, Tailwind v4 (`avo-*` tokens), `@google/genai`, `lib/i18n` `t()`.

## Global Constraints

- `hiddenScore` never touched (not in this scope's data anyway).
- Bilingual via `lib/i18n` `t({zh,en})`; natural Traditional Chinese, no AI tone; English strings too.
- Only `avo-*` tokens; RWD unbroken at 390px.
- No key / any failure -> canned path; UI never blank.
- Station name only from `lib/brand`.
- Route: `export const dynamic = 'force-dynamic'`, per-IP 10/min rate limit, canned fallback + `offline` flag (copy `app/api/learning-path/route.ts`).
- Gemini call: `GoogleGenAI`, `ai.models.generateContent`, `responseMimeType:'application/json'` + `responseSchema` + `Type`, `response.text`, 10s abortSignal, model from `GEMINI_MODEL` default `gemini-2.5-flash`, key from `GEMINI_API_KEY` else throw. New file `lib/gemini-knowledge.ts`; do NOT edit `lib/gemini.ts`.
- File boundary — only touch: `app/progress/**`, `app/api/classroom-qa/route.ts` (new), `lib/gemini-knowledge.ts` (new), `app/classroom/_components/KnowledgeQA.tsx`, `app/classroom/page.tsx` (only add courseContext prop). Do NOT touch other classroom components, roadmap, Nav, layout, globals.css, gemini.ts, db.ts, prisma.
- No build/dev run (parallel agents). Self-check `npx tsc --noEmit`. No commit.

---

## Feature 1: `/progress` dashboard

### Task 1: Progress strings + demo data + page

**Files:**
- Create: `app/progress/strings.ts` — bilingual UI strings.
- Create: `app/progress/_components/Dashboard.tsx` — client component, demo data + render.
- Create: `app/progress/page.tsx` — server shell, metadata, mount Dashboard.

**Interfaces:**
- Produces: `<ProgressDashboard />` default export (client); `page.tsx` renders it inside `mx-auto max-w-4xl px-5 py-12 sm:py-16`.

Demo data (one student):
- 3 enrolled courses each with progress %, sessions done/total: LoRA 微調實戰 (3/6, 50%), LLM 應用開發入門 (5/8, 62%), 用 RAG 打造問答系統 (1/5, 20%).
- Cumulative hours: `18.5`. Streak days: `12`. Mastered topics: `9`.
- Next-step suggestion referencing the in-progress course.
- All mono numbers, editorial layout (not a card wall): a stat row (mono figures + labels separated by rules), then a course-progress list with thin progress bars, then a next-step block. Prominent "示意資料 / Demo data" tag.

**Steps:**
- [ ] Step 1: Write `app/progress/strings.ts` with `s` object of `{zh,en}` entries (kicker, title, subtitle, demoTag, statHours, statStreak, statMastered, streakUnit, coursesHeading, sessionsLabel, nextHeading, nextBody, browseLink) and a `DEMO` object holding courses array + numbers (numbers language-neutral, course titles bilingual).
- [ ] Step 2: Write `app/progress/_components/Dashboard.tsx` (`'use client'`, `useLang`), render stat row / course list with `avo-*` progress bars / next-step block, demo tag.
- [ ] Step 3: Write `app/progress/page.tsx` (server, `metadata`, `dynamic='force-dynamic'` optional — page is static demo so omit; just render Dashboard in the standard wrapper).
- [ ] Step 4: `npx tsc --noEmit` (whole-project, read only my new files' errors).

---

## Feature 2: Knowledge Q&A -> real AI

### Task 2: `lib/gemini-knowledge.ts`

**Files:**
- Create: `lib/gemini-knowledge.ts`

**Interfaces:**
- Produces:
  - `export async function geminiClassroomQA(question: string, courseContext: string, lang: Lang): Promise<string>` — grounded answer; throws on no key / empty / error.
  - `export function cannedClassroomAnswer(question: string, presets: {question:string; questionEn?:string; answer:string; answerEn?:string}[], lang: Lang): string` — pure fallback: best preset match by simple contains, else first preset's answer.
- Consumes: `Lang` from `@/lib/i18n`.

Pattern: copy the `client()`, timeout, schema, parse shape from `gemini-features.ts`. Schema `{ answer: string }`. System prompt (bilingual) instructs: answer ONLY from provided course context; if outside scope say the "本課沒提到 / not covered in this class" line; concise, natural, no AI tone; reply in the requested language. User message carries `courseContext` + `question`.

**Steps:**
- [ ] Step 1: Write the file: imports, `TIMEOUT_MS`, `client()`, `ANSWER_SCHEMA`, `qaSystemPrompt(lang)`, `parseAnswer`, `geminiClassroomQA`, `cannedClassroomAnswer`.
- [ ] Step 2: `npx tsc --noEmit`.

### Task 3: `POST /api/classroom-qa`

**Files:**
- Create: `app/api/classroom-qa/route.ts`

**Interfaces:**
- Consumes: `geminiClassroomQA`, `cannedClassroomAnswer` from `@/lib/gemini-knowledge`; `classroom` json for building context + presets.
- Produces: `POST { question, courseContext, lang } -> { answer, offline? }`.

Mirror `learning-path/route.ts`: force-dynamic, rate limit map, `clientIp`, `parseBody` (question trim slice 500; courseContext trim slice ~4000; lang zh/en). If `question && courseContext && GEMINI_API_KEY` -> try gemini else canned+offline; else canned+offline. Canned uses presets read from `data/classroom.json`.

**Steps:**
- [ ] Step 1: Write route.
- [ ] Step 2: `npx tsc --noEmit`.

### Task 4: Rewrite `KnowledgeQA.tsx` + wire `page.tsx`

**Files:**
- Modify: `app/classroom/_components/KnowledgeQA.tsx`
- Modify: `app/classroom/page.tsx` (build `courseContext`, pass prop)

**Interfaces:**
- `KnowledgeQA` new props: `{ knowledgeQA: KnowledgeQAData; courseContext: string }`.

Behavior: text input + submit -> `POST /api/classroom-qa` with `{question, courseContext, lang}`; loading state; render answer in existing `avo-panel` bubble; show `offline` tag when fallback. Keep 3 preset buttons as quick-fill shortcuts (click fills input and submits). Keep existing strings; add a few new ones inline in `strings.ts`? NO — strings.ts is out of my allowed edit set for classroom? Check: boundary allows `KnowledgeQA.tsx` and `page.tsx` only among classroom files. So new UI strings must live inside `KnowledgeQA.tsx` as local bilingual literals via `t({zh,en})`, NOT in `strings.ts`. Reuse existing `CR.qa*` where possible.

**Steps:**
- [ ] Step 1: Rewrite `KnowledgeQA.tsx`: input + submit + presets-as-shortcuts + fetch + loading + offline tag + canned fallback on fetch error. Local `t({zh,en})` for new labels (ask placeholder, send, thinking, offline note). Reuse `CR.qaAnswerLabel`.
- [ ] Step 2: Modify `page.tsx`: build `courseContext` string from `course` (title/session) + `aiSummary.timeline` (time+title) + `keyPoints` + `termCards`, pass as prop. Language-neutral context (feed both — actually build in the page from the zh fields primarily; include En titles too so model can answer either language). Keep it a plain server-built string.
- [ ] Step 3: `npx tsc --noEmit` (my scope clean).

---

## Self-Review

- Spec coverage: F1 dashboard (progress bars, hours, streak, mastered, next-step, demo tag, 390px, editorial) -> Task 1. F2 real Q&A (input->route->gemini-knowledge, context from course summary, out-of-scope line, presets kept as shortcut + fallback, page passes courseContext) -> Tasks 2-4. All covered.
- Placeholder scan: strings inline where boundary forbids strings.ts edits. OK.
- Type consistency: `geminiClassroomQA(question, courseContext, lang)` and `cannedClassroomAnswer(question, presets, lang)` used identically in route. `KnowledgeQA` prop `courseContext:string` matches page. OK.
