import { useEffect, useState } from 'react';

export type Route =
  | { name: 'landing' }
  | { name: 'studio'; search: URLSearchParams };

export function parseHash(hash: string): Route {
  const cleaned = hash.replace(/^#\/?/, '');
  if (cleaned.startsWith('studio')) {
    const question = cleaned.indexOf('?');
    const search = new URLSearchParams(question >= 0 ? cleaned.slice(question + 1) : '');
    return { name: 'studio', search };
  }
  return { name: 'landing' };
}

export function studioHash(params?: { preset?: string; share?: string }): string {
  const search = new URLSearchParams();
  if (params?.preset) search.set('preset', params.preset);
  if (params?.share) search.set('s', params.share);
  const query = search.toString();
  return `#/studio${query ? `?${query}` : ''}`;
}

export function navigate(hash: string): void {
  if (window.location.hash === hash) {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    return;
  }
  window.location.hash = hash;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  return route;
}
