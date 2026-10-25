import { bezierCss, EASINGS, getEasing } from './easing';
import { art, artCss, escapeHtml } from './css';
import type {
  BuildResult,
  HeroContent,
  HeroStep,
  HeroStepId,
  HeroTemplateId,
  Preset,
} from './types';

export const HERO_STEP_LABELS: Record<HeroStepId, string> = {
  headline: 'Headline',
  body: 'Description',
  actions: 'Buttons',
  visual: 'Visual',
};

export interface HeroTemplateMeta {
  id: HeroTemplateId;
  name: string;
  blurb: string;
}

export const HERO_TEMPLATES: HeroTemplateMeta[] = [
  {
    id: 'hero-centered',
    name: 'Centered product hero',
    blurb: 'A centered statement with the product preview settling in beneath it.',
  },
  {
    id: 'hero-split',
    name: 'Split hero',
    blurb: 'Type on the left, a composed product card on the right, on a dark ground.',
  },
  {
    id: 'hero-gallery',
    name: 'Gallery hero',
    blurb: 'A calm introduction above three content cards that arrive as one gesture.',
  },
];

export const DEFAULT_HERO_STEPS: HeroStep[] = [
  { id: 'headline', duration: 900, gap: 0, distance: 24, easing: 'editorial' },
  { id: 'body', duration: 700, gap: 120, distance: 16, easing: 'editorial' },
  { id: 'actions', duration: 650, gap: 90, distance: 12, easing: 'editorial' },
  { id: 'visual', duration: 1000, gap: 120, distance: 28, easing: 'editorial' },
];

export function defaultHeroContent(template: HeroTemplateId): HeroContent {
  const shared: HeroContent = {
    brand: 'Movolette',
    headline: 'Make room for a slower kind of progress.',
    body: 'A workspace for teams who care about the moments between actions — and the interfaces that make them feel considered.',
    primary: 'Start a project',
    secondary: 'See how it works',
    note: 'DESIGNED IN THE OPEN / 01',
    cardTitle: 'This week',
    cardMetric: '84%',
    cardMeta: 'of releases include a motion note',
    itemOne: 'Field notes',
    itemTwo: 'Object studies',
    itemThree: 'Interface details',
  };
  if (template === 'hero-split') {
    return {
      ...shared,
      headline: 'Movement, measured.',
      body: 'Tune every timing curve, watch it in place, and ship the same motion to production. A small tool for a more deliberate web.',
      primary: 'Open the studio',
      secondary: 'Browse presets',
      note: 'STUDIO / MOTION NOTES',
      cardTitle: 'Release 2.4',
      cardMetric: '1.4s',
      cardMeta: 'full hero sequence, from first line to last card',
      itemOne: 'Field notes',
      itemTwo: 'Object studies',
      itemThree: 'Interface details',
    };
  }
  if (template === 'hero-gallery') {
    return {
      ...shared,
      headline: 'A small studio with a long view.',
      body: 'We design interfaces that move with purpose. Fewer effects, better timing, and details you notice on the second visit.',
      primary: 'Browse the work',
      secondary: 'Read the notes',
      note: 'SELECTED WORK / 2022—2026',
      itemOne: 'Harbour / identity',
      itemTwo: 'Ledger / dashboard',
      itemThree: 'Field / publication',
    };
  }
  return shared;
}

export function defaultHeroSteps(): HeroStep[] {
  return DEFAULT_HERO_STEPS.map((step) => ({ ...step }));
}

export function defaultHeroState(template: HeroTemplateId) {
  return { content: defaultHeroContent(template), steps: defaultHeroSteps() };
}

export function stepStarts(steps: HeroStep[]): number[] {
  let at = 0;
  return steps.map((step) => {
    at += Math.max(0, step.gap);
    return at;
  });
}

export function heroDuration(steps: HeroStep[]): number {
  const starts = stepStarts(steps);
  return steps.reduce((max, step, index) => Math.max(max, starts[index] + step.duration), 0);
}

function stepCss(steps: HeroStep[]): string {
  const starts = stepStarts(steps);
  return steps
    .map((step, index) => {
      const delay = starts[index];
      return `.mv-hero [data-step="${step.id}"] {
  animation: mv-hero-enter ${step.duration}ms ${bezierCss(getEasing(step.easing).bezier)} ${delay}ms both;
  --mv-step-distance: ${step.distance}px;
}`;
    })
    .join('\n');
}

