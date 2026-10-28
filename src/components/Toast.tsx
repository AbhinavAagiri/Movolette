import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export type ToastTone = 'success' | 'error';

type Notify = (message: string, tone?: ToastTone) => void;

const ToastContext = createContext<Notify>(() => undefined);

export function useToast(): Notify {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');
  const [tone, setTone] = useState<ToastTone>('success');
  const [visible, setVisible] = useState(false);
  const timer = useRef<number | null>(null);

  const notify = useCallback<Notify>((next, nextTone = 'success') => {
    if (!next) return;
    setMessage(next);
    setTone(nextTone);
    setVisible(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setVisible(false), 3600);
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div
        className={`app-toast${visible ? ' is-visible' : ''}`}
        data-tone={tone}
        role={tone === 'error' ? 'alert' : 'status'}
        aria-live={tone === 'error' ? 'assertive' : 'polite'}
      >
        <span className="app-toast__dot" aria-hidden="true" />
        <span>{message}</span>
      </div>
    </ToastContext.Provider>
  );
}
