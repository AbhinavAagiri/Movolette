import { bezierCss } from '../easing';
import { art, artCss, escapeHtml, num, stateSelector, str } from '../css';
import type { Preset } from '../types';

const DEMO_HINT = `.mv-hint { margin: 18px 0 0; font-family: 'Spline Sans Mono', monospace; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: #85857F; text-align: center; }`;

function demoHint(text: string, demo: boolean): string {
  return demo ? `<p class="mv-hint">${escapeHtml(text)}</p>` : '';
}

export const buttonPresets: Preset[] = [
  {
    id: 'btn-lift',
    name: 'Gentle lift',
    blurb: 'A button that rises a few pixels and settles into a softer shadow.',
    family: 'buttons',
    easing: 'editorial',
    demoStates: [
      { id: 'idle', label: 'Idle' },
      { id: 'hover', label: 'Hover' },
      { id: 'active', label: 'Active' },
    ],
    controls: [
      { key: 'duration', label: 'Duration', type: 'range', min: 100, max: 900, step: 10, unit: 'ms' },
      { key: 'distance', label: 'Lift', type: 'range', min: 0, max: 12, step: 1, unit: 'px' },
      {
        key: 'shadow',
        label: 'Shadow',
        type: 'segmented',
        options: [
          { label: 'Soft', value: 'soft' },
          { label: 'Crisp', value: 'crisp' },
          { label: 'None', value: 'none' },
        ],
      },
    ],
    defaults: { duration: 320, distance: 4, shadow: 'soft' },
    build: ({ p, ease, demo }) => {
      const duration = num(p, 'duration', 320);
      const distance = num(p, 'distance', 4);
      const shadow = str(p, 'shadow', 'soft');
      const shadowValue =
        shadow === 'crisp'
          ? '0 6px 0 -2px rgba(32, 33, 31, 0.18)'
          : shadow === 'none'
            ? 'none'
            : '0 14px 26px -14px rgba(32, 33, 31, 0.55)';
      const hover = stateSelector('.mv-lift', demo, 'hover');
      const active = stateSelector('.mv-lift', demo, 'active');
      const css = `${artCss()}
.mv-lift {
  transition:
    transform ${duration}ms ${bezierCss(ease)},
    box-shadow ${duration}ms ${bezierCss(ease)},
    background-color ${Math.round(duration * 0.6)}ms ease;
  will-change: transform;
}
${hover} {
  transform: translateY(-${distance}px);
  box-shadow: ${shadowValue};
  background: #554adf;
}
${active} {
  transform: translateY(-${Math.max(0, Math.round(distance * 0.25))}px) scale(0.995);
  box-shadow: ${shadow === 'none' ? 'none' : '0 6px 14px -12px rgba(32, 33, 31, 0.7)'};
}
${DEMO_HINT}`;
      return {
        css,
        html: art(
          `<div class="mv-lift-wrap"><button class="mv-btn mv-lift" type="button">Open the studio</button>${demoHint('Hover, then press', demo)}</div>`,
        ),
        note: 'Hover and pressed states are CSS only. The studio button simulates them for you.',
      };
    },
  },
  {
    id: 'btn-press',
    name: 'Press and release',
    blurb: 'Tactile feedback for a button that should feel physical under the pointer.',
    family: 'buttons',
    easing: 'ease-out',
    demoStates: [
      { id: 'idle', label: 'Idle' },
      { id: 'hover', label: 'Hover' },
      { id: 'active', label: 'Active' },
    ],
    controls: [
      { key: 'duration', label: 'Duration', type: 'range', min: 60, max: 500, step: 10, unit: 'ms' },
      { key: 'scale', label: 'Press scale', type: 'range', min: 0.9, max: 1, step: 0.005 },
      { key: 'depth', label: 'Travel', type: 'range', min: 0, max: 5, step: 1, unit: 'px' },
    ],
    defaults: { duration: 140, scale: 0.965, depth: 1 },
    build: ({ p, ease, demo }) => {
      const duration = num(p, 'duration', 140);
      const scale = num(p, 'scale', 0.965);
      const depth = num(p, 'depth', 1);
      const hover = stateSelector('.mv-press', demo, 'hover');
      const active = stateSelector('.mv-press', demo, 'active');
      return {
        css: `${artCss()}
.mv-press {
  transition:
    transform ${duration}ms ${bezierCss(ease)},
    background-color ${duration}ms ease,
    box-shadow ${duration}ms ease;
}
${hover} {
  background: #554adf;
  box-shadow: 0 8px 18px -16px rgba(32, 33, 31, 0.8);
}
${active} {
  transform: translateY(${depth}px) scale(${scale});
  background: #4c43cf;
  box-shadow: inset 0 2px 5px rgba(20, 18, 40, 0.28);
}
${DEMO_HINT}`,
        html: art(
          `<div><button class="mv-btn mv-press" type="button">Create animation</button>${demoHint('Press and hold', demo)}</div>`,
        ),
      };
    },
  },
  {
    id: 'btn-bounce',
    name: 'Subtle bounce',
    blurb: 'A short overshoot on hover that gives a primary action some spring.',
    family: 'buttons',
    easing: 'spring',
    demoStates: [
      { id: 'idle', label: 'Idle' },
      { id: 'hover', label: 'Hover' },
    ],
    controls: [
      { key: 'duration', label: 'Duration', type: 'range', min: 240, max: 1000, step: 10, unit: 'ms' },
      { key: 'distance', label: 'Bounce height', type: 'range', min: 2, max: 16, step: 1, unit: 'px' },
      { key: 'scale', label: 'End scale', type: 'range', min: 1, max: 1.08, step: 0.005 },
    ],
    defaults: { duration: 480, distance: 7, scale: 1.02 },
    build: ({ p, ease, demo }) => {
      const duration = num(p, 'duration', 480);
      const distance = num(p, 'distance', 7);
      const scale = num(p, 'scale', 1.02);
      const hover = stateSelector('.mv-bounce', demo, 'hover');
      return {
        css: `${artCss()}
@keyframes mv-bounce-in {
  0% { transform: translateY(0) scale(1); }
  32% { transform: translateY(-${distance}px) scale(${scale}); }
  58% { transform: translateY(${Math.round(distance * 0.12)}px) scale(${1 + (scale - 1) * 0.4}); }
  78% { transform: translateY(-${Math.round(distance * 0.32)}px) scale(${(1 + scale) / 2}); }
  100% { transform: translateY(0) scale(${scale}); }
}
.mv-bounce {
  transform-origin: center;
}
${hover} {
  animation: mv-bounce-in ${duration}ms ${bezierCss(ease)} both;
  box-shadow: 0 14px 24px -18px rgba(32, 33, 31, 0.8);
}
${DEMO_HINT}`,
        html: art(
          `<div><button class="mv-btn mv-bounce" type="button">Try it again</button>${demoHint('Hover to replay', demo)}</div>`,
        ),
        note: 'The hover animation plays once and holds its final transform. Move away and back to replay it.',
      };
    },
  },
  {
    id: 'btn-arrow',
    name: 'Arrow follow',
    blurb: 'A quiet label with an arrow that travels toward the next screen.',
    family: 'buttons',
    easing: 'editorial',
    demoStates: [
      { id: 'idle', label: 'Idle' },
      { id: 'hover', label: 'Hover' },
    ],
    controls: [
      { key: 'duration', label: 'Duration', type: 'range', min: 120, max: 800, step: 10, unit: 'ms' },
      { key: 'distance', label: 'Arrow travel', type: 'range', min: 0, max: 14, step: 1, unit: 'px' },
      { key: 'label', label: 'Label', type: 'text', maxLength: 28 },
    ],
    defaults: { duration: 300, distance: 5, label: 'Read the release notes' },
    build: ({ p, ease, demo }) => {
      const duration = num(p, 'duration', 300);
      const distance = num(p, 'distance', 5);
      const label = str(p, 'label', 'Read the release notes');
      const hover = stateSelector('.mv-arrow-link', demo, 'hover');
      const focus = stateSelector('.mv-arrow-link', demo, 'focus');
      return {
        css: `${artCss()}
.mv-arrow-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 2px;
  color: var(--mv-ink);
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid var(--mv-line);
  transition: border-color ${duration}ms ease, color ${duration}ms ease;
}
.mv-arrow-link__arrow {
  display: inline-flex;
  transition: transform ${duration}ms ${bezierCss(ease)};
}
.mv-arrow-link__arrow svg {
  width: 16px;
  height: 16px;
}
${hover}, ${focus} {
  color: var(--mv-violet);
  border-color: var(--mv-violet);
}
${hover} .mv-arrow-link__arrow,
${focus} .mv-arrow-link__arrow {
  transform: translateX(${distance}px);
}
${DEMO_HINT}`,
        html: art(`<div>
  <a class="mv-arrow-link" href="#" aria-label="${escapeHtml(label)}">
    <span>${escapeHtml(label)}</span>
    <span class="mv-arrow-link__arrow" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><path d="M3 10h13M11.5 4.5 17 10l-5.5 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
  </a>
  ${demoHint('Hover the link', demo)}
</div>`),
      };
    },
  },
  {
    id: 'btn-underline',
    name: 'Underline reveal',
    blurb: 'A hairline that draws itself under a navigation link.',
    family: 'buttons',
    easing: 'editorial',
    demoStates: [
      { id: 'idle', label: 'Idle' },
      { id: 'hover', label: 'Hover' },
    ],
    controls: [
      { key: 'duration', label: 'Duration', type: 'range', min: 100, max: 900, step: 10, unit: 'ms' },
      { key: 'thickness', label: 'Thickness', type: 'range', min: 1, max: 4, step: 1, unit: 'px' },
      {
        key: 'origin',
        label: 'Draws from',
        type: 'segmented',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
        ],
      },
    ],
    defaults: { duration: 360, thickness: 1, origin: 'left' },
    build: ({ p, ease, demo }) => {
      const duration = num(p, 'duration', 360);
      const thickness = num(p, 'thickness', 1);
      const origin = str(p, 'origin', 'left');
      const hover = stateSelector('.mv-underline', demo, 'hover');
      const focus = stateSelector('.mv-underline', demo, 'focus');
      return {
        css: `${artCss()}
.mv-underline {
  position: relative;
  display: inline-block;
  padding: 6px 1px 8px;
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 34px;
  line-height: 1.1;
  letter-spacing: -0.015em;
  color: var(--mv-ink);
}
.mv-underline::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${thickness}px;
  background: var(--mv-violet);
  transform: scaleX(0);
  transform-origin: ${origin};
  transition: transform ${duration}ms ${bezierCss(ease)};
}
${hover}::after,
${focus}::after {
  transform: scaleX(1);
}
${DEMO_HINT}`,
        html: art(`<div>
  <a class="mv-underline" href="#">A quieter kind of motion</a>
  ${demoHint('Hover or focus', demo)}
</div>`),
      };
    },
  },
  {
    id: 'btn-gradient',
    name: 'Gradient shift',
    blurb: 'A slow wash of colour across a solid primary action.',
    family: 'buttons',
    easing: 'ease-out',
    demoStates: [
      { id: 'idle', label: 'Idle' },
      { id: 'hover', label: 'Hover' },
    ],
    controls: [
      { key: 'duration', label: 'Duration', type: 'range', min: 200, max: 1600, step: 20, unit: 'ms' },
      {
        key: 'tone',
        label: 'Gradient tone',
        type: 'select',
        options: [
          { label: 'Violet → indigo', value: 'indigo' },
          { label: 'Violet → graphite', value: 'graphite' },
          { label: 'Dusk → violet', value: 'dusk' },
        ],
      },
    ],
    defaults: { duration: 700, tone: 'indigo' },
    build: ({ p, ease, demo }) => {
      const duration = num(p, 'duration', 700);
      const tone = str(p, 'tone', 'indigo');
      const palette =
        tone === 'graphite'
          ? ['#6157E8', '#20211F']
          : tone === 'dusk'
            ? ['#2B2757', '#6157E8']
            : ['#6157E8', '#4C43CF'];
      const hover = stateSelector('.mv-gradient', demo, 'hover');
      return {
        css: `${artCss()}
.mv-gradient {
  background-image: linear-gradient(104deg, ${palette[0]} 0%, ${palette[1]} 52%, ${palette[0]} 100%);
  background-size: 240% 100%;
  background-position: 0% 50%;
  transition: background-position ${duration}ms ${bezierCss(ease)}, box-shadow ${duration}ms ease;
}
${hover} {
  background-position: 100% 50%;
  box-shadow: 0 16px 30px -24px rgba(32, 33, 31, 0.85);
}
${DEMO_HINT}`,
        html: art(
          `<div><button class="mv-btn mv-gradient" type="button">Start a new project</button>${demoHint('Hover to shift the colour', demo)}</div>`,
        ),
      };
    },
  },
  {
    id: 'btn-success',
    name: 'Loading to success',
    blurb: 'A publish button that waits, confirms, and quietly resets.',
    family: 'buttons',
    easing: 'editorial',
    controls: [
      { key: 'wait', label: 'Loading time', type: 'range', min: 400, max: 2600, step: 100, unit: 'ms' },
      { key: 'hold', label: 'Hold confirmation', type: 'range', min: 1000, max: 5000, step: 100, unit: 'ms' },
      {
        key: 'success',
        label: 'Success label',
        type: 'text',
        maxLength: 20,
      },
    ],
    defaults: { wait: 1200, hold: 2400, success: 'Published' },
    build: ({ p, ease, demo }) => {
      const wait = num(p, 'wait', 1200);
      const hold = num(p, 'hold', 2400);
      const success = str(p, 'success', 'Published');
      return {
        css: `${artCss()}
.mv-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}
.mv-success {
  position: relative;
  display: inline-grid;
  min-width: 146px;
  justify-items: center;
  align-items: center;
  transition: background-color ${Math.round(wait * 0.3)}ms ease, transform 220ms ${bezierCss(ease)};
}
.mv-success > * {
  grid-area: 1 / 1;
}
.mv-success__label,
.mv-success__done {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  transition: opacity 180ms ease, transform 260ms ${bezierCss(ease)};
}
.mv-success__spinner {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  opacity: 0;
  transform: scale(0.7);
  transition: opacity 180ms ease, transform 180ms ease;
}
.mv-success__check {
  width: 15px;
  height: 15px;
  opacity: 0;
  transform: scale(0.6);
  transition: opacity 200ms ease, transform 320ms ${bezierCss(ease)};
}
.mv-success__check svg {
  width: 15px;
  height: 15px;
}
.mv-success__done {
  opacity: 0;
  transform: translateY(4px);
}
.mv-success.is-loading .mv-success__label {
  opacity: 0;
  transform: translateY(-3px);
}
.mv-success.is-loading .mv-success__spinner {
  opacity: 1;
  transform: scale(1);
  animation: mv-success-spin 720ms linear infinite;
}
.mv-success.is-loading {
  background: #554adf;
}
.mv-success.is-done {
  background: #20211F;
}
.mv-success.is-done .mv-success__label {
  opacity: 0;
}
.mv-success.is-done .mv-success__spinner {
  opacity: 0;
}
.mv-success.is-done .mv-success__check {
  opacity: 1;
  transform: scale(1);
  animation: mv-success-check 420ms ${bezierCss(ease)} both;
}
.mv-success.is-done .mv-success__done {
  opacity: 1;
  transform: none;
}
.mv-success.is-done .mv-success__check {
  transform: translateX(-34px);
}
.mv-success.is-done .mv-success__done {
  transform: translateX(9px);
}
@keyframes mv-success-spin {
  to { transform: rotate(360deg); }
}
@keyframes mv-success-check {
  from { transform: translateX(-34px) scale(0.6); }
  to { transform: translateX(-34px) scale(1); }
}
${DEMO_HINT}`,
        html: art(`<div>
  <button class="mv-btn mv-success" type="button" aria-live="polite">
    <span class="mv-success__label">Publish changes</span>
    <span class="mv-success__spinner" aria-hidden="true"></span>
    <span class="mv-success__check" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><path d="M4 10.5 8 14.5 16 5.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
    <span class="mv-success__done">${escapeHtml(success)}</span>
  </button>
  ${demoHint('Click to publish', demo)}
  <span class="mv-sr" role="status"></span>
</div>`),
        js: `(function () {
  var btn = document.querySelector('.mv-success');
  var status = document.querySelector('.mv-sr');
  if (!btn) return;
  var wait = ${wait};
  var hold = ${hold};
  var timers = [];
  btn.addEventListener('click', function () {
    if (btn.classList.contains('is-loading') || btn.classList.contains('is-done')) return;
    timers.forEach(clearTimeout);
    btn.classList.remove('is-done');
    btn.classList.add('is-loading');
    btn.setAttribute('aria-busy', 'true');
    timers.push(setTimeout(function () {
      btn.classList.remove('is-loading');
      btn.classList.add('is-done');
      btn.setAttribute('aria-busy', 'false');
      if (status) status.textContent = 'Published successfully';
      timers.push(setTimeout(function () {
        btn.classList.remove('is-done');
        if (status) status.textContent = '';
      }, hold));
    }, wait));
  });
})();`,
        note: 'JavaScript drives the loading and success states. The exported JS is included and uses the same timings as the preview.',
      };
    },
  },
];
