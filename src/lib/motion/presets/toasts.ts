import { bezierCss } from '../easing';
import { art, artCss, escapeHtml, num, str } from '../css';
import type { Preset } from '../types';

const TOAST_BASE = `
.mv-toast-stage {
  width: min(100%, 460px);
  display: flex;
  justify-content: center;
}
.mv-mini-card {
  width: min(100%, 330px);
  border: 1px solid var(--mv-line);
  border-radius: 6px;
  padding: 22px;
  background: #fff;
  box-shadow: 0 18px 40px -34px rgba(32, 33, 31, 0.5);
}
.mv-mini-card__label {
  color: var(--mv-muted);
  margin: 0 0 12px;
}
.mv-mini-card__title {
  margin: 0 0 6px;
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 26px;
  line-height: 1.1;
  letter-spacing: -0.015em;
}
.mv-mini-card__body {
  margin: 0 0 18px;
  font-size: 12.5px;
  line-height: 1.55;
  color: #6c6c66;
}
.mv-toast {
  position: absolute;
  top: 24px;
  right: 24px;
  width: min(330px, calc(100% - 32px));
  display: flex;
  align-items: flex-start;
  gap: 11px;
  border: 1px solid var(--mv-line);
  border-radius: 5px;
  background: #fff;
  padding: 14px 14px 16px;
  box-shadow: 0 22px 50px -30px rgba(32, 33, 31, 0.55);
  opacity: 0;
  pointer-events: none;
  overflow: hidden;
}
.mv-toast.is-open {
  opacity: 1;
  pointer-events: auto;
}
.mv-toast__mark {
  flex: none;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  margin-top: 1px;
  border-radius: 50%;
  background: var(--mv-lavender);
  color: #40379f;
  font-size: 11px;
  font-weight: 700;
}
.mv-toast__title {
  margin: 0 0 3px;
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.3;
}
.mv-toast__body {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6c6c66;
}
.mv-toast__close {
  margin-left: auto;
  flex: none;
  width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  color: #85857f;
  border-radius: 2px;
  font-size: 14px;
  line-height: 1;
}
.mv-toast__close:hover {
  background: var(--mv-ivory);
  color: var(--mv-ink);
}
.mv-toast__timer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: var(--mv-violet);
  transform-origin: left;
  transform: scaleX(0);
}
@keyframes mv-toast-timer {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}
`;

const HINT = `.mv-hint { margin: 20px 0 0; text-align: center; font-family: 'Spline Sans Mono', monospace; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: #85857F; }`;

const TRIGGER_JS = (hold: number, auto: boolean, autoOpenDelay: number) => `
(function () {
  var toast = document.querySelector('.mv-toast');
  var trigger = document.querySelector('[data-toast-trigger]');
  if (!toast || !trigger) return;
  var timer = null;
  var autoDismiss = ${auto ? 'true' : 'false'};
  var hold = ${hold};
  function open() {
    clearTimeout(timer);
    toast.classList.remove('is-open');
    void toast.offsetWidth;
    toast.classList.add('is-open');
    if (autoDismiss) timer = setTimeout(close, hold);
  }
  function close() {
    clearTimeout(timer);
    toast.classList.remove('is-open');
  }
  trigger.addEventListener('click', open);
  toast.querySelector('.mv-toast__close').addEventListener('click', close);
  var delay = ${autoOpenDelay};
  if (delay > 0) setTimeout(open, delay);
})();`;

