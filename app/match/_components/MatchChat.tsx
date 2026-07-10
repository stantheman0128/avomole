'use client';
// app/match/_components/MatchChat.tsx —— 聊天 UI 主體。
// 空狀態給 3 個可點範例問題（轉 LLM／預算／程度），點了就送出。
import { useEffect, useRef, useState, useCallback } from 'react';
import { useLang } from '@/lib/i18n';
import type { PublicTutor } from '@/lib/types';
import { s } from '../strings';
import { Recommendations } from './Recommendations';

interface Rec {
  slug: string;
  reason: string;
}

interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
  recommendations?: Rec[];
  offline?: boolean;
}

interface ChatResponse {
  reply?: string;
  recommendations?: Rec[];
  offline?: boolean;
  error?: string;
}

export function MatchChat({
  tutors,
  initialQuery,
}: {
  tutors: PublicTutor[];
  initialQuery: string;
}) {
  const { t } = useLang();
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoSent = useRef(false);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const nextTurns: ChatTurn[] = [...turns, { role: 'user', content: trimmed }];
      setTurns(nextTurns);
      setInput('');
      setLoading(true);

      const payload = nextTurns.map((m) => ({ role: m.role, content: m.content }));

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: payload }),
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = (await res.json()) as ChatResponse;
        setTurns((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.reply || t(s.errorReply),
            recommendations: data.recommendations ?? [],
            offline: data.offline,
          },
        ]);
      } catch {
        setTurns((prev) => [
          ...prev,
          { role: 'assistant', content: t(s.errorReply), recommendations: [], offline: true },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [turns, loading, t],
  );

  useEffect(() => {
    if (initialQuery.trim() && !autoSent.current) {
      autoSent.current = true;
      void send(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns, loading]);

  const showEmptyPrompts = turns.length === 0 && !loading && !initialQuery.trim();

  return (
    <div className="flex min-h-[70vh] flex-col">
      <header className="mb-6">
        <p className="avo-kicker">{t(s.kicker)}</p>
        <h1 className="avo-display mt-2 text-3xl text-avo-dark sm:text-4xl">{t(s.title)}</h1>
        <p className="avo-prose mt-3 text-sm text-avo-ink/70">{t(s.subtitle)}</p>
      </header>

      <div
        ref={scrollRef}
        className="avo-panel flex-1 space-y-4 overflow-y-auto rounded-3xl p-4 sm:p-5"
      >
        <AssistantBubble text={t(s.greeting)} />

        {showEmptyPrompts && (
          <div className="rounded-2xl border border-dashed border-avo-seed/40 bg-avo-seed/5 px-4 py-4">
            <p className="text-sm font-medium text-avo-ink/80">{t(s.emptyHint)}</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {s.chips.map((chip, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={loading}
                  onClick={() => void send(t(chip))}
                  className="rounded-2xl border border-avo-seed/45 bg-avo-cream px-3.5 py-2.5 text-left text-sm text-avo-dark transition-colors hover:border-avo-seed hover:bg-avo-seed/10 disabled:opacity-50"
                >
                  {t(chip)}
                </button>
              ))}
            </div>
          </div>
        )}

        {turns.map((turn, i) =>
          turn.role === 'user' ? (
            <UserBubble key={i} text={turn.content} />
          ) : (
            <div key={i} className="space-y-3">
              <AssistantBubble text={turn.content} />
              {turn.recommendations && turn.recommendations.length > 0 && (
                <Recommendations recs={turn.recommendations} tutors={tutors} offline={turn.offline} />
              )}
            </div>
          ),
        )}

        {loading && <AssistantBubble text={t(s.sending)} pending />}
      </div>

      {/* 對話開始後仍保留精簡 chips，方便追問 */}
      {!showEmptyPrompts && (
        <div className="mt-4 flex flex-wrap gap-2">
          {s.chips.map((chip, i) => (
            <button
              key={i}
              type="button"
              disabled={loading}
              onClick={() => void send(t(chip))}
              className="rounded-full border border-avo-main/35 px-3.5 py-1.5 text-sm text-avo-dark transition-colors hover:bg-avo-light/60 disabled:opacity-50"
            >
              {t(chip)}
            </button>
          ))}
        </div>
      )}

      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t(s.inputPlaceholder)}
          aria-label={t(s.inputPlaceholder)}
          className="avo-panel min-w-0 flex-1 rounded-full px-4 py-2.5 text-sm text-avo-ink outline-none transition-colors focus:border-avo-main"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="shrink-0 rounded-full bg-avo-main px-5 py-2.5 text-sm font-semibold text-avo-dark transition-colors hover:bg-avo-dark hover:text-avo-paper disabled:opacity-50"
        >
          {loading ? t(s.sending) : t(s.send)}
        </button>
      </form>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-avo-main px-4 py-2.5 text-sm text-avo-dark">
        {text}
      </p>
    </div>
  );
}

function AssistantBubble({ text, pending }: { text: string; pending?: boolean }) {
  return (
    <div className="flex items-start gap-2">
      <span aria-hidden className="mt-0.5 shrink-0 text-lg">
        🥑
      </span>
      <p
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tl-sm bg-avo-light/50 px-4 py-2.5 text-sm text-avo-ink ${
          pending ? 'animate-pulse text-avo-ink/60' : ''
        }`}
      >
        {text}
      </p>
    </div>
  );
}

export default MatchChat;
