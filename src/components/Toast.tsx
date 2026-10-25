import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

const ToastContext = createContext<(message: string) => void>(() => undefined);

export function useToast(): (message: string) => void {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const timer = useRef<number | null>(null);

  const notify = useCallback((next: string) => {
    if (!next) return;
    setMessage(next);
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
      <div className={`app-toast${visible ? ' is-visible' : ''}`} role="status" aria-live="polite">
        <span className="app-toast__dot" aria-hidden="true" />
        <span>{message}</span>
      </div>
    </ToastContext.Provider>
  );
}