const HERO_BASE = `
.mv-hero {
  position: relative;
  width: 100%;
  min-height: min(760px, 100svh);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
  background: var(--mv-ivory);
  color: var(--mv-ink);
}
@keyframes mv-hero-enter {
  from { opacity: 0; transform: translateY(var(--mv-step-distance, 20px)); }
  to { opacity: 1; transform: translateY(0); }
}
.mv-hero [data-step] {
  opacity: 1;
}
.mv-hero__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 20px 40px;
  border-bottom: 1px solid rgba(32, 33, 31, 0.11);
  position: relative;
  z-index: 2;
}
.mv-hero__brand {
  font-weight: 600;
  font-size: 15px;
  letter-spacing: -0.02em;
}
.mv-hero__brand-mark {
  display: inline-block;
  width: 15px;
  height: 15px;
  border: 1px solid currentColor;
  border-radius: 3px;
  margin-right: 8px;
  vertical-align: -2px;
  position: relative;
}
.mv-hero__brand-mark::after {
  content: '';
  position: absolute;
  inset: 4px;
  background: currentColor;
  border-radius: 50%;
}
.mv-hero__links {
  display: flex;
  align-items: center;
  gap: 22px;
  font-family: 'Spline Sans Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  opacity: 0.65;
}
.mv-hero__navcta {
  font-size: 11px;
  font-weight: 600;
  border: 1px solid currentColor;
  border-radius: 3px;
  padding: 8px 12px;
  line-height: 1;
}
.mv-hero__eyebrow {
  margin: 0 0 20px;
  font-family: 'Spline Sans Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.6;
}
.mv-hero__headline {
  margin: 0;
  font-family: 'Instrument Serif', 'Iowan Old Style', Georgia, serif;
  font-weight: 400;
  font-size: clamp(42px, 5.7vw, 76px);
  line-height: 0.96;
  letter-spacing: -0.025em;
  text-wrap: balance;
}
.mv-hero__body {
  margin: 20px 0 0;
  font-size: 14px;
  line-height: 1.65;
  max-width: 46ch;
  opacity: 0.7;
}
.mv-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 26px;
}
.mv-hero__btn {
  appearance: none;
  border: 1px solid transparent;
  border-radius: 3px;
  padding: 13px 18px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  background: var(--mv-violet);
  color: #fff;
  cursor: pointer;
  transition: background-color 200ms ease, transform 200ms ease;
}
.mv-hero__btn:hover {
  background: #4c43cf;
  transform: translateY(-1px);
}
.mv-hero__btn--ghost {
  background: transparent;
  color: currentColor;
  border-color: currentColor;
  opacity: 0.65;
}
.mv-hero__btn--ghost:hover {
  background: transparent;
  opacity: 1;
}
.mv-hero__content {
  width: min(100%, 1180px);
  margin: 0 auto;
  padding: 64px 40px 56px;
}
@media (max-width: 720px) {
  .mv-hero__nav {
    padding: 16px 20px;
  }
  .mv-hero__links {
    display: none;
  }
  .mv-hero__content {
    padding: 40px 20px;
  }
  .mv-hero__headline {
    font-size: clamp(36px, 10vw, 54px);
  }
}
`;

