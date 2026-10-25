import type { ParamValue } from './types';

export const INK = '#20211F';
export const IVORY = '#F7F6F2';
export const PAPER = '#FFFFFF';
export const MUTED = '#85857F';
export const LINE = '#E4E2DC';
export const VIOLET = '#6157E8';
export const LAVENDER = '#DCD7FF';
export const CORAL = '#F18A68';

export const SANS = `'Instrument Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif`;
export const SERIF = `'Instrument Serif', 'Iowan Old Style', Georgia, serif`;
export const MONO = `'Spline Sans Mono', ui-monospace, SFMono-Regular, Consolas, monospace`;

export function num(p: Record<string, ParamValue>, key: string, fallback: number): number {
  const value = p[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

export function str(p: Record<string, ParamValue>, key: string, fallback: string): string {
  const value = p[key];
  return typeof value === 'string' ? value : fallback;
}

export function bool(p: Record<string, ParamValue>, key: string, fallback: boolean): boolean {
  const value = p[key];
  return typeof value === 'boolean' ? value : fallback;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** CSS selector for a hover/active state; demo hooks exist only in the studio. */
export function stateSelector(
  selector: string,
  demo: boolean,
  state: 'hover' | 'active' | 'focus',
): string {
  if (!demo) return `${selector}:${state}`;
  return `${selector}:${state}, body[data-sim="${state}"] ${selector}`;
}

export function artCss(): string {
  return `
.mv-art {
  --mv-ink: ${INK};
  --mv-paper: ${PAPER};
  --mv-ivory: ${IVORY};
  --mv-muted: ${MUTED};
  --mv-line: ${LINE};
  --mv-violet: ${VIOLET};
  --mv-lavender: ${LAVENDER};
  --mv-coral: ${CORAL};
  position: relative;
  width: 100%;
  padding: 44px 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--mv-paper);
  color: var(--mv-ink);
  font-family: ${SANS};
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
.mv-art--full {
  padding: 0;
  display: block;
  align-items: stretch;
  background: var(--mv-ivory);
}
.mv-art,
.mv-art *,
.mv-art *::before,
.mv-art *::after {
  box-sizing: border-box;
}
.mv-art .mv-mono {
  font-family: ${MONO};
  font-size: 10px;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}
.mv-btn {
  appearance: none;
  border: 1px solid transparent;
  border-radius: 3px;
  background: var(--mv-violet);
  color: #fff;
  font-family: ${SANS};
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.008em;
  padding: 13px 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  text-decoration: none;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    color 180ms ease,
    box-shadow 200ms ease;
}
.mv-btn:focus-visible {
  outline: 2px solid var(--mv-ink);
  outline-offset: 3px;
}
.mv-btn--ghost {
  background: transparent;
  color: var(--mv-ink);
  border-color: var(--mv-line);
}
.mv-btn--ink {
  background: var(--mv-ink);
  color: var(--mv-ivory);
}
.mv-card {
  background: var(--mv-paper);
  border: 1px solid var(--mv-line);
  border-radius: 5px;
  overflow: hidden;
}
`;
}

export function art(inner: string, layout: 'center' | 'full' = 'center'): string {
  return `<div class="mv-art${layout === 'full' ? ' mv-art--full' : ''}">${inner}</div>`;
}

/** Simulated editor state helpers, emitted in preview CSS only. */
export function reducedMotionBlock(): string {
  return `
@media (prefers-reduced-motion: reduce) {
  .mv-art,
  .mv-art *,
  .mv-art *::before,
  .mv-art *::after {
    animation-delay: 0ms !important;
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-delay: 0ms !important;
    transition-duration: 0.001ms !important;
  }
}`;
}

export function spinnerCss(size: number, color: string, duration: number, name: string): string {
  return `
@keyframes ${name} {
  to { transform: rotate(360deg); }
}
.mv-spinner {
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  border: ${Math.max(1.5, Math.round(size / 11))}px solid rgba(32, 33, 31, 0.14);
  border-top-color: ${color};
  animation: ${name} ${duration}ms linear infinite;
  display: inline-block;
}`;
}
