import { useEffect } from 'react';
import type { MouseEvent } from 'react';
import { useRoute } from './lib/router';
import { Landing } from './pages/Landing';
import { Studio } from './pages/Studio';
import { ToastProvider } from './components/Toast';
import { ThemeProvider } from './components/ThemeProvider';

export function App() {
  const route = useRoute();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [route.name]);

  const skipToContent = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById('main-content');
    if (!target) return;
    event.preventDefault();
    target.focus({ preventScroll: true });
    target.scrollIntoView();
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        <a className="skip-link" href="#main-content" onClick={skipToContent}>
          Skip to content
        </a>
        {route.name === 'landing' ? (
          <Landing />
        ) : (
          <Studio key={route.search.toString()} search={route.search} />
        )}
      </ToastProvider>
    </ThemeProvider>
  );
}
