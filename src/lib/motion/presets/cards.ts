import { bezierCss } from '../easing';
import { art, artCss, num, stateSelector } from '../css';
import type { Preset } from '../types';

const CARD_BASE = `
.mv-card-demo {
  width: 270px;
}
.mv-cover {
  position: relative;
  overflow: hidden;
  height: 132px;
  background:
    radial-gradient(90% 120% at 18% 10%, #DCD7FF 0%, rgba(220, 215, 255, 0) 58%),
    linear-gradient(140deg, #20211F 0%, #34305e 62%, #6157E8 100%);
}
.mv-cover::after {
  content: '';
  position: absolute;
  width: 150px;
  height: 150px;
  border: 1px solid rgba(247, 246, 242, 0.32);
  border-radius: 50%;
  right: -42px;
  bottom: -64px;
}
.mv-cover__index {
  position: absolute;
  left: 14px;
  top: 12px;
  font-family: 'Spline Sans Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.14em;
  color: rgba(247, 246, 242, 0.72);
  text-transform: uppercase;
}
.mv-cover__glyph {
  position: absolute;
  left: 14px;
  bottom: 8px;
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 52px;
  line-height: 1;
  color: #F7F6F2;
}
.mv-card__body {
  padding: 15px 16px 17px;
}
.mv-card__label {
  margin: 0 0 6px;
  font-family: 'Spline Sans Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #85857F;
}
.mv-card__title {
  margin: 0 0 4px;
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 22px;
  line-height: 1.1;
  letter-spacing: -0.012em;
}
.mv-card__text {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.5;
  color: #6c6c66;
}
.mv-hint {
  margin: 18px 0 0;
  text-align: center;
  font-family: 'Spline Sans Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #85857F;
}
`;

const cardMarkup = `<article class="mv-card mv-card-demo">
  <div class="mv-cover">
    <span class="mv-cover__index">STUDY / 06</span>
    <span class="mv-cover__glyph" aria-hidden="true">m</span>
  </div>
  <div class="mv-card__body">
    <p class="mv-card__label">CASE STUDY</p>
    <h3 class="mv-card__title">A slower kind of interface</h3>
    <p class="mv-card__text">Notes on pacing, restraint, and the choreography of small moments.</p>
  </div>
</article>`;

