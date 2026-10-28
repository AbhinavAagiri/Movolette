import { useEffect } from 'react';
import type { MouseEvent } from 'react';
import { useRoute } from './lib/router';
import { Landing } from './pages/Landing';
import { Studio } from './pages/Studio';
import { NotFound } from './pages/NotFound';
import { ToastProvider } from './components/Toast';
import { ThemeProvider } from './components/ThemeProvider';

export function App() {
  const route = useRoute();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [route.name]);

  // The studio and the 404 page own more specific titles; these are the two
  // that would otherwise keep a stale name from the previous route.
  useEffect(() => {
    if (route.name === 'landing') document.title = 'Movolette';
    else if (route.name === 'notFound') document.title = 'Page not found — Movolette';
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
        ) : route.name === 'studio' ? (
          <Studio key={route.search.toString()} search={route.search} />
        ) : (
          <NotFound />
        )}
      </ToastProvider>
    </ThemeProvider>
  );
}