export const toastPresets: Preset[] = [
  {
    id: 'toast-slide',
    name: 'Slide-in toast',
    blurb: 'A notification that enters from the top and times out with a visible progress line.',
    family: 'toasts',
    easing: 'editorial',
    controls: [
      { key: 'duration', label: 'Enter duration', type: 'range', min: 150, max: 900, step: 10, unit: 'ms' },
      { key: 'distance', label: 'Travel', type: 'range', min: 6, max: 60, step: 2, unit: 'px' },
      { key: 'hold', label: 'Auto-dismiss', type: 'range', min: 2000, max: 10000, step: 250, unit: 'ms' },
      { key: 'auto', label: 'Dismiss automatically', type: 'switch', note: 'Leaves the toast in place when off.' },
      { key: 'title', label: 'Title', type: 'text', maxLength: 40 },
      { key: 'body', label: 'Message', type: 'textarea', maxLength: 90 },
    ],
    defaults: {
      duration: 480,
      distance: 24,
      hold: 5000,
      auto: false,
      title: 'Release published',
      body: 'Version 2.4 is live on staging. Undo is available for ten minutes.',
    },
    build: ({ p, ease, demo }) => {
      const duration = num(p, 'duration', 480);
      const distance = num(p, 'distance', 24);
      const hold = num(p, 'hold', 5000);
      const auto = p.auto === true;
      const title = str(p, 'title', 'Release published');
      const body = str(p, 'body', 'Version 2.4 is live on staging. Undo is available for ten minutes.');
      return {
        css: `${artCss()}${TOAST_BASE}
.mv-toast--slide {
  transform: translateY(-${distance}px);
  transition:
    opacity ${duration}ms ${bezierCss(ease)},
    transform ${duration}ms ${bezierCss(ease)};
}
.mv-toast--slide.is-open {
  transform: translateY(0);
}
.mv-toast--slide .mv-toast__timer {
  --mv-hold: ${hold}ms;
}
${auto ? `.mv-toast--slide.is-open .mv-toast__timer { animation: mv-toast-timer var(--mv-hold) linear forwards; }` : '.mv-toast--slide .mv-toast__timer { display: none; }'}
${HINT}`,
        html: art(`<div class="mv-toast-stage">
  <div class="mv-mini-card">
    <p class="mv-mini-card__label mv-mono">STAGING / RELEASE 2.4</p>
    <p class="mv-mini-card__title">Ready to publish</p>
    <p class="mv-mini-card__body">Three changes are waiting. Your team will see them as soon as the release goes live.</p>
    <button class="mv-btn" type="button" data-toast-trigger>Publish site</button>
  </div>
  <div class="mv-toast mv-toast--slide" role="status" aria-live="polite">
    <span class="mv-toast__mark" aria-hidden="true">✓</span>
    <div>
      <p class="mv-toast__title">${escapeHtml(title)}</p>
      <p class="mv-toast__body">${escapeHtml(body)}</p>
    </div>
    <button class="mv-toast__close" type="button" aria-label="Dismiss notification">×</button>
    <span class="mv-toast__timer" aria-hidden="true"></span>
  </div>
</div>${demo ? `<p class="mv-hint">Dismisses in ${Math.round(hold / 100) / 10}s when automatic dismissal is on</p>` : ''}`),
        js: TRIGGER_JS(hold, auto, demo ? 650 : 0),
        note: auto
          ? 'Auto-dismiss is enabled. The exported JS keeps the same hold time and removes the toast when it elapses.'
          : 'Auto-dismiss is off. Use the close button, or turn automatic dismissal on to export the timed behavior.',
      };
    },
  },
  {
    id: 'toast-scale',
    name: 'Fade and scale',
    blurb: 'A compact confirmation that grows into view from the bottom corner.',
    family: 'toasts',
    easing: 'editorial',
    controls: [
      { key: 'duration', label: 'Duration', type: 'range', min: 150, max: 900, step: 10, unit: 'ms' },
      { key: 'scale', label: 'Start scale', type: 'range', min: 0.8, max: 1, step: 0.01 },
      { key: 'distance', label: 'Rise', type: 'range', min: 0, max: 40, step: 2, unit: 'px' },
      { key: 'title', label: 'Title', type: 'text', maxLength: 40 },
      { key: 'body', label: 'Message', type: 'textarea', maxLength: 90 },
    ],
    defaults: {
      duration: 420,
      scale: 0.94,
      distance: 12,
      title: 'Copied to clipboard',
      body: 'The CSS is ready to paste into your stylesheet.',
    },
    build: ({ p, ease, demo }) => {
      const duration = num(p, 'duration', 420);
      const scale = num(p, 'scale', 0.94);
      const distance = num(p, 'distance', 12);
      const title = str(p, 'title', 'Copied to clipboard');
      const body = str(p, 'body', 'The CSS is ready to paste into your stylesheet.');
      return {
        css: `${artCss()}${TOAST_BASE}
.mv-toast--scale {
  top: auto;
  bottom: 24px;
  right: 24px;
  transform: translateY(${distance}px) scale(${scale});
  transform-origin: bottom right;
  transition:
    opacity ${duration}ms ${bezierCss(ease)},
    transform ${duration}ms ${bezierCss(ease)};
}
.mv-toast--scale.is-open {
  transform: translateY(0) scale(1);
}
${HINT}`,
        html: art(`<div class="mv-toast-stage">
  <div class="mv-mini-card">
    <p class="mv-mini-card__label mv-mono">EXPORT / CSS</p>
    <p class="mv-mini-card__title" style="font-size:22px">Your stylesheet</p>
    <div style="border:1px solid var(--mv-line);border-radius:3px;background:#FAF9F6;padding:12px;margin:0 0 16px;font-family:'Spline Sans Mono',monospace;font-size:10px;line-height:1.8;color:#6c6c66">
      .button:hover {<br />&nbsp;&nbsp;transform: translateY(-4px);<br />&nbsp;&nbsp;transition: 300ms ...;<br />}
    </div>
    <button class="mv-btn" type="button" data-toast-trigger>Copy CSS</button>
  </div>
  <div class="mv-toast mv-toast--scale" role="status" aria-live="polite">
    <span class="mv-toast__mark" aria-hidden="true">✓</span>
    <div>
      <p class="mv-toast__title">${escapeHtml(title)}</p>
      <p class="mv-toast__body">${escapeHtml(body)}</p>
    </div>
    <button class="mv-toast__close" type="button" aria-label="Dismiss notification">×</button>
  </div>
</div>${demo ? `<p class="mv-hint">Click the copy button to replay</p>` : ''}`),
        js: TRIGGER_JS(0, false, demo ? 650 : 0),
      };
    },
  },
  {
    id: 'toast-stack',
    name: 'Stacked notifications',
    blurb: 'Two notifications arrive together with a short stagger, then stack cleanly.',
    family: 'toasts',
    easing: 'editorial',
    controls: [
      { key: 'duration', label: 'Duration', type: 'range', min: 200, max: 900, step: 10, unit: 'ms' },
      { key: 'stagger', label: 'Stagger', type: 'range', min: 40, max: 400, step: 10, unit: 'ms' },
      { key: 'distance', label: 'Travel', type: 'range', min: 8, max: 60, step: 2, unit: 'px' },
    ],
    defaults: { duration: 460, stagger: 130, distance: 22 },
    build: ({ p, ease, demo }) => {
      const duration = num(p, 'duration', 460);
      const stagger = num(p, 'stagger', 130);
      const distance = num(p, 'distance', 22);
      return {
        css: `${artCss()}${TOAST_BASE}
.mv-toast-stack {
  position: absolute;
  top: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: min(330px, calc(100% - 32px));
}
.mv-toast-stack .mv-toast {
  position: relative;
  top: auto;
  right: auto;
  width: 100%;
  transform: translateY(-${distance}px);
  transition:
    opacity ${duration}ms ${bezierCss(ease)},
    transform ${duration}ms ${bezierCss(ease)};
  transition-delay: calc(var(--mv-i) * ${stagger}ms);
}
.mv-toast-stack .mv-toast.is-open {
  transform: translateY(0);
}
${HINT}`,
        html: art(`<div class="mv-toast-stage">
  <div class="mv-mini-card">
    <p class="mv-mini-card__label mv-mono">INBOX / TEAM ACTIVITY</p>
    <p class="mv-mini-card__title" style="font-size:24px">Quietly busy</p>
    <p class="mv-mini-card__body">Two updates arrived while you were refining the easing curve.</p>
    <button class="mv-btn" type="button" data-toast-trigger>Show notifications</button>
  </div>
  <div class="mv-toast-stack" aria-live="polite">
    <div class="mv-toast" style="--mv-i:0" role="status">
      <span class="mv-toast__mark" aria-hidden="true">✓</span>
      <div><p class="mv-toast__title">Mira published a preset</p><p class="mv-toast__body">Soft lift · Buttons and links</p></div>
      <button class="mv-toast__close" type="button" aria-label="Dismiss notification">×</button>
    </div>
    <div class="mv-toast" style="--mv-i:1" role="status">
      <span class="mv-toast__mark" aria-hidden="true">↗</span>
      <div><p class="mv-toast__title">Share link copied</p><p class="mv-toast__body">Your settings travel inside the URL.</p></div>
      <button class="mv-toast__close" type="button" aria-label="Dismiss notification">×</button>
    </div>
  </div>
</div>${demo ? `<p class="mv-hint">Both notifications use the same timing</p>` : ''}`),
        js: `(function () {
  var toasts = Array.prototype.slice.call(document.querySelectorAll('.mv-toast-stack .mv-toast'));
  var trigger = document.querySelector('[data-toast-trigger]');
  function openAll() {
    toasts.forEach(function (toast) {
      if (toast.classList.contains('is-open')) return;
      toast.classList.add('is-open');
    });
  }
  document.querySelectorAll('.mv-toast__close').forEach(function (button) {
    button.addEventListener('click', function () {
      var toast = button.closest('.mv-toast');
      if (toast) toast.classList.remove('is-open');
    });
  });
  if (trigger) trigger.addEventListener('click', openAll);
  var delay = ${demo ? 650 : 0};
  if (delay > 0) setTimeout(openAll, delay);
})();`,
      };
    },
  },
];
