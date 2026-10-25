import { bezierCss } from '../easing';
import { art, artCss, num } from '../css';
import type { Preset } from '../types';

const STAGE = `
.mv-page {
  width: min(100%, 430px);
  border: 1px solid var(--mv-line);
  border-radius: 6px;
  background: #fff;
  padding: 24px;
  box-shadow: 0 20px 50px -44px rgba(32, 33, 31, 0.6);
}
.mv-page__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--mv-line);
  padding-bottom: 14px;
  margin-bottom: 20px;
}
.mv-page__title {
  margin: 0 0 6px;
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 30px;
  line-height: 1.08;
  letter-spacing: -0.015em;
}
.mv-page__body {
  margin: 0 0 18px;
  font-size: 12.5px;
  line-height: 1.6;
  color: #6c6c66;
  max-width: 38ch;
}
.mv-overlay {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: grid;
  visibility: hidden;
}
.mv-overlay.is-open {
  visibility: visible;
}
.mv-overlay__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(32, 33, 31, 0.42);
  opacity: 0;
  transition: opacity var(--mv-duration) ease;
}
.mv-overlay.is-open .mv-overlay__backdrop {
  opacity: 1;
}
.mv-dialog {
  position: relative;
  z-index: 1;
  background: #fff;
  border: 1px solid var(--mv-line);
  border-radius: 6px;
  box-shadow: 0 40px 90px -50px rgba(20, 20, 18, 0.7);
}
.mv-dialog__inner {
  padding: 26px;
}
.mv-dialog__title {
  margin: 0 0 8px;
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 28px;
  line-height: 1.08;
  letter-spacing: -0.015em;
}
.mv-dialog__body {
  margin: 0 0 22px;
  font-size: 12.5px;
  line-height: 1.6;
  color: #6c6c66;
}
.mv-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.mv-dialog__close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  border-radius: 3px;
  color: #85857f;
  font-size: 16px;
}
.mv-dialog__close:hover {
  background: var(--mv-ivory);
  color: var(--mv-ink);
}
.mv-dialog:focus-visible {
  outline: 2px solid var(--mv-violet);
  outline-offset: 3px;
}
.mv-input {
  width: 100%;
  border: 1px solid var(--mv-line);
  border-radius: 3px;
  background: #FAF9F6;
  padding: 11px 12px;
  font-family: inherit;
  font-size: 13px;
  color: var(--mv-ink);
  margin-bottom: 16px;
}
.mv-input:focus {
  outline: none;
  border-color: var(--mv-violet);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(97, 87, 232, 0.16);
}
.mv-hint {
  margin: 20px 0 0;
  text-align: center;
  font-family: 'Spline Sans Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #85857F;
}
`;

function modalScript(autoOpen: boolean): string {
  return `(function () {
  var overlay = document.querySelector('.mv-overlay');
  var opener = document.querySelector('[data-modal-open]');
  if (!overlay) return;
  var panel = overlay.querySelector('[role="dialog"]');
  var lastFocus = null;
  function open() {
    lastFocus = document.activeElement;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var close = overlay.querySelector('[data-modal-close]');
    if (close) close.focus();
  }
  function close() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    else if (opener) opener.focus();
  }
  if (opener) opener.addEventListener('click', open);
  overlay.querySelectorAll('[data-modal-close]').forEach(function (el) {
    el.addEventListener('click', close);
  });
  document.addEventListener('keydown', function (event) {
    if (!overlay.classList.contains('is-open')) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); }
    if (event.key === 'Tab' && panel) {
      var focusable = panel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  });
  var autoOpen = ${autoOpen ? 'true' : 'false'};
  if (autoOpen) setTimeout(open, 600);
})();`;
}

function pageChrome(label: string): string {
  return `<div class="mv-page__bar"><span class="mv-mono" style="color:#85857F">${label}</span><span class="mv-mono" style="color:#6157E8">● LIVE</span></div>`;
}

