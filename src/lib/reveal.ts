type RevealCallback = () => void;

/*
 * One observer for the whole app. Elements register a callback and are
 * unobserved the moment they reveal, so a long preset list costs one observer
 * rather than one per row.
 */
const callbacks = new WeakMap<Element, RevealCallback>();
let observer: IntersectionObserver | null = null;

function ensureObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null;
  if (observer) return observer;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        /* Anything already scrolled past is revealed rather than waiting. */
        const scrolledPast = entry.boundingClientRect.bottom <= 0;
        if (!entry.isIntersecting && !scrolledPast) continue;

        const callback = callbacks.get(entry.target);
        callbacks.delete(entry.target);
        observer?.unobserve(entry.target);
        callback?.();
      }
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
  );

  return observer;
}

function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.94 && rect.bottom > 0;
}

/**
 * Reveals `element` once it enters the viewport (or immediately when it is
 * already on screen, or when the browser cannot observe it). Returns a
 * disposer for unmounted elements.
 */
export function observeReveal(element: Element, onReveal: RevealCallback): () => void {
  const io = ensureObserver();
  /*
   * Above-the-fold content should not wait for the observer's first frame: it
   * is already on screen when it mounts, and a paused or background tab may
   * delay that callback.
   */
  if (!io || isInViewport(element)) {
    onReveal();
    return () => {};
  }

  callbacks.set(element, onReveal);
  io.observe(element);

  return () => {
    callbacks.delete(element);
    io.unobserve(element);
  };
}