const CENTERED_CSS = `
.mv-hero--centered .mv-hero__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  justify-content: center;
}
.mv-hero--centered .mv-hero__body {
  max-width: 52ch;
}
.mv-hero--centered .mv-hero__actions {
  justify-content: center;
}
.mv-hero__visual {
  width: 100%;
  margin-top: 42px;
}
.mv-product {
  width: min(100%, 660px);
  margin: 0 auto;
  border: 1px solid rgba(32, 33, 31, 0.14);
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 34px 80px -54px rgba(32, 33, 31, 0.55);
  overflow: hidden;
  text-align: left;
}
.mv-product__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 16px;
  border-bottom: 1px solid #e4e2dc;
  font-family: 'Spline Sans Mono', monospace;
  font-size: 8.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #85857f;
}
.mv-product__live {
  color: #6157e8;
}
.mv-product__grid {
  display: grid;
  grid-template-columns: 1.45fr 1fr;
}
.mv-product__main {
  padding: 22px 22px 20px;
  border-right: 1px solid #e4e2dc;
}
.mv-product__label {
  margin: 0 0 8px;
  font-family: 'Spline Sans Mono', monospace;
  font-size: 8.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #85857f;
}
.mv-product__metric {
  margin: 0;
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 44px;
  line-height: 1;
  letter-spacing: -0.02em;
}
.mv-product__meta {
  margin: 7px 0 0;
  font-size: 10.5px;
  color: #85857f;
  max-width: 24ch;
  line-height: 1.5;
}
.mv-bars {
  display: flex;
  align-items: flex-end;
  gap: 5px;
  height: 46px;
  margin-top: 18px;
}
.mv-bars span {
  flex: 1;
  background: #ddd9f9;
  border-radius: 2px 2px 0 0;
}
.mv-bars span:nth-child(3n) {
  background: #6157e8;
}
.mv-product__side {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 9px;
  background: #fbfaf7;
}
.mv-product__chip {
  border: 1px solid #e4e2dc;
  border-radius: 3px;
  padding: 10px;
  background: #fff;
}
.mv-product__chip p {
  margin: 0;
  font-size: 10px;
  font-weight: 600;
}
.mv-product__chip span {
  display: block;
  margin-top: 3px;
  font-size: 9px;
  color: #85857f;
  line-height: 1.45;
}
.mv-product__chip--accent {
  background: #20211f;
  border-color: #20211f;
  color: #f7f6f2;
}
.mv-product__chip--accent span {
  color: rgba(247, 246, 242, 0.6);
}
@media (max-width: 620px) {
  .mv-product__grid {
    grid-template-columns: 1fr;
  }
  .mv-product__main {
    border-right: 0;
    border-bottom: 1px solid #e4e2dc;
  }
  .mv-product__side {
    flex-direction: row;
  }
  .mv-product__chip {
    flex: 1;
  }
  .mv-product__chip:nth-child(3) {
    display: none;
  }
}
`;

const SPLIT_CSS = `
.mv-hero--split {
  background:
    radial-gradient(80% 90% at 100% 100%, rgba(97, 87, 232, 0.22) 0%, rgba(97, 87, 232, 0) 60%),
    #20211f;
  color: #f7f6f2;
}
.mv-hero--split .mv-hero__nav {
  border-color: rgba(247, 246, 242, 0.14);
}
.mv-hero--split .mv-hero__navcta {
  border-color: rgba(247, 246, 242, 0.4);
}
.mv-hero--split .mv-hero__content {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: clamp(28px, 5vw, 72px);
  align-items: center;
  flex: 1;
  width: min(100%, 1180px);
}
.mv-hero--split .mv-hero__body {
  opacity: 0.62;
}
.mv-hero--split .mv-hero__btn--ghost {
  color: #f7f6f2;
}
.mv-split-visual {
  border-radius: 6px;
  background: #dcd7ff;
  color: #20211f;
  padding: 22px;
  border: 1px solid rgba(247, 246, 242, 0.2);
  box-shadow: 0 40px 90px -40px rgba(0, 0, 0, 0.65);
}
.mv-split-visual__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font-family: 'Spline Sans Mono', monospace;
  font-size: 8.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(32, 33, 31, 0.55);
}
.mv-split-visual__metric {
  margin: 32px 0 4px;
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: clamp(56px, 8vw, 84px);
  line-height: 0.9;
  letter-spacing: -0.03em;
}
.mv-split-visual__meta {
  margin: 0;
  font-size: 11px;
  line-height: 1.5;
  color: rgba(32, 33, 31, 0.62);
  max-width: 28ch;
}
.mv-split-chart {
  display: flex;
  align-items: flex-end;
  gap: 5px;
  height: 76px;
  margin-top: 26px;
  border-bottom: 1px solid rgba(32, 33, 31, 0.18);
  padding-bottom: 1px;
}
.mv-split-chart span {
  flex: 1;
  background: rgba(32, 33, 31, 0.22);
  border-radius: 2px 2px 0 0;
}
.mv-split-chart span:nth-child(4n) {
  background: #6157e8;
}
.mv-split-visual__foot {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  font-family: 'Spline Sans Mono', monospace;
  font-size: 8px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(32, 33, 31, 0.5);
}
@media (max-width: 760px) {
  .mv-hero--split .mv-hero__content {
    grid-template-columns: 1fr;
    align-content: center;
  }
  .mv-split-visual {
    margin-top: 10px;
  }
  .mv-split-visual__metric {
    margin-top: 20px;
  }
}
`;