export const cardPresets: Preset[] = [
  {
    id: 'card-lift',
    name: 'Card lift',
    blurb: 'A hover state that raises a card and deepens its shadow, without moving its content.',
    family: 'cards',
    easing: 'editorial',
    demoStates: [
      { id: 'idle', label: 'Idle' },
      { id: 'hover', label: 'Hover' },
    ],
    controls: [
      { key: 'duration', label: 'Duration', type: 'range', min: 120, max: 800, step: 10, unit: 'ms' },
      { key: 'distance', label: 'Lift', type: 'range', min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'scale', label: 'Scale', type: 'range', min: 1, max: 1.05, step: 0.005 },
      { key: 'shadow', label: 'Shadow', type: 'range', min: 0, max: 40, step: 1, unit: '%' },
    ],
    defaults: { duration: 360, distance: 6, scale: 1.012, shadow: 22 },
    build: ({ p, ease, demo }) => {
      const duration = num(p, 'duration', 360);
      const distance = num(p, 'distance', 6);
      const scale = num(p, 'scale', 1.012);
      const shadow = num(p, 'shadow', 22);
      const hover = stateSelector('.mv-card-demo', demo, 'hover');
      return {
        css: `${artCss()}${CARD_BASE}
.mv-card-demo {
  transition:
    transform ${duration}ms ${bezierCss(ease)},
    box-shadow ${duration}ms ${bezierCss(ease)},
    border-color ${duration}ms ease;
  will-change: transform;
}
${hover} {
  transform: translateY(-${distance}px) scale(${scale});
  border-color: #d5d2c9;
  box-shadow: 0 ${shadow}px 44px -32px rgba(32, 33, 31, 0.6);
}`,
        html: art(`<div>${cardMarkup}${demo ? '<p class="mv-hint">Hover or focus the card</p>' : ''}</div>`),
      };
    },
  },
  {
    id: 'card-zoom',
    name: 'Image zoom',
    blurb: 'The cover image eases closer while the card itself stays put.',
    family: 'cards',
    easing: 'editorial',
    demoStates: [
      { id: 'idle', label: 'Idle' },
      { id: 'hover', label: 'Hover' },
    ],
    controls: [
      { key: 'duration', label: 'Duration', type: 'range', min: 200, max: 1400, step: 20, unit: 'ms' },
      { key: 'zoom', label: 'Zoom', type: 'range', min: 1, max: 1.2, step: 0.01 },
    ],
    defaults: { duration: 800, zoom: 1.07 },
    build: ({ p, ease, demo }) => {
      const duration = num(p, 'duration', 800);
      const zoom = num(p, 'zoom', 1.07);
      const hover = stateSelector('.mv-zoom-card', demo, 'hover');
      return {
        css: `${artCss()}${CARD_BASE}
.mv-zoom-card {
  cursor: pointer;
}
.mv-zoom-card .mv-cover {
  position: relative;
}
.mv-zoom-card .mv-cover::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(90% 120% at 18% 10%, #DCD7FF 0%, rgba(220, 215, 255, 0) 58%),
    linear-gradient(140deg, #20211F 0%, #34305e 62%, #6157E8 100%);
  transition: transform ${duration}ms ${bezierCss(ease)};
  transform-origin: 55% 45%;
}
.mv-zoom-card .mv-cover::after {
  z-index: 1;
}
.mv-zoom-card .mv-cover__index,
.mv-zoom-card .mv-cover__glyph {
  z-index: 2;
}
.mv-zoom-card .mv-cover::before {
  z-index: 0;
}
.mv-zoom-card .mv-cover > * {
  position: absolute;
}
${hover} .mv-cover::before {
  transform: scale(${zoom});
}`,
        html: art(`<div>${cardMarkup}${demo ? '<p class="mv-hint">Hover to bring the image closer</p>' : ''}</div>`),
      };
    },
  },
  {
    id: 'card-reveal',
    name: 'Reveal on hover',
    blurb: 'A caption rises out of the artwork when the card is explored.',
    family: 'cards',
    easing: 'editorial',
    demoStates: [
      { id: 'idle', label: 'Idle' },
      { id: 'hover', label: 'Hover' },
    ],
    controls: [
      { key: 'duration', label: 'Duration', type: 'range', min: 150, max: 800, step: 10, unit: 'ms' },
      { key: 'distance', label: 'Slide', type: 'range', min: 8, max: 60, step: 2, unit: 'px' },
      { key: 'overlay', label: 'Overlay', type: 'range', min: 0, max: 90, step: 5, unit: '%' },
    ],
    defaults: { duration: 420, distance: 26, overlay: 55 },
    build: ({ p, ease, demo }) => {
      const duration = num(p, 'duration', 420);
      const distance = num(p, 'distance', 26);
      const overlay = num(p, 'overlay', 55);
      const hover = stateSelector('.mv-reveal-card', demo, 'hover');
      return {
        css: `${artCss()}${CARD_BASE}
.mv-reveal-card {
  cursor: pointer;
}
.mv-reveal-card .mv-cover {
  height: 180px;
}
.mv-reveal-card .mv-cover::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(to top, rgba(24, 24, 22, ${overlay / 100}), rgba(24, 24, 22, 0));
  opacity: 0;
  transition: opacity ${duration}ms ease;
}
.mv-reveal-card .mv-reveal-caption {
  position: absolute;
  left: 15px;
  right: 15px;
  bottom: 13px;
  z-index: 2;
  color: #f7f6f2;
  transform: translateY(${distance}px);
  opacity: 0;
  transition:
    transform ${duration}ms ${bezierCss(ease)},
    opacity ${duration}ms ease;
}
.mv-reveal-caption__title {
  margin: 0 0 2px;
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 21px;
  line-height: 1.1;
}
.mv-reveal-caption__meta {
  margin: 0;
  font-family: 'Spline Sans Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(247, 246, 242, 0.7);
}
${hover} .mv-cover::before {
  opacity: 1;
}
${hover} .mv-reveal-caption {
  opacity: 1;
  transform: translateY(0);
}
.mv-reveal-card .mv-cover__glyph {
  transition: transform ${duration}ms ${bezierCss(ease)};
}
${hover} .mv-cover__glyph {
  transform: translateY(-4px);
}`,
        html: art(`<div>
  <article class="mv-card mv-card-demo mv-reveal-card">
    <div class="mv-cover">
      <span class="mv-cover__index">FIELD / 12</span>
      <span class="mv-cover__glyph" aria-hidden="true">m</span>
      <div class="mv-reveal-caption">
        <p class="mv-reveal-caption__title">Notes on pacing</p>
        <p class="mv-reveal-caption__meta">6 MIN READ</p>
      </div>
    </div>
    <div class="mv-card__body">
      <p class="mv-card__label">FIELD NOTES</p>
      <h3 class="mv-card__title">The space between frames</h3>
      <p class="mv-card__text">Timing is a form of editing. Here is how we choose ours.</p>
    </div>
  </article>
  ${demo ? '<p class="mv-hint">Hover or focus the card</p>' : ''}
</div>`),
      };
    },
  },
  {
    id: 'card-stagger',
    name: 'Staggered entrance',
    blurb: 'Three cards arrive on a shared beat, offset just enough to read as a sequence.',
    family: 'cards',
    easing: 'editorial',
    controls: [
      { key: 'duration', label: 'Duration', type: 'range', min: 200, max: 1200, step: 20, unit: 'ms' },
      { key: 'stagger', label: 'Stagger', type: 'range', min: 20, max: 400, step: 10, unit: 'ms' },
      { key: 'distance', label: 'Rise', type: 'range', min: 0, max: 60, step: 2, unit: 'px' },
    ],
    defaults: { duration: 700, stagger: 110, distance: 26 },
    build: ({ p, ease, demo }) => {
      const duration = num(p, 'duration', 700);
      const stagger = num(p, 'stagger', 110);
      const distance = num(p, 'distance', 26);
      const items = [
        ['01', 'CRAFT', 'The weight of a shadow'],
        ['02', 'TIMING', 'A pause before it moves'],
        ['03', 'RHYTHM', 'One beat, then another'],
      ];
      return {
        css: `${artCss()}${CARD_BASE}
@keyframes mv-card-in {
  from { opacity: 0; transform: translateY(${distance}px); }
  to { opacity: 1; transform: translateY(0); }
}
.mv-card-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  width: min(100%, 760px);
}
.mv-card-row .mv-card {
  animation: mv-card-in ${duration}ms ${bezierCss(ease)} both;
  animation-delay: calc(var(--mv-i) * ${stagger}ms);
  border-radius: 4px;
}
.mv-card-row .mv-cover {
  height: 92px;
}
.mv-card-row .mv-cover__glyph {
  font-size: 34px;
  bottom: 6px;
}
.mv-card-row .mv-card__title {
  font-size: 18px;
}
.mv-card-row .mv-card__body {
  padding: 12px 13px 15px;
}
@media (max-width: 680px) {
  .mv-card-row {
    grid-template-columns: 1fr;
    width: min(100%, 300px);
  }
  .mv-card-row .mv-cover {
    height: 78px;
  }
}`,
        html: art(`<div>
  <div class="mv-card-row">
    ${items
      .map(
        (item, i) => `<article class="mv-card" style="--mv-i:${i}">
      <div class="mv-cover"><span class="mv-cover__index">${item[0]} / ${item[1]}</span><span class="mv-cover__glyph" aria-hidden="true">m</span></div>
      <div class="mv-card__body"><p class="mv-card__label">${item[1]}</p><h3 class="mv-card__title">${item[2]}</h3></div>
    </article>`,
      )
      .join('')}
  </div>
  ${demo ? '<p class="mv-hint">The cards share one timeline</p>' : ''}
</div>`),
      };
    },
  },
  {
    id: 'list-reveal',
    name: 'Sequential list',
    blurb: 'Rows settle into a list one after another, useful for changelogs and search results.',
    family: 'cards',
    easing: 'editorial',
    controls: [
      { key: 'duration', label: 'Duration', type: 'range', min: 150, max: 900, step: 10, unit: 'ms' },
      { key: 'stagger', label: 'Stagger', type: 'range', min: 20, max: 300, step: 10, unit: 'ms' },
      { key: 'distance', label: 'Rise', type: 'range', min: 0, max: 40, step: 2, unit: 'px' },
    ],
    defaults: { duration: 520, stagger: 80, distance: 14 },
    build: ({ p, ease }) => {
      const duration = num(p, 'duration', 520);
      const stagger = num(p, 'stagger', 80);
      const distance = num(p, 'distance', 14);
      const rows = [
        ['01', 'Design tokens', 'Updated', '2m ago'],
        ['02', 'Motion study', 'In review', '18m ago'],
        ['03', 'Easing library', 'Published', '1h ago'],
        ['04', 'Hero sequences', 'Draft', '3h ago'],
        ['05', 'Link export', 'Published', 'Yesterday'],
      ];
      return {
        css: `${artCss()}
@keyframes mv-row-in {
  from { opacity: 0; transform: translateY(${distance}px); }
  to { opacity: 1; transform: translateY(0); }
}
.mv-list {
  width: min(100%, 520px);
  border-top: 1px solid var(--mv-line);
}
.mv-list__row {
  display: grid;
  grid-template-columns: 34px 1fr auto auto;
  align-items: center;
  gap: 12px;
  padding: 13px 2px;
  border-bottom: 1px solid var(--mv-line);
  animation: mv-row-in ${duration}ms ${bezierCss(ease)} both;
  animation-delay: calc(var(--mv-i) * ${stagger}ms);
}
.mv-list__num {
  font-family: 'Spline Sans Mono', monospace;
  font-size: 9px;
  color: #85857F;
  letter-spacing: 0.08em;
}
.mv-list__name {
  font-size: 13px;
  font-weight: 500;
}
.mv-list__state {
  font-family: 'Spline Sans Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #4c43cf;
  background: #eeecff;
  border-radius: 2px;
  padding: 3px 6px;
}
.mv-list__time {
  font-family: 'Spline Sans Mono', monospace;
  font-size: 9px;
  color: #85857F;
  min-width: 54px;
  text-align: right;
}
.mv-list__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 12px;
}
.mv-list__head p {
  margin: 0;
}
@media (max-width: 480px) {
  .mv-list__row {
    grid-template-columns: 28px 1fr auto;
  }
  .mv-list__time {
    display: none;
  }
}`,
        html: art(`<div style="width:100%;display:flex;justify-content:center">
  <div class="mv-list">
    <div class="mv-list__head">
      <p class="mv-mono" style="color:#85857F">RECENT WORK</p>
      <p class="mv-mono" style="color:#6157E8">05 FILES</p>
    </div>
    ${rows
      .map(
        (row, i) => `<div class="mv-list__row" style="--mv-i:${i}">
      <span class="mv-list__num">${row[0]}</span>
      <span class="mv-list__name">${row[1]}</span>
      <span class="mv-list__state">${row[2]}</span>
      <span class="mv-list__time">${row[3]}</span>
    </div>`,
      )
      .join('')}
  </div>
</div>`),
      };
    },
  },
];
