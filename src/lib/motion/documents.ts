import { EASINGS, FALLBACK_BEZIER, getEasing } from './easing';
import { defaultHeroContent, defaultHeroSteps, HERO_STEP_LABELS } from './heroes';
import { defaultDocument, getPreset } from './presets';
import type {
  EasingValue,
  HeroContent,
  HeroState,
  HeroStep,
  HeroStepId,
  ParamValue,
  StudioDocument,
} from './types';

const HERO_CONTENT_KEYS: (keyof HeroContent)[] = [
  'brand',
  'headline',
  'body',
  'primary',
  'secondary',
  'note',
  'cardTitle',
  'cardMetric',
  'cardMeta',
  'itemOne',
  'itemTwo',
  'itemThree',
];

const CONTENT_LIMITS: Record<keyof HeroContent, number> = {
  brand: 32,
  headline: 130,
  body: 320,
  primary: 34,
  secondary: 34,
  note: 64,
  cardTitle: 40,
  cardMetric: 18,
  cardMeta: 100,
  itemOne: 48,
  itemTwo: 48,
  itemThree: 48,
};

const STEP_IDS: HeroStepId[] = ['headline', 'body', 'actions', 'visual'];

function safeString(value: unknown, fallback: string, max: number): string {
  if (typeof value !== 'string') return fallback;
  return value.slice(0, max);
}

function clampNumber(value: unknown, min: number, max: number, fallback: number, step = 1): number {
  const numeric = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isFinite(numeric)) return fallback;
  const clamped = Math.min(max, Math.max(min, numeric));
  return Math.round(clamped / step) * step;
}

function readBezier(value: unknown): [number, number, number, number] | null {
  if (!Array.isArray(value) || value.length !== 4) return null;
  const numbers = value.map((entry) => Number(entry));
  if (!numbers.every((entry) => Number.isFinite(entry))) return null;
  const [x1, y1, x2, y2] = numbers;
  if (x1 < 0 || x1 > 1 || x2 < 0 || x2 > 1) return null;
  return [
    Math.round(x1 * 1000) / 1000,
    Math.round(Math.min(1.8, Math.max(-0.8, y1)) * 1000) / 1000,
    Math.round(x2 * 1000) / 1000,
    Math.round(Math.min(1.8, Math.max(-0.8, y2)) * 1000) / 1000,
  ];
}

export function readEasing(raw: unknown): EasingValue {
  let id = '';
  let bezierRaw: unknown = null;
  if (Array.isArray(raw)) {
    id = typeof raw[0] === 'string' ? raw[0] : '';
    bezierRaw = raw.slice(1);
  } else if (raw && typeof raw === 'object') {
    const record = raw as Record<string, unknown>;
    id = typeof record.id === 'string' ? record.id : '';
    bezierRaw = record.bezier;
  }
  const def = EASINGS.find((easing) => easing.id === id);
  if (def && def.id !== 'custom') {
    return { id: def.id, bezier: [...def.bezier] as [number, number, number, number] };
  }
  const bezier = readBezier(bezierRaw);
  if (id === 'custom' && bezier) return { id: 'custom', bezier };
  return { id: 'custom', bezier: [...FALLBACK_BEZIER] as [number, number, number, number] };
}

export function sanitizeParams(presetId: string, raw: unknown): Record<string, ParamValue> {
  const preset = getPreset(presetId);
  if (!preset) return {};
  const source = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const out: Record<string, ParamValue> = { ...preset.defaults };
  for (const control of preset.controls) {
    const value = source[control.key];
    if (control.type === 'range') {
      const fallback = typeof preset.defaults[control.key] === 'number' ? (preset.defaults[control.key] as number) : 0;
      out[control.key] = clampNumber(
        value,
        control.min ?? 0,
        control.max ?? 100,
        fallback,
        control.step ?? 1,
      );
    } else if (control.type === 'segmented' || control.type === 'select') {
      const allowed = control.options?.map((option) => option.value) ?? [];
      const fallback = String(preset.defaults[control.key] ?? allowed[0] ?? '');
      out[control.key] = typeof value === 'string' && allowed.includes(value) ? value : fallback;
    } else if (control.type === 'switch') {
      out[control.key] =
        typeof value === 'boolean' ? value : typeof preset.defaults[control.key] === 'boolean' ? (preset.defaults[control.key] as boolean) : false;
    } else {
      const fallback = String(preset.defaults[control.key] ?? '');
      out[control.key] = safeString(value, fallback, control.maxLength ?? 120);
    }
  }
  return out;
}

