import type { EasingValue } from './types';

export type Bezier = [number, number, number, number];

export interface EasingDef {
  id: string;
  label: string;
  bezier: Bezier;
  note?: string;
}

export const EASINGS: EasingDef[] = [
  { id: 'linear', label: 'Linear', bezier: [0, 0, 1, 1], note: 'Constant speed' },
  { id: 'ease', label: 'Ease', bezier: [0.25, 0.1, 0.25, 1], note: 'CSS default' },
  { id: 'ease-in', label: 'Ease in', bezier: [0.42, 0, 1, 1], note: 'Slow start' },
  { id: 'ease-out', label: 'Ease out', bezier: [0, 0, 0.58, 1], note: 'Soft landing' },
  { id: 'ease-in-out', label: 'Ease in out', bezier: [0.42, 0, 0.58, 1], note: 'Balanced' },
  { id: 'editorial', label: 'Editorial', bezier: [0.22, 1, 0.36, 1], note: 'Fast out, long settle' },
  { id: 'spring', label: 'Spring', bezier: [0.34, 1.56, 0.64, 1], note: 'Overshoots gently' },
  { id: 'custom', label: 'Custom', bezier: [0.45, 0.05, 0.55, 0.95], note: 'Your curve' },
];

export const DEFAULT_EASING_ID = 'editorial';
export const FALLBACK_BEZIER: Bezier = [0.22, 1, 0.36, 1];

export function getEasing(id: string): EasingDef {
  return EASINGS.find((easing) => easing.id === id) ?? EASINGS[0];
}

export function easingById(id: string): EasingValue {
  const found = EASINGS.find((easing) => easing.id === id);
  const bezier = found && found.id !== 'custom' ? found.bezier : FALLBACK_BEZIER;
  return { id: found?.id ?? 'custom', bezier: [...bezier] as Bezier };
}

export function isBezier(value: unknown): value is Bezier {
  return (
    Array.isArray(value) &&
    value.length === 4 &&
    value.every((n) => typeof n === 'number' && Number.isFinite(n) && n >= -1 && n <= 2)
  );
}

export function clampBezier(value: unknown): Bezier {
  if (!isBezier(value)) return [...FALLBACK_BEZIER] as Bezier;
  return value.map((n) => Math.round(n * 1000) / 1000) as Bezier;
}

export function bezierCss(bezier: Bezier): string {
  return `cubic-bezier(${bezier.map((n) => trim(n)).join(', ')})`;
}

export function bezierLabel(bezier: Bezier): string {
  return bezier.map((n) => trim(n)).join(', ');
}

function trim(n: number): string {
  const rounded = Math.round(n * 1000) / 1000;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

/** Compact cubic-bezier timing function used in generated JS. */
export function jsEase(bezier: Bezier, progress: number, duration: number): number {
  return bezierEase(progress / duration, bezier);
}

export function bezierEase(t: number, bezier: Bezier): number {
  const x1 = bezier[0];
  const y1 = bezier[1];
  const x2 = bezier[2];
  const y2 = bezier[3];
  const sample = (a: number, b: number, s: number) =>
    3 * (1 - s) * (1 - s) * s * a + 3 * (1 - s) * s * s * b + s * s * s;
  let lower = 0;
  let upper = 1;
  let s = t;
  for (let i = 0; i < 12; i += 1) {
    const x = sample(x1, x2, s);
    if (Math.abs(x - t) < 1e-4) break;
    if (x < t) lower = s;
    else upper = s;
    s = (lower + upper) / 2;
  }
  return sample(y1, y2, s);
}

export function easingMatches(id: string, bezier: Bezier): boolean {
  const found = EASINGS.find((easing) => easing.id === id);
  return !!found && found.id !== 'custom' && found.bezier.every((n, i) => Math.abs(n - bezier[i]) < 0.001);
}
