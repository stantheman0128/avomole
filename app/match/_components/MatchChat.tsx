'use client';
// app/match/_components/MatchChat.tsx —— 聊天 UI 主體。
// 狀態機：訊息列表 + 每則 assistant 回覆掛推薦卡。fetch /api/chat 帶累積 messages。
// 錯誤／例外一律罐頭回覆，UI 永不白屏、不裸露錯誤。initialQuery 非空時自動送出第一問。
import { useEffect, useRef, useState, useCallback } from 'react';
import { useLang } from '@/lib/i18n';
import type { PublicTutor } from '@/lib/types';
import { s } from '../strings';
import { Recommendations } from './Recommendations';

interface Rec {
  slug: string;
  reason: string;
}

// 一則對話：user 只有文字；assistant 可能帶推薦卡與 offline 旗標。
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

      // 只把 role/content 送給 API（累積歷史）。
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
        // 網路／非 200／解析失敗：友善罐頭，永不白屏。
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

  // initialQuery（?q=）掛載後自動送出一次。
  useEffect(() => {
    if (initialQuery.trim() && !autoSent.current) {
      autoSent.current = true;
      void send(initialQuery);
    }
    // 僅在掛載時觸發一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 新訊息時捲到底。
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns, loading]);

  return (
    <div className="flex min-h-[70vh] flex-col">
      <header className="mb-6">
        <p className="avo-kicker">{t(s.kicker)}</p>
        <h1 className="avo-display mt-2 text-3xl text-avo-dark sm:text-4xl">{t(s.title)}</h1>
        <p className="avo-prose mt-3 text-sm text-avo-ink/70">{t(s.subtitle)}</p>
      </header>

      {/* 訊息列表 */}
      <div
        ref={scrollRef}
        className="avo-panel flex-1 space-y-4 overflow-y-auto rounded-3xl p-4 sm:p-5"
      >
        {/* 開場白 */}
        <AssistantBubble text={t(s.greeting)} />

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

      {/* 建議 prompt chips */}
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

      {/* 輸入列 */}
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