export function sanitizeHeroState(presetId: string, raw: unknown): HeroState | undefined {
  const preset = getPreset(presetId);
  if (!preset || preset.family !== 'heroes') return undefined;
  const template = preset.id as 'hero-centered' | 'hero-split' | 'hero-gallery';
  const base = defaultHeroContent(template);
  const defaults = defaultHeroSteps();
  const source = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const rawContent =
    source.content && typeof source.content === 'object' ? (source.content as Record<string, unknown>) : {};
  const content = { ...base } as HeroContent;
  for (const key of HERO_CONTENT_KEYS) {
    content[key] = safeString(rawContent[key], base[key], CONTENT_LIMITS[key]);
  }
  const rawSteps = Array.isArray(source.steps) ? source.steps : [];
  const steps: HeroStep[] = [];
  for (const entry of rawSteps) {
    if (!entry || typeof entry !== 'object') continue;
    const record = entry as Record<string, unknown>;
    const id = record.id;
    if (typeof id !== 'string' || !STEP_IDS.includes(id as HeroStepId)) continue;
    if (steps.some((step) => step.id === id)) continue;
    const fallback = defaults.find((step) => step.id === id) ?? defaults[0];
    const easingId = typeof record.easing === 'string' && getEasing(record.easing).id === record.easing ? record.easing : fallback.easing;
    steps.push({
      id: id as HeroStepId,
      duration: clampNumber(record.duration, 100, 4000, fallback.duration, 10),
      gap: clampNumber(record.gap, 0, 3000, fallback.gap, 10),
      distance: clampNumber(record.distance, 0, 200, fallback.distance, 1),
      easing: easingId,
    });
  }
  for (const fallback of defaults) {
    if (!steps.some((step) => step.id === fallback.id)) steps.push({ ...fallback });
  }
  return { content, steps };
}

export function sanitizeDocument(raw: unknown): StudioDocument | null {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Record<string, unknown>;
  const presetId = typeof record.presetId === 'string' ? record.presetId : '';
  const preset = getPreset(presetId);
  if (!preset) return null;
  const doc: StudioDocument = {
    presetId,
    params: sanitizeParams(presetId, record.params),
    easing: readEasing(record.easing),
  };
  if (preset.family === 'heroes') {
    doc.hero = sanitizeHeroState(presetId, record.hero);
    if (!doc.hero) return null;
  }
  return doc;
}

export function isValidBezier(bezier: [number, number, number, number]): boolean {
  return readBezier(bezier) !== null;
}

/* ---------- Sharing ---------- */

interface SharePayload {
  v: 1;
  p: string;
  a: Record<string, ParamValue>;
  e: [string, number, number, number, number];
  h?: {
    c: string[];
    s: [string, number, number, number, string][];
  };
}

function toBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export type ShareResult = { ok: true; doc: StudioDocument } | { ok: false; error: string };

export function encodeDocument(doc: StudioDocument): string {
  const preset = getPreset(doc.presetId);
  const payload: SharePayload = {
    v: 1,
    p: doc.presetId,
    a: sanitizeParams(doc.presetId, doc.params),
    e: [doc.easing.id, ...doc.easing.bezier],
  };
  if (preset?.family === 'heroes') {
    const hero = sanitizeHeroState(doc.presetId, doc.hero);
    if (hero) {
      payload.h = {
        c: HERO_CONTENT_KEYS.map((key) => hero.content[key]),
        s: hero.steps.map((step) => [step.id, step.duration, step.gap, step.distance, step.easing]),
      };
    }
  }
  return toBase64Url(JSON.stringify(payload));
}

export function decodeShare(token: string): ShareResult {
  if (!token || token.length > 12000) {
    return { ok: false, error: 'That link is empty or too large to read.' };
  }
  let payload: unknown;
  try {
    payload = JSON.parse(fromBase64Url(token));
  } catch {
    return { ok: false, error: 'That link does not contain a readable animation.' };
  }
  if (!payload || typeof payload !== 'object') {
    return { ok: false, error: 'That link does not contain a readable animation.' };
  }
  const record = payload as Record<string, unknown>;
  if (record.v !== 1 || typeof record.p !== 'string') {
    return { ok: false, error: 'This share link uses an unsupported version.' };
  }
  const preset = getPreset(record.p);
  if (!preset) {
    return { ok: false, error: 'This link points to a preset that no longer exists.' };
  }
  const easingArray = Array.isArray(record.e) ? record.e : null;
  const easing = readEasing(easingArray);
  const doc: StudioDocument = {
    presetId: preset.id,
    params: sanitizeParams(preset.id, record.a),
    easing,
  };
  if (preset.family === 'heroes') {
    const rawHero = record.h && typeof record.h === 'object' ? (record.h as Record<string, unknown>) : {};
    const rawContent: Record<string, string> = {};
    if (Array.isArray(rawHero.c)) {
      HERO_CONTENT_KEYS.forEach((key, index) => {
        const value = rawHero.c as unknown[];
        if (typeof value[index] === 'string') rawContent[key] = value[index] as string;
      });
    }
    const rawSteps = Array.isArray(rawHero.s) ? (rawHero.s as unknown[]) : [];
    const steps = rawSteps.flatMap((entry) => {
      if (!Array.isArray(entry)) return [];
      const [id, duration, gap, distance, stepEasing] = entry;
      if (typeof id !== 'string' || !STEP_IDS.includes(id as HeroStepId)) return [];
      return [
        {
          id: id as HeroStepId,
          duration,
          gap,
          distance,
          easing: typeof stepEasing === 'string' ? stepEasing : 'editorial',
        },
      ];
    });
    doc.hero = sanitizeHeroState(preset.id, {
      content: rawContent,
      steps: steps.length ? steps : undefined,
    });
    if (!doc.hero) {
      doc.hero = { content: defaultHeroContent(preset.id as 'hero-centered'), steps: defaultHeroSteps() };
    }
  }
  return { ok: true, doc };
}

export function newDocument(presetId: string): StudioDocument {
  return defaultDocument(presetId);
}

export function documentsEqual(a: StudioDocument, b: StudioDocument): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function stepLabel(id: HeroStepId): string {
  return HERO_STEP_LABELS[id];
}
