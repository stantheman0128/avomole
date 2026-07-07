'use client';
// lib/toast.tsx —— 極簡 toast。ToastProvider 掛在 layout；任何地方可呼叫 showToast(msg)。
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

interface ToastItem { id: number; msg: string; }

// 模組層 emitter：讓 showToast 能在 React tree 外被 import 呼叫（例如事件 handler）。
type Listener = (msg: string) => void;
let listener: Listener | null = null;

export function showToast(msg: string): void {
  if (listener) listener(msg);
}

const Ctx = createContext<((msg: string) => void) | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const push = useCallback((msg: string) => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, msg }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  // 註冊模組層 emitter → 這個 provider 的 push
  useEffect(() => {
    listener = push;
    return () => {
      if (listener === push) listener = null;
    };
  }, [push]);

  return (
    <Ctx.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 60 }}
        className="flex flex-col items-center gap-2"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="rounded-xl bg-avo-dark px-4 py-3 text-sm text-avo-cream shadow-lg"
            role="status"
          >
            {t.msg}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

// 需要 hook 形式時可用；一般直接 import { showToast } 即可。
export function useToast(): (msg: string) => void {
  const ctx = useContext(Ctx);
  return ctx ?? showToast;
}
