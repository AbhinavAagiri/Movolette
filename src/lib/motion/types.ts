export type ParamValue = number | string | boolean;

export type FamilyId =
  | 'buttons'
  | 'text'
  | 'toasts'
  | 'modals'
  | 'cards'
  | 'toggles'
  | 'loading'
  | 'heroes';

export type ControlType = 'range' | 'segmented' | 'select' | 'switch' | 'text' | 'textarea';

export interface SelectOption {
  label: string;
  value: string;
}

export interface ControlDef {
  key: string;
  label: string;
  type: ControlType;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: SelectOption[];
  note?: string;
  placeholder?: string;
  maxLength?: number;
  /** Only render this control when the predicate passes. */
  when?: (p: Record<string, ParamValue>) => boolean;
}

export interface EasingValue {
  id: string;
  bezier: [number, number, number, number];
}

export interface DemoState {
  id: string;
  label: string;
}

export interface BuildContext {
  p: Record<string, ParamValue>;
  ease: [number, number, number, number];
  /** True inside the studio/gallery iframe: enables editorial demo hooks. */
  demo: boolean;
}

export interface BuildResult {
  css: string;
  html: string;
  js?: string;
  /** Extra guidance shown in the export panel. */
  note?: string;
}

export interface Preset {
  id: string;
  name: string;
  blurb: string;
  family: FamilyId;
  controls: ControlDef[];
  defaults: Record<string, ParamValue>;
  easing: string;
  demoStates?: DemoState[];
  /** Controls the generated root composition layout. */
  layout?: 'center' | 'full';
  build: (ctx: BuildContext) => BuildResult;
  usage?: string;
}

export interface FamilyMeta {
  id: FamilyId;
  label: string;
  short: string;
  description: string;
}

/* ---------- Hero composer ---------- */

export type HeroTemplateId = 'hero-centered' | 'hero-split' | 'hero-gallery';

export type HeroStepId = 'headline' | 'body' | 'actions' | 'visual';

export interface HeroStep {
  id: HeroStepId;
  duration: number;
  /** Pause before this step begins, relative to the previous step's start. */
  gap: number;
  distance: number;
  easing: string;
}

export interface HeroContent {
  brand: string;
  headline: string;
  body: string;
  primary: string;
  secondary: string;
  note: string;
  cardTitle: string;
  cardMetric: string;
  cardMeta: string;
  itemOne: string;
  itemTwo: string;
  itemThree: string;
}

export interface HeroState {
  content: HeroContent;
  steps: HeroStep[];
}

export interface HeroPreset extends Preset {
  template: HeroTemplateId;
}

/* ---------- Studio document ---------- */

export interface StudioDocument {
  presetId: string;
  params: Record<string, ParamValue>;
  easing: EasingValue;
  hero?: HeroState;
}
