import { useEffect, useState } from 'react';

export type Route =
  | { name: 'landing' }
  | { name: 'studio'; search: URLSearchParams }
  | { name: 'notFound' };

/**
 * Routes live in the hash because the app is served as static files. Only
 * `#/...` addresses are routes; `#explore` and similar remain section anchors.
 */
export function parseHash(hash: string): Route {
  if (!hash.startsWith('#/')) return { name: 'landing' };
  const path = hash.slice(2);
  if (!path || path === '/') return { name: 'landing' };
  const question = path.indexOf('?');
  const name = question >= 0 ? path.slice(0, question) : path;
  if (name === 'studio') {
    const search = new URLSearchParams(question >= 0 ? path.slice(question + 1) : '');
    return { name: 'studio', search };
  }
  return { name: 'notFound' };
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
