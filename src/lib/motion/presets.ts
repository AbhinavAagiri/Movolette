import { easingById, DEFAULT_EASING_ID } from './easing';
import { buildHero, defaultHeroState, defaultHeroContent, defaultHeroSteps, heroPresets } from './heroes';
import { buttonPresets } from './presets/buttons';
import { textPresets } from './presets/text';
import { toastPresets } from './presets/toasts';
import { modalPresets } from './presets/modals';
import { cardPresets } from './presets/cards';
import { togglePresets } from './presets/toggles';
import { loadingPresets } from './presets/loading';
import type { BuildResult, FamilyId, FamilyMeta, Preset, StudioDocument } from './types';

export const FAMILIES: FamilyMeta[] = [
  {
    id: 'buttons',
    label: 'Buttons & links',
    short: 'Buttons',
    description: 'Pointer feedback with a point of view.',
  },
  {
    id: 'text',
    label: 'Text & typography',
    short: 'Text',
    description: 'Type that arrives rather than appears.',
  },
  {
    id: 'toasts',
    label: 'Toasts & notifications',
    short: 'Toasts',
    description: 'Small confirmations, cleanly timed.',
  },
  {
    id: 'modals',
    label: 'Modals & popovers',
    short: 'Modals',
    description: 'Focused surfaces and the way they open.',
  },
  {
    id: 'cards',
    label: 'Cards & lists',
    short: 'Cards',
    description: 'Collections that settle into place.',
  },
  {
    id: 'toggles',
    label: 'Toggles & feedback',
    short: 'Feedback',
    description: 'The state changes people feel.',
  },
  {
    id: 'loading',
    label: 'Loading & progress',
    short: 'Loading',
    description: 'Waiting, made legible.',
  },
  {
    id: 'heroes',
    label: 'Hero sections',
    short: 'Heroes',
    description: 'Coordinated entrances, composed.',
  },
];

export const PRESETS: Preset[] = [
  ...buttonPresets,
  ...textPresets,
  ...toastPresets,
  ...modalPresets,
  ...cardPresets,
  ...togglePresets,
  ...loadingPresets,
  ...heroPresets,
];

const PRESET_MAP = new Map(PRESETS.map((preset) => [preset.id, preset]));

export function getPreset(id: string): Preset | undefined {
  return PRESET_MAP.get(id);
}

export function isPresetId(id: string): boolean {
  return PRESET_MAP.has(id);
}

export function presetsByFamily(family: FamilyId): Preset[] {
  return PRESETS.filter((preset) => preset.family === family);
}

export function familyOf(id: FamilyId): FamilyMeta {
  return FAMILIES.find((family) => family.id === id) ?? FAMILIES[0];
}

export function defaultDocument(presetId = 'btn-lift'): StudioDocument {
  const preset = getPreset(presetId) ?? PRESETS[0];
  const base: StudioDocument = {
    presetId: preset.id,
    params: { ...preset.defaults },
    easing: easingById(preset.easing),
  };
  if (preset.family === 'heroes') {
    const template = preset.id as 'hero-centered' | 'hero-split' | 'hero-gallery';
    base.easing = easingById(DEFAULT_EASING_ID);
    base.hero = defaultHeroState(template);
  }
  return base;
}

export function buildDocument(doc: StudioDocument, demo: boolean): BuildResult {
  const preset = getPreset(doc.presetId);
  if (!preset) {
    return { css: '', html: '<div class="mv-art">Unknown preset</div>' };
  }
  if (preset.family === 'heroes') {
    const template = preset.id as 'hero-centered' | 'hero-split' | 'hero-gallery';
    const hero = doc.hero ?? {
      content: defaultHeroContent(template),
      steps: defaultHeroSteps(),
    };
    return buildHero(template, hero.content, hero.steps);
  }
  return preset.build({
    p: { ...preset.defaults, ...doc.params },
    ease: doc.easing.bezier,
    demo,
  });
}

export function defaultHeroDocument(presetId: 'hero-centered' | 'hero-split' | 'hero-gallery'): StudioDocument {
  return defaultDocument(presetId);
}

export const FEATURED_PRESETS = [
  'btn-lift',
  'text-words',
  'toast-slide',
  'modal-scale',
  'card-reveal',
  'toggle-switch',
  'progress-fill',
  'hero-split',
];
