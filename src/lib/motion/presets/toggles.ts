import { bezierCss } from '../easing';
import { art, artCss, escapeHtml, num } from '../css';
import type { Preset } from '../types';

const HINT = `.mv-hint { margin: 20px 0 0; text-align: center; font-family: 'Spline Sans Mono', monospace; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: #85857F; }`;

export const togglePresets: Preset[] = [
  {
    id: 'toggle-switch',
    name: 'Animated switch',
    blurb: 'A switch with a knob that slides and settles with a little weight.',
    family: 'toggles',
    easing: 'spring',
    controls: [
      { key: 'duration', label: 'Duration', type: 'range', min: 80, max: 700, step: 10, unit: 'ms' },
      { key: 'size', label: 'Size', type: 'range', min: 20, max: 34, step: 1, unit: 'px', note: 'Track height' },
    ],
    defaults: { duration: 320, size: 24 },
    build: ({ p, ease, demo }) => {
      const duration = num(p, 'duration', 320);
      const size = num(p, 'size', 24);
      const knob = size - 6;
      const travel = size * 1.9 - size;
      return {
        css: `${artCss()}
.mv-switch-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  width: min(100%, 360px);
  border: 1px solid var(--mv-line);
  border-radius: 5px;
  padding: 18px;
  background: #fff;
}
.mv-switch {
  position: relative;
  flex: none;
  width: ${Math.round(size * 1.9)}px;
  height: ${size}px;
  border-radius: 99px;
  background: #d5d2c9;
  transition: background-color ${duration}ms ${bezierCss(ease)};
  margin-top: 2px;
}
.mv-switch[aria-checked="true"] {
  background: var(--mv-violet);
}
.mv-switch__knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: ${knob}px;
  height: ${knob}px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(32, 33, 31, 0.24);
  transition: transform ${duration}ms ${bezierCss(ease)};
}
.mv-switch[aria-checked="true"] .mv-switch__knob {
  transform: translateX(${Math.round(travel - 3)}px);
}
.mv-switch:active .mv-switch__knob {
  transform: scale(0.92);
}
.mv-switch[aria-checked="true"]:active .mv-switch__knob {
  transform: translateX(${Math.round(travel - 3)}px) scale(0.92);
}
.mv-switch:focus-visible {
  outline: 2px solid var(--mv-violet);
  outline-offset: 3px;
}
.mv-switch__copy {
  min-width: 0;
}
.mv-switch__title {
  margin: 0 0 3px;
  font-size: 13px;
  font-weight: 600;
}
.mv-switch__body {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.5;
  color: #6c6c66;
}
.mv-switch__state {
  margin: 10px 0 0;
  font-family: 'Spline Sans Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.1em;
  color: #85857F;
}
${HINT}`,
        html: art(`<div>
  <div class="mv-switch-row">
    <button class="mv-switch" type="button" role="switch" aria-checked="true" aria-labelledby="mv-switch-title">
      <span class="mv-switch__knob" aria-hidden="true"></span>
    </button>
    <div class="mv-switch__copy">
      <p class="mv-switch__title" id="mv-switch-title">Play previews automatically</p>
      <p class="mv-switch__body">Preview animations run whenever settings change.</p>
      <p class="mv-switch__state" data-switch-state>ON</p>
    </div>
  </div>
  ${demo ? '<p class="mv-hint">Click the switch, or use Space</p>' : ''}
</div>`),
        js: `(function () {
  var button = document.querySelector('.mv-switch');
  var state = document.querySelector('[data-switch-state]');
  if (!button) return;
  button.addEventListener('click', function () {
    var next = button.getAttribute('aria-checked') !== 'true';
    button.setAttribute('aria-checked', next ? 'true' : 'false');
    if (state) state.textContent = next ? 'ON' : 'OFF';
  });
})();`,
      };
    },
  },
  {
    id: 'checkbox-check',
    name: 'Checkbox draw',
    blurb: 'A checkmark that draws itself with a single confident stroke.',
    family: 'toggles',
    easing: 'editorial',
    controls: [
      { key: 'duration', label: 'Duration', type: 'range', min: 120, max: 800, step: 10, unit: 'ms' },
      { key: 'thickness', label: 'Stroke', type: 'range', min: 1, max: 3, step: 0.5, unit: 'px' },
    ],
    defaults: { duration: 360, thickness: 2 },
    build: ({ p, ease, demo }) => {
      const duration = num(p, 'duration', 360);
      const thickness = num(p, 'thickness', 2);
      return {
        css: `${artCss()}
.mv-check-row {
  width: min(100%, 360px);
  border: 1px solid var(--mv-line);
  border-radius: 5px;
  padding: 18px;
  background: #fff;
}
.mv-check {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}
.mv-check__input {
  position: absolute;
  width: 20px;
  height: 20px;
  opacity: 0;
  margin: 0;
  cursor: pointer;
}
.mv-check__box {
  flex: none;
  width: 20px;
  height: 20px;
  border: 1.5px solid #d5d2c9;
  border-radius: 3px;
  background: #fff;
  display: grid;
  place-items: center;
  transition:
    background-color ${duration}ms ease,
    border-color ${duration}ms ease;
}
.mv-check__box svg {
  width: 14px;
  height: 14px;
  overflow: visible;
}
.mv-check__box path {
  fill: none;
  stroke: #fff;
  stroke-width: ${thickness};
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
  transition: stroke-dashoffset ${duration}ms ${bezierCss(ease)};
}
.mv-check__input:checked + .mv-check__box {
  background: var(--mv-violet);
  border-color: var(--mv-violet);
}
.mv-check__input:checked + .mv-check__box path {
  stroke-dashoffset: 0;
}
.mv-check__input:focus-visible + .mv-check__box {
  outline: 2px solid var(--mv-violet);
  outline-offset: 2px;
}
.mv-check__title {
  margin: 1px 0 3px;
  font-size: 13px;
  font-weight: 600;
}
.mv-check__body {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.5;
  color: #6c6c66;
}
.mv-check__meta {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--mv-line);
  font-family: 'Spline Sans Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.1em;
  color: #85857F;
}
${HINT}`,
        html: art(`<div>
  <div class="mv-check-row">
    <label class="mv-check">
      <input class="mv-check__input" type="checkbox" />
      <span class="mv-check__box" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3 8.5 6.3 12 13 4.5" /></svg></span>
      <span>
        <span class="mv-check__title" style="display:block">Include in release notes</span>
        <span class="mv-check__body" style="display:block">Your team will see this animation in the weekly digest.</span>
      </span>
    </label>
    <p class="mv-check__meta">OPTIONAL — CAN BE CHANGED LATER</p>
  </div>
  ${demo ? '<p class="mv-hint">Click the checkbox</p>' : ''}
</div>`),
        js: demo
          ? `setTimeout(function () {
  var input = document.querySelector('.mv-check__input');
  if (input) { input.checked = true; }
}, 700);`
          : undefined,
      };
    },
  },
  {
    id: 'input-focus',
    name: 'Input focus',
    blurb: 'A field that quietly comes forward when it is ready for your attention.',
    family: 'toggles',
    easing: 'ease-out',
    controls: [
      { key: 'duration', label: 'Duration', type: 'range', min: 80, max: 500, step: 10, unit: 'ms' },
      { key: 'ring', label: 'Focus ring', type: 'range', min: 1, max: 6, step: 1, unit: 'px' },
      { key: 'label', label: 'Field label', type: 'text', maxLength: 30 },
    ],
    defaults: { duration: 180, ring: 3, label: 'Email address' },
    build: ({ p, ease, demo }) => {
      const duration = num(p, 'duration', 180);
      const ring = num(p, 'ring', 3);
      const label = p.label === 'Email address' ? 'Email address' : String(p.label || 'Email address');
      return {
        css: `${artCss()}
.mv-field {
  width: min(100%, 340px);
}
.mv-field__label {
  display: block;
  font-family: 'Spline Sans Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #85857F;
  margin-bottom: 8px;
  transition: color ${duration}ms ease;
}
.mv-field__shell {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #d5d2c9;
  border-radius: 3px;
  background: #faf9f6;
  padding: 12px 13px;
  transition:
    border-color ${duration}ms ease,
    background-color ${duration}ms ease,
    box-shadow ${duration}ms ${bezierCss(ease)};
}
.mv-field__input {
  flex: 1;
  border: 0;
  background: transparent;
  outline: none;
  font-family: inherit;
  font-size: 13px;
  color: var(--mv-ink);
  min-width: 0;
}
.mv-field__input::placeholder {
  color: #a3a19a;
}
.mv-field:focus-within .mv-field__shell {
  border-color: var(--mv-violet);
  background: #fff;
  box-shadow: 0 0 0 ${ring}px rgba(97, 87, 232, 0.16);
}
.mv-field:focus-within .mv-field__label {
  color: var(--mv-violet);
}
.mv-field__mark {
  width: 16px;
  height: 16px;
  color: #a3a19a;
  transition: color ${duration}ms ease;
}
.mv-field:focus-within .mv-field__mark {
  color: var(--mv-violet);
}
.mv-field__hint {
  margin: 9px 0 0;
  font-size: 11px;
  color: #85857F;
  transition: color ${duration}ms ease;
}
.mv-field:focus-within .mv-field__hint {
  color: #4c43cf;
}
.mv-field__meta {
  margin: 22px 0 0;
  padding-top: 14px;
  border-top: 1px solid var(--mv-line);
  font-family: 'Spline Sans Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.1em;
  color: #85857F;
}
${HINT}`,
        html: art(`<div>
  <div class="mv-field">
    <label class="mv-field__label" for="mv-email">${escapeHtml(label.toUpperCase())}</label>
    <div class="mv-field__shell">
      <span class="mv-field__mark" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><rect x="2.5" y="4" width="15" height="12" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="m4 6 6 4.5L16 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></span>
      <input class="mv-field__input" id="mv-email" type="email" placeholder="you@studio.com" />
    </div>
    <p class="mv-field__hint">We will only use this to send release notes.</p>
    <p class="mv-field__meta">FOCUS TO SEE THE TRANSITION</p>
  </div>
  ${demo ? '<p class="mv-hint">Click the field, or watch it focus</p>' : ''}
</div>`),
        js: demo
          ? `setTimeout(function () {
  var input = document.querySelector('.mv-field__input');
  if (input) input.focus({ preventScroll: true });
}, 700);`
          : undefined,
      };
    },
  },
  {
    id: 'feedback-state',
    name: 'Success and error',
    blurb: 'A form response that arrives with confidence, and shakes when it should.',
    family: 'toggles',
    easing: 'editorial',
    controls: [
      { key: 'duration', label: 'Duration', type: 'range', min: 150, max: 900, step: 10, unit: 'ms' },
      { key: 'distance', label: 'Rise', type: 'range', min: 0, max: 40, step: 2, unit: 'px' },
    ],
    defaults: { duration: 420, distance: 12 },
    build: ({ p, ease, demo }) => {
      const duration = num(p, 'duration', 420);
      const distance = num(p, 'distance', 12);
      return {
        css: `${artCss()}
.mv-feedback {
  width: min(100%, 380px);
}
.mv-feedback__card {
  border: 1px solid var(--mv-line);
  border-radius: 6px;
  background: #fff;
  padding: 22px;
}
.mv-feedback__label {
  display: block;
  margin-bottom: 8px;
  font-family: 'Spline Sans Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #85857F;
}
.mv-feedback__input {
  width: 100%;
  border: 1px solid #d5d2c9;
  border-radius: 3px;
  background: #faf9f6;
  padding: 11px 12px;
  font-family: inherit;
  font-size: 13px;
  outline: none;
  transition: border-color ${duration}ms ease, box-shadow ${duration}ms ease, background ${duration}ms ease;
}
.mv-feedback.is-error .mv-feedback__input {
  border-color: #d26443;
  background: #fff7f4;
}
.mv-feedback.is-error .mv-feedback__input {
  box-shadow: 0 0 0 3px rgba(241, 138, 104, 0.18);
}
.mv-feedback__buttons {
  display: flex;
  gap: 8px;
  margin-top: 14px;
  flex-wrap: wrap;
}
.mv-feedback__banner {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 16px;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 12px 13px;
  font-size: 11.5px;
  line-height: 1.5;
  opacity: 0;
  transform: translateY(${distance}px);
  transition:
    opacity ${duration}ms ${bezierCss(ease)},
    transform ${duration}ms ${bezierCss(ease)};
}
.mv-feedback__banner.is-visible {
  opacity: 1;
  transform: translateY(0);
}
.mv-feedback__banner--success {
  background: #eeecff;
  border-color: #d3cdff;
  color: #3f378f;
}
.mv-feedback__banner--error {
  background: #fdf0eb;
  border-color: #f5c9ba;
  color: #8c3d25;
}
.mv-feedback__icon {
  flex: none;
  width: 16px;
  height: 16px;
}
.mv-feedback__title {
  margin: 0 0 2px;
  font-weight: 600;
}
.mv-feedback.is-error .mv-feedback__input {
  animation: mv-feedback-shake 380ms ease both;
}
@keyframes mv-feedback-shake {
  0%, 100% { transform: translateX(0); }
  22% { transform: translateX(-4px); }
  44% { transform: translateX(3px); }
  66% { transform: translateX(-2px); }
  82% { transform: translateX(1px); }
}
${HINT}`,
        html: art(`<div>
  <div class="mv-feedback">
    <div class="mv-feedback__card">
      <label class="mv-feedback__label" for="mv-project">Project name</label>
      <input class="mv-feedback__input" id="mv-project" value="Movolette" />
      <div class="mv-feedback__buttons">
        <button class="mv-btn" type="button" data-feedback="success">Save project</button>
        <button class="mv-btn mv-btn--ghost" type="button" data-feedback="error">Try an error</button>
      </div>
      <div class="mv-feedback__banner mv-feedback__banner--success" role="status" aria-live="polite">
        <span class="mv-feedback__icon" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.4"/><path d="m6.5 10.2 2.4 2.4 4.7-5.1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        <div><p class="mv-feedback__title">Project saved</p><p style="margin:0">Your changes are stored in this browser.</p></div>
      </div>
    </div>
  </div>
  ${demo ? '<p class="mv-hint">Two outcomes, one component</p>' : ''}
</div>`),
        js: `(function () {
  var root = document.querySelector('.mv-feedback');
  var banner = document.querySelector('.mv-feedback__banner');
  var title = banner ? banner.querySelector('.mv-feedback__title') : null;
  var copy = title && title.parentElement ? title.parentElement.querySelector('p:last-child') : null;
  if (!root || !banner) return;
  var timer = null;
  function show(kind) {
    clearTimeout(timer);
    root.classList.remove('is-error');
    banner.classList.remove('is-visible');
    banner.classList.remove('mv-feedback__banner--success', 'mv-feedback__banner--error');
    void banner.offsetWidth;
    if (kind === 'error') {
      root.classList.add('is-error');
      banner.classList.add('mv-feedback__banner--error');
      if (title) title.textContent = 'That name is already taken';
      if (copy) copy.textContent = 'Try a different name for this project.';
    } else {
      banner.classList.add('mv-feedback__banner--success');
      if (title) title.textContent = 'Project saved';
      if (copy) copy.textContent = 'Your changes are stored in this browser.';
    }
    banner.classList.add('is-visible');
    timer = setTimeout(function () { banner.classList.remove('is-visible'); }, 4200);
  }
  document.querySelectorAll('[data-feedback]').forEach(function (button) {
    button.addEventListener('click', function () { show(button.getAttribute('data-feedback')); });
  });
  var delay = ${demo ? 800 : 0};
  if (delay > 0) setTimeout(function () { show('success'); }, delay);
})();`,
      };
    },
  },
];
