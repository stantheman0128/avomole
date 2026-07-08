'use client';
// 課堂知識庫問答（真 AI 版）。使用者輸入問題 → POST /api/classroom-qa → 以本堂摘要為 context 回答。
// 三個預設問題保留為快捷鈕（點了填入並直接送出），也是無 key／失敗時的罐頭退路（route 回 offline）。
// 新介面文案就地寫成 t({zh,en})——classroom/strings.ts 不在本次可改範圍，故不新增到那裡。
import { useState, useCallback } from 'react';
import { useLang } from '@/lib/i18n';
import { CR } from '../strings';

type Preset = { question: string; questionEn?: string; answer: string; answerEn?: string };
export type KnowledgeQAData = { note?: string; noteEn?: string; presets: Preset[] };

interface QaResponse {
  answer?: string;
  offline?: boolean;
  error?: string;
}

const UI = {
  placeholder: {
    zh: '問問這堂課的內容，例如：學習率該怎麼設？',
    en: 'Ask about this class, e.g. how should I set the learning rate?',
  },
  send: { zh: '問酪梨', en: 'Ask' },
  thinking: { zh: '酪梨想想…', en: 'Thinking…' },
  shortcutsLabel: { zh: '或點一個常見問題', en: 'Or tap a common question' },
  offlineTag: { zh: '離線範例', en: 'Offline sample' },
  offlineNote: {
    zh: '目前用的是預設問答。接上 AI 之後，會即時以本堂摘要為依據回答你的提問。',
    en: 'Showing preset answers. With AI connected, questions are answered live from this session recap.',
  },
  errorNote: {
    zh: '問答時出了點狀況，先給你一則相近的預設回答，可以再試一次。',
    en: 'Something went wrong, so here is a close preset answer. Feel free to try again.',
  },
} as const;

export function KnowledgeQA({
  knowledgeQA,
  courseContext,
}: {
  knowledgeQA: KnowledgeQAData;
  courseContext: string;
}) {
  const { lang, t } = useLang();
  const en = lang === 'en';
  const { presets } = knowledgeQA;

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [errored, setErrored] = useState(false);
  const [loading, setLoading] = useState(false);

  const ask = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;
      setLoading(true);
      setErrored(false);

      try {
        const res = await fetch('/api/classroom-qa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: trimmed, courseContext, lang }),
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = (await res.json()) as QaResponse;
        setAnswer(data.answer ?? '');
        setOffline(Boolean(data.offline));
      } catch {
        // 網路／非 200／解析失敗：不白屏。從本地預設挑一則相近答案墊著。
        setAnswer(localFallback(trimmed, presets, en));
        setOffline(true);
        setErrored(true);
      } finally {
        setLoading(false);
      }
    },
    [loading, courseContext, lang, presets, en],
  );

  return (
    <div>
      <p className="text-sm text-avo-ink/70">
        {en
          ? 'Ask anything about this session; the answer is grounded in the class recap.'
          : '問任何跟這堂課有關的問題，回答會以本堂摘要為依據。'}
      </p>

      {/* 提問輸入 */}
      <form
        className="mt-3 flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          void ask(question);
        }}
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t(UI.placeholder)}
          className="min-w-0 flex-1 rounded-xl border border-avo-ink/15 bg-avo-cream px-4 py-2.5 text-sm text-avo-ink outline-none transition-colors focus:border-avo-main"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="shrink-0 rounded-full bg-avo-main px-6 py-2.5 text-sm font-semibold text-avo-dark transition-colors hover:bg-avo-dark hover:text-avo-paper disabled:opacity-50"
        >
          {loading ? t(UI.thinking) : t(UI.send)}
        </button>
      </form>

      {/* 預設問題快捷：點了填入並直接送出 */}
      <p className="mt-4 text-xs text-avo-ink/55">{t(UI.shortcutsLabel)}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {presets.map((p, i) => {
          const label = en ? p.questionEn ?? p.question : p.question;
          return (
            <button
              key={i}
              type="button"
              disabled={loading}
              onClick={() => {
                setQuestion(label);
                void ask(label);
              }}
              className="rounded-full border border-avo-main/35 px-3.5 py-2 text-sm text-avo-dark transition-colors hover:bg-avo-light/60 disabled:opacity-50"
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 回答 */}
      {answer !== null && (
        <div className="avo-panel mt-4 rounded-2xl p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span aria-hidden className="text-base">
              🥑
            </span>
            <p className="font-mono text-xs text-avo-main">{t(CR.qaAnswerLabel)}</p>
            {offline && (
              <span className="rounded-full bg-avo-seed/15 px-2 py-0.5 text-[0.65rem] font-medium text-avo-seed">
                {t(UI.offlineTag)}
              </span>
            )}
          </div>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-avo-ink">{answer}</p>
          {(errored || offline) && (
            <p className="mt-3 text-xs text-avo-ink/50">
              {errored ? t(UI.errorNote) : t(UI.offlineNote)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// 前端本地退路：fetch 整個失敗時（route 都沒回）用，避免白屏。挑關鍵字最接近的預設答案。
function localFallback(question: string, presets: Preset[], en: boolean): string {
  const pick = (p: Preset) => (en ? p.answerEn ?? p.answer : p.answer);
  if (presets.length === 0) {
    return en ? "This class didn't cover that." : '這一題本課沒提到。';
  }
  const q = question.toLowerCase();
  const words = q.split(/[\s，。、,.!?？！]+/).filter((w) => w.length >= 2);
  let best = presets[0];
  let bestScore = 0;
  for (const p of presets) {
    const hay = `${p.question} ${p.questionEn ?? ''}`.toLowerCase();
    const score = words.reduce((n, w) => (hay.includes(w) ? n + 1 : n), 0);
    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }
  return pick(best);
}

export default KnowledgeQA;