const GALLERY_CSS = `
.mv-hero--gallery .mv-hero__content {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
}
.mv-hero--gallery .mv-hero__headline {
  max-width: 14ch;
}
.mv-hero--gallery .mv-hero__body {
  max-width: 46ch;
}
.mv-gallery {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 40px;
}
.mv-gallery-card {
  border: 1px solid rgba(32, 33, 31, 0.14);
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
}
.mv-gallery-card__art {
  height: 152px;
  position: relative;
  overflow: hidden;
}
.mv-gallery-card:nth-child(1) .mv-gallery-card__art {
  background:
    radial-gradient(90% 100% at 20% 20%, #dcd7ff 0%, rgba(220, 215, 255, 0) 60%),
    linear-gradient(145deg, #20211f, #4b4472);
}
.mv-gallery-card:nth-child(2) .mv-gallery-card__art {
  background:
    radial-gradient(80% 90% at 80% 10%, #f2b8a4 0%, rgba(241, 138, 104, 0) 55%),
    linear-gradient(160deg, #efeee8, #d7d2ff);
}
.mv-gallery-card:nth-child(3) .mv-gallery-card__art {
  background:
    radial-gradient(100% 100% at 50% 100%, #6157e8 0%, rgba(97, 87, 232, 0) 60%),
    linear-gradient(140deg, #f7f6f2, #cbc5f7);
}
.mv-gallery-card__art::after {
  content: '';
  position: absolute;
  inset: 22px;
  border: 1px solid rgba(247, 246, 242, 0.45);
  border-radius: 2px;
}
.mv-gallery-card:nth-child(2) .mv-gallery-card__art::after,
.mv-gallery-card:nth-child(3) .mv-gallery-card__art::after {
  border-color: rgba(32, 33, 31, 0.22);
}
.mv-gallery-card__glyph {
  position: absolute;
  left: 30px;
  bottom: 22px;
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 42px;
  line-height: 1;
  color: #f7f6f2;
  z-index: 1;
}
.mv-gallery-card:nth-child(2) .mv-gallery-card__glyph,
.mv-gallery-card:nth-child(3) .mv-gallery-card__glyph {
  color: #20211f;
}
.mv-gallery-card__caption {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 13px;
}
.mv-gallery-card__caption p {
  margin: 0;
  font-size: 11.5px;
  font-weight: 500;
}
.mv-gallery-card__caption span {
  font-family: 'Spline Sans Mono', monospace;
  font-size: 8.5px;
  color: #85857f;
}
@media (max-width: 760px) {
  .mv-gallery {
    grid-template-columns: 1fr;
    margin-top: 28px;
  }
  .mv-gallery-card__art {
    height: 100px;
  }
  .mv-gallery-card:nth-child(3) {
    display: none;
  }
}
`;

function nav(content: HeroContent): string {
  return `<header class="mv-hero__nav">
    <span class="mv-hero__brand"><span class="mv-hero__brand-mark" aria-hidden="true"></span>${escapeHtml(content.brand)}</span>
    <span class="mv-hero__links"><span>Studio</span><span>Presets</span><span>Notes</span></span>
    <span class="mv-hero__navcta">Open studio</span>
  </header>`;
}

function actions(content: HeroContent): string {
  return `<div class="mv-hero__actions" data-step="actions">
    <button class="mv-hero__btn" type="button">${escapeHtml(content.primary)}</button>
    <button class="mv-hero__btn mv-hero__btn--ghost" type="button">${escapeHtml(content.secondary)}</button>
  </div>`;
}

function intro(content: HeroContent): string {
  return `<p class="mv-hero__eyebrow" data-step="headline">${escapeHtml(content.note)}</p>
  <h1 class="mv-hero__headline" data-step="headline">${escapeHtml(content.headline)}</h1>
  <p class="mv-hero__body" data-step="body">${escapeHtml(content.body)}</p>`;
}

