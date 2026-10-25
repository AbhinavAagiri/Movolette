import { createElement, useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { observeReveal } from '../lib/reveal';

type RevealTag =
  | 'div'
  | 'span'
  | 'p'
  | 'li'
  | 'section'
  | 'aside'
  | 'figure'
  | 'header'
  | 'footer'
  | 'nav';

export interface RevealProps {
  as?: RevealTag;
  children: ReactNode;
  className?: string;
  id?: string;
  /** Stagger, in milliseconds, added to the shared transition. */
  delay?: number;
  /** How far the element rises into place. */
  shift?: 'none' | 'sm' | 'md';
  style?: CSSProperties;
  role?: string;
  'aria-label'?: string;
}

/**
 * Fades and lifts its children into place the first time they scroll into
 * view. The state lives in a data attribute rather than inline styles so the
 * stylesheet owns the motion, including its reduced-motion variant.
 */
export function Reveal({
  as = 'div',
  children,
  className,
  id,
  delay = 0,
  shift = 'md',
  style,
  role,
  'aria-label': ariaLabel,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    return observeReveal(element, () => element.setAttribute('data-reveal', 'in'));
  }, []);

  return createElement(
    as,
    {
      ref,
      id,
      className,
      role,
      'aria-label': ariaLabel,
      'data-reveal': 'out',
      'data-reveal-shift': shift,
      style: delay ? { ...style, ['--reveal-delay' as string]: `${delay}ms` } : style,
    },
    children,
  );
}