export const modalPresets: Preset[] = [
  {
    id: 'modal-scale',
    name: 'Scale and fade dialog',
    blurb: 'A centered dialog with a backdrop fade and a short scale into place.',
    family: 'modals',
    easing: 'editorial',
    controls: [
      { key: 'duration', label: 'Duration', type: 'range', min: 120, max: 700, step: 10, unit: 'ms' },
      { key: 'scale', label: 'Start scale', type: 'range', min: 0.85, max: 1, step: 0.01 },
      { key: 'distance', label: 'Rise', type: 'range', min: 0, max: 40, step: 2, unit: 'px' },
    ],
    defaults: { duration: 340, scale: 0.94, distance: 10 },
    build: ({ p, ease, demo }) => {
      const duration = num(p, 'duration', 340);
      const scale = num(p, 'scale', 0.94);
      const distance = num(p, 'distance', 10);
      return {
        css: `${artCss()}${STAGE}
.mv-overlay--center {
  --mv-duration: ${duration}ms;
  place-items: center;
  padding: 24px;
}
.mv-overlay--center .mv-dialog {
  width: min(400px, 100%);
  opacity: 0;
  transform: translateY(${distance}px) scale(${scale});
  transition:
    opacity ${duration}ms ${bezierCss(ease)},
    transform ${duration}ms ${bezierCss(ease)};
}
.mv-overlay--center.is-open .mv-dialog {
  opacity: 1;
  transform: translateY(0) scale(1);
}`,
        html: art(`<div class="mv-page">
  ${pageChrome('WORKSPACE / BUTTONS')}
  <h3 class="mv-page__title">Rename this preset</h3>
  <p class="mv-page__body">Names are stored with your local settings. You can change this at any time.</p>
  <button class="mv-btn" type="button" data-modal-open>Rename preset</button>
  <div class="mv-overlay mv-overlay--center" aria-hidden="true">
    <div class="mv-overlay__backdrop" data-modal-close></div>
    <div class="mv-dialog" role="dialog" aria-modal="true" aria-labelledby="mv-dialog-title" tabindex="-1">
      <div class="mv-dialog__inner">
        <button class="mv-dialog__close" type="button" data-modal-close aria-label="Close dialog">×</button>
        <h4 class="mv-dialog__title" id="mv-dialog-title">Rename preset</h4>
        <p class="mv-dialog__body">Choose a name that makes this motion easy to find later.</p>
        <label class="mv-mono" style="display:block;margin-bottom:7px;color:#85857F" for="mv-rename">PRESET NAME</label>
        <input class="mv-input" id="mv-rename" value="Soft lift" />
        <div class="mv-dialog__actions">
          <button class="mv-btn mv-btn--ghost" type="button" data-modal-close>Cancel</button>
          <button class="mv-btn" type="button" data-modal-close>Save name</button>
        </div>
      </div>
    </div>
  </div>
</div>${demo ? '<p class="mv-hint">Escape or click the backdrop to close</p>' : ''}`),
        js: modalScript(demo),
        note: 'The exported JS traps focus, closes on Escape, restores focus to the trigger, and toggles the open class. Backdrop and close buttons use data-modal-close.',
      };
    },
  },
  {
    id: 'modal-sheet',
    name: 'Slide-up sheet',
    blurb: 'A sheet that rises from the bottom of the screen for focused tasks.',
    family: 'modals',
    easing: 'editorial',
    controls: [
      { key: 'duration', label: 'Duration', type: 'range', min: 180, max: 900, step: 10, unit: 'ms' },
      { key: 'distance', label: 'Travel', type: 'range', min: 20, max: 160, step: 4, unit: 'px' },
      { key: 'radius', label: 'Top radius', type: 'range', min: 0, max: 16, step: 1, unit: 'px' },
    ],
    defaults: { duration: 460, distance: 100, radius: 8 },
    build: ({ p, ease, demo }) => {
      const duration = num(p, 'duration', 460);
      const distance = num(p, 'distance', 100);
      const radius = num(p, 'radius', 8);
      return {
        css: `${artCss()}${STAGE}
.mv-overlay--sheet {
  --mv-duration: ${duration}ms;
  align-items: end;
  justify-items: center;
}
.mv-overlay--sheet .mv-dialog {
  width: min(440px, 100%);
  border-radius: ${radius}px ${radius}px 0 0;
  border-bottom: 0;
  padding: 8px 0 16px;
  opacity: 0;
  transform: translateY(${distance}px);
  transition:
    opacity ${duration}ms ${bezierCss(ease)},
    transform ${duration}ms ${bezierCss(ease)};
}
.mv-overlay--sheet.is-open .mv-dialog {
  opacity: 1;
  transform: translateY(0);
}
.mv-grabber {
  width: 34px;
  height: 3px;
  border-radius: 2px;
  background: var(--mv-line);
  margin: 4px auto 14px;
}
.mv-sheet-list {
  border-top: 1px solid var(--mv-line);
}
.mv-sheet-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 15px 24px;
  border-bottom: 1px solid var(--mv-line);
  text-align: left;
  font-size: 13px;
  font-weight: 500;
  color: var(--mv-ink);
}
.mv-sheet-item:hover {
  background: #FAF9F6;
}
.mv-sheet-item span:first-child {
  width: 18px;
  font-family: 'Spline Sans Mono', monospace;
  font-size: 10px;
  color: #85857F;
}
.mv-sheet-item:last-child {
  border-bottom: 0;
  color: #B4472A;
}`,
        html: art(`<div class="mv-page">
  ${pageChrome('MOBILE / ACTIONS')}
  <h3 class="mv-page__title">Release actions</h3>
  <p class="mv-page__body">Choose what happens to version 2.4 after the review is complete.</p>
  <button class="mv-btn" type="button" data-modal-open>Manage release</button>
  <div class="mv-overlay mv-overlay--sheet" aria-hidden="true">
    <div class="mv-overlay__backdrop" data-modal-close></div>
    <div class="mv-dialog" role="dialog" aria-modal="true" aria-labelledby="mv-sheet-title" tabindex="-1">
      <div class="mv-grabber" aria-hidden="true"></div>
      <div class="mv-dialog__inner" style="padding:0 24px 18px">
        <h4 class="mv-dialog__title" id="mv-sheet-title" style="font-size:24px">Release actions</h4>
        <p class="mv-dialog__body" style="margin-bottom:0">Version 2.4 · staging</p>
      </div>
      <div class="mv-sheet-list">
        <button class="mv-sheet-item" type="button" data-modal-close><span>01</span><span>Publish to production</span></button>
        <button class="mv-sheet-item" type="button" data-modal-close><span>02</span><span>Duplicate release</span></button>
        <button class="mv-sheet-item" type="button" data-modal-close><span>03</span><span>Archive without publishing</span></button>
      </div>
      <div style="padding:12px 24px 0"><button class="mv-btn mv-btn--ghost" style="width:100%" type="button" data-modal-close>Cancel</button></div>
    </div>
  </div>
</div>${demo ? '<p class="mv-hint">A sheet keeps the context visible above it</p>' : ''}`),
        js: modalScript(demo),
      };
    },
  },
  {
    id: 'modal-drawer',
    name: 'Side drawer',
    blurb: 'A settings panel that slides in from the edge without covering the whole view.',
    family: 'modals',
    easing: 'editorial',
    controls: [
      { key: 'duration', label: 'Duration', type: 'range', min: 180, max: 900, step: 10, unit: 'ms' },
      { key: 'distance', label: 'Travel', type: 'range', min: 20, max: 240, step: 10, unit: 'px' },
      { key: 'width', label: 'Drawer width', type: 'range', min: 280, max: 400, step: 10, unit: 'px' },
    ],
    defaults: { duration: 480, distance: 200, width: 340 },
    build: ({ p, ease, demo }) => {
      const duration = num(p, 'duration', 480);
      const distance = num(p, 'distance', 200);
      const width = num(p, 'width', 340);
      return {
        css: `${artCss()}${STAGE}
.mv-overlay--drawer {
  --mv-duration: ${duration}ms;
  place-items: stretch end;
}
.mv-overlay--drawer .mv-dialog {
  width: min(${width}px, 92%);
  height: 100%;
  border-radius: 0;
  border-top: 0;
  border-bottom: 0;
  border-right: 0;
  opacity: 0;
  transform: translateX(${distance}px);
  transition:
    opacity ${duration}ms ${bezierCss(ease)},
    transform ${duration}ms ${bezierCss(ease)};
  overflow-y: auto;
}
.mv-overlay--drawer.is-open .mv-dialog {
  opacity: 1;
  transform: translateX(0);
}
.mv-drawer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 15px 0;
  border-bottom: 1px solid var(--mv-line);
}
.mv-drawer-row__label {
  font-size: 12.5px;
  font-weight: 500;
}
.mv-drawer-row__note {
  margin: 3px 0 0;
  font-size: 11px;
  color: #85857F;
}
.mv-mini-switch {
  width: 30px;
  height: 17px;
  border-radius: 20px;
  background: var(--mv-violet);
  position: relative;
  flex: none;
}
.mv-mini-switch::after {
  content: '';
  position: absolute;
  top: 3px;
  right: 3px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #fff;
}
.mv-mini-switch--off {
  background: #D5D2C9;
}
.mv-mini-switch--off::after {
  right: auto;
  left: 3px;
}`,
        html: art(`<div class="mv-page">
  ${pageChrome('PROJECT / SETTINGS')}
  <h3 class="mv-page__title">Notification settings</h3>
  <p class="mv-page__body">Decide which moments in the project should interrupt you, and which can wait.</p>
  <button class="mv-btn" type="button" data-modal-open>Open settings</button>
  <div class="mv-overlay mv-overlay--drawer" aria-hidden="true">
    <div class="mv-overlay__backdrop" data-modal-close></div>
    <div class="mv-dialog" role="dialog" aria-modal="true" aria-labelledby="mv-drawer-title" tabindex="-1">
      <div class="mv-dialog__inner">
        <button class="mv-dialog__close" type="button" data-modal-close aria-label="Close settings">×</button>
        <p class="mv-mono" style="color:#85857F;margin:0 0 10px">PROJECT / SETTINGS</p>
        <h4 class="mv-dialog__title" id="mv-drawer-title">Notification settings</h4>
        <p class="mv-dialog__body">A quieter kind of project management.</p>
        <div class="mv-drawer-row"><div><p class="mv-drawer-row__label" style="margin:0">Publish confirmations</p><p class="mv-drawer-row__note">When a release goes live</p></div><span class="mv-mini-switch" aria-hidden="true"></span></div>
        <div class="mv-drawer-row"><div><p class="mv-drawer-row__label" style="margin:0">Comment mentions</p><p class="mv-drawer-row__note">When someone tags you</p></div><span class="mv-mini-switch" aria-hidden="true"></span></div>
        <div class="mv-drawer-row"><div><p class="mv-drawer-row__label" style="margin:0">Weekly digest</p><p class="mv-drawer-row__note">A Monday summary</p></div><span class="mv-mini-switch mv-mini-switch--off" aria-hidden="true"></span></div>
        <div style="display:flex;gap:8px;margin-top:22px">
          <button class="mv-btn" type="button" data-modal-close>Save settings</button>
          <button class="mv-btn mv-btn--ghost" type="button" data-modal-close>Cancel</button>
        </div>
      </div>
    </div>
  </div>
</div>${demo ? '<p class="mv-hint">Slide-in from the edge</p>' : ''}`),
        js: modalScript(demo),
      };
    },
  },
  {
    id: 'popover',
    name: 'Popover menu',
    blurb: 'A small menu that unfolds from its trigger with a soft scale and fade.',
    family: 'modals',
    easing: 'editorial',
    controls: [
      { key: 'duration', label: 'Duration', type: 'range', min: 100, max: 600, step: 10, unit: 'ms' },
      { key: 'scale', label: 'Start scale', type: 'range', min: 0.85, max: 1, step: 0.01 },
      { key: 'distance', label: 'Offset', type: 'range', min: 0, max: 20, step: 1, unit: 'px' },
    ],
    defaults: { duration: 220, scale: 0.96, distance: 6 },
    build: ({ p, ease, demo }) => {
      const duration = num(p, 'duration', 220);
      const scale = num(p, 'scale', 0.96);
      const distance = num(p, 'distance', 6);
      return {
        css: `${artCss()}${STAGE}
.mv-popover-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.mv-popover-wrap {
  position: relative;
  margin-top: 12px;
}
.mv-popover {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  width: 236px;
  transform: translate(-50%, -${distance}px) scale(${scale});
  transform-origin: bottom center;
  background: #fff;
  border: 1px solid var(--mv-line);
  border-radius: 5px;
  padding: 6px;
  box-shadow: 0 24px 50px -28px rgba(32, 33, 31, 0.55);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity ${duration}ms ${bezierCss(ease)},
    transform ${duration}ms ${bezierCss(ease)},
    visibility ${duration}ms;
  z-index: 5;
}
.mv-popover.is-open {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, 0) scale(1);
}
.mv-popover__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 9px 10px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
  text-align: left;
}
.mv-popover__item:hover,
.mv-popover__item:focus-visible {
  background: #F4F2FA;
  color: var(--mv-violet);
  outline: none;
}
.mv-popover__item span:last-child {
  font-family: 'Spline Sans Mono', monospace;
  font-size: 9px;
  color: #85857F;
  letter-spacing: 0.04em;
}
.mv-popover__sep {
  height: 1px;
  background: var(--mv-line);
  margin: 5px 4px;
}
.mv-popover__label {
  padding: 7px 10px 5px;
  font-family: 'Spline Sans Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #85857F;
}`,
        html: art(`<div class="mv-popover-stage">
  <div class="mv-popover-wrap">
    <button class="mv-btn" type="button" data-popover-trigger aria-expanded="false" aria-controls="mv-popover">Share preset</button>
    <div class="mv-popover" id="mv-popover" role="menu" aria-label="Share options">
      <p class="mv-popover__label">EXPORT</p>
      <button class="mv-popover__item" type="button" role="menuitem"><span>Copy CSS</span><span>⌘C</span></button>
      <button class="mv-popover__item" type="button" role="menuitem"><span>Copy HTML</span><span>⌘H</span></button>
      <button class="mv-popover__item" type="button" role="menuitem"><span>Download stylesheet</span><span>↓</span></button>
      <div class="mv-popover__sep" role="separator"></div>
      <button class="mv-popover__item" type="button" role="menuitem"><span>Copy share link</span><span>⌘L</span></button>
    </div>
  </div>
  <p class="mv-page__body" style="text-align:center;margin:0">A small menu, carefully placed.</p>
  ${demo ? '<p class="mv-hint">Click outside or press Escape</p>' : ''}
</div>`),
        js: `(function () {
  var trigger = document.querySelector('[data-popover-trigger]');
  var popover = document.querySelector('.mv-popover');
  if (!trigger || !popover) return;
  function setOpen(next) {
    popover.classList.toggle('is-open', next);
    trigger.setAttribute('aria-expanded', next ? 'true' : 'false');
  }
  trigger.addEventListener('click', function (event) {
    event.stopPropagation();
    setOpen(!popover.classList.contains('is-open'));
  });
  document.addEventListener('click', function (event) {
    if (!popover.contains(event.target) && event.target !== trigger) setOpen(false);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') { setOpen(false); trigger.focus(); }
  });
  popover.querySelectorAll('.mv-popover__item').forEach(function (item) {
    item.addEventListener('click', function () { setOpen(false); trigger.focus(); });
  });
  var delay = ${demo ? 650 : 0};
  if (delay > 0) setTimeout(function () { setOpen(true); }, delay);
})();`,
      };
    },
  },
];