function centeredMarkup(content: HeroContent): string {
  const bars = [32, 48, 38, 62, 54, 76, 60, 82, 68, 90, 58, 72]
    .map((h) => `<span style="height:${h}%"></span>`)
    .join('');
  return `<section class="mv-hero mv-hero--centered">
  ${nav(content)}
  <div class="mv-hero__content">
    ${intro(content)}
    ${actions(content)}
    <div class="mv-hero__visual" data-step="visual">
      <div class="mv-product">
        <div class="mv-product__bar"><span>Studio / overview</span><span class="mv-product__live">● Live preview</span></div>
        <div class="mv-product__grid">
          <div class="mv-product__main">
            <p class="mv-product__label">${escapeHtml(content.cardTitle)}</p>
            <p class="mv-product__metric">${escapeHtml(content.cardMetric)}</p>
            <p class="mv-product__meta">${escapeHtml(content.cardMeta)}</p>
            <div class="mv-bars" aria-hidden="true">${bars}</div>
          </div>
          <div class="mv-product__side">
            <div class="mv-product__chip"><p>Gentle lift</p><span>Button · 320ms · editorial</span></div>
            <div class="mv-product__chip"><p>Slide-in toast</p><span>Feedback · 480ms · editorial</span></div>
            <div class="mv-product__chip mv-product__chip--accent"><p>Sequence replay</p><span>Four steps · 1.9s total</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function splitMarkup(content: HeroContent): string {
  const bars = [30, 46, 58, 52, 70, 66, 84, 78, 96].map((h) => `<span style="height:${h}%"></span>`).join('');
  return `<section class="mv-hero mv-hero--split">
  ${nav(content)}
  <div class="mv-hero__content">
    <div>
      ${intro(content)}
      ${actions(content)}
    </div>
    <div class="mv-hero__visual" data-step="visual">
      <div class="mv-split-visual">
        <div class="mv-split-visual__top"><span>${escapeHtml(content.cardTitle)}</span><span>● Sequoia</span></div>
        <p class="mv-split-visual__metric">${escapeHtml(content.cardMetric)}</p>
        <p class="mv-split-visual__meta">${escapeHtml(content.cardMeta)}</p>
        <div class="mv-split-chart" aria-hidden="true">${bars}</div>
        <div class="mv-split-visual__foot"><span>Headline 0.0s</span><span>Cards 1.9s</span></div>
      </div>
    </div>
  </div>
</section>`;
}

function galleryMarkup(content: HeroContent): string {
  const items = [content.itemOne, content.itemTwo, content.itemThree];
  const glyphs = ['01', '02', '03'];
  return `<section class="mv-hero mv-hero--gallery">
  ${nav(content)}
  <div class="mv-hero__content">
    ${intro(content)}
    ${actions(content)}
    <div class="mv-hero__visual" data-step="visual">
      <div class="mv-gallery">
        ${items
          .map(
            (item, i) => `<article class="mv-gallery-card">
          <div class="mv-gallery-card__art"><span class="mv-gallery-card__glyph">${glyphs[i]}</span></div>
          <div class="mv-gallery-card__caption"><p>${escapeHtml(item)}</p><span>${2018 + i * 4}—${2019 + i * 4}</span></div>
        </article>`,
          )
          .join('')}
      </div>
    </div>
  </div>
</section>`;
}

export function buildHero(
  template: HeroTemplateId,
  content: HeroContent,
  steps: HeroStep[],
): BuildResult {
  const markup =
    template === 'hero-split'
      ? splitMarkup(content)
      : template === 'hero-gallery'
        ? galleryMarkup(content)
        : centeredMarkup(content);
  const templateCss =
    template === 'hero-split' ? SPLIT_CSS : template === 'hero-gallery' ? GALLERY_CSS : CENTERED_CSS;
  return {
    css: `${artCss()}${HERO_BASE}${templateCss}
${stepCss(steps)}`,
    html: art(markup, 'full'),
    note: 'This export is a complete, responsive hero. Each [data-step] element carries its own delay, duration and cubic-bezier curve. To replay the sequence, reload the section or re-add the animation styles.',
  };
}

export const heroPresets: Preset[] = HERO_TEMPLATES.map((template) => ({
  id: template.id,
  name: template.name,
  blurb: template.blurb,
  family: 'heroes' as const,
  controls: [],
  defaults: {},
  easing: 'editorial',
  layout: 'full' as const,
  build: () => buildHero(template.id, defaultHeroContent(template.id), defaultHeroSteps()),
}));

export const HERO_EASING_OPTIONS = EASINGS.filter((easing) => easing.id !== 'custom').map((easing) => ({
  label: easing.label,
  value: easing.id,
}));
