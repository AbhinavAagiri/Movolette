import { bezierCss } from '../easing';
import { art, artCss, escapeHtml, num, str } from '../css';
import type { Preset } from '../types';

const HINT = `.mv-hint { margin: 20px 0 0; font-family: 'Spline Sans Mono', monospace; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: #85857F; }`;

function words(text: string): string {
  return text
    .split(' ')
    .map((word, i) => `<span class="mv-word" style="--mv-i:${i}">${escapeHtml(word)}</span>`)
    .join(' ');
}

function letters(text: string): string {
  return text
    .split('')
    .map((char, i) =>
      char === ' '
        ? ' '
        : `<span class="mv-letter" style="--mv-i:${i}" aria-hidden="true">${escapeHtml(char)}</span>`,
    )
    .join('');
}

function textTypeCss(): string {
  return `
.mv-type {
  width: min(100%, 560px);
}
.mv-type__eyebrow {
  margin: 0 0 18px;
  color: var(--mv-muted);
}
.mv-type__headline {
  margin: 0;
  font-family: 'Instrument Serif', 'Iowan Old Style', Georgia, serif;
  font-weight: 400;
  font-size: clamp(34px, 6vw, 52px);
  line-height: 1.02;
  letter-spacing: -0.02em;
}
.mv-type__body {
  margin: 18px 0 0;
  max-width: 42ch;
  font-size: 13.5px;
  line-height: 1.65;
  color: #6c6c66;
}
`;
}

export const textPresets: Preset[] = [
  {
    id: 'text-rise',
    name: 'Fade and rise',
    blurb: 'A headline that arrives from below, line by line, then settles.',
    family: 'text',
    easing: 'editorial',
    controls: [
      { key: 'duration', label: 'Duration', type: 'range', min: 200, max: 1400, step: 20, unit: 'ms' },
      { key: 'distance', label: 'Rise', type: 'range', min: 0, max: 60, step: 2, unit: 'px' },
      { key: 'stagger', label: 'Line stagger', type: 'range', min: 0, max: 260, step: 10, unit: 'ms' },
      { key: 'delay', label: 'Start delay', type: 'range', min: 0, max: 800, step: 20, unit: 'ms' },
    ],
    defaults: { duration: 800, distance: 26, stagger: 90, delay: 100 },
    build: ({ p, ease }) => {
      const duration = num(p, 'duration', 800);
      const distance = num(p, 'distance', 26);
      const stagger = num(p, 'stagger', 90);
      const delay = num(p, 'delay', 100);
      return {
        css: `${artCss()}${textTypeCss()}
@keyframes mv-text-rise {
  from { opacity: 0; transform: translateY(${distance}px); }
  to { opacity: 1; transform: translateY(0); }
}
.mv-type__line {
  display: block;
  overflow: hidden;
  padding-bottom: 2px;
}
.mv-type__line > span {
  display: inline-block;
  animation: mv-text-rise ${duration}ms ${bezierCss(ease)} both;
  animation-delay: calc(${delay}ms + var(--mv-i) * ${stagger}ms);
}
.mv-type__body {
  animation: mv-text-rise ${duration}ms ${bezierCss(ease)} both;
  animation-delay: ${delay + stagger * 2 + 120}ms;
}
${HINT}`,
        html: art(`<div class="mv-type">
  <p class="mv-type__eyebrow mv-mono">FIELD NOTES / NO. 04</p>
  <h2 class="mv-type__headline" aria-label="Interfaces that answer back.">
    <span class="mv-type__line"><span data-line style="--mv-i:0">Interfaces that</span></span>
    <span class="mv-type__line"><span data-line style="--mv-i:1">answer back.</span></span>
  </h2>
  <p class="mv-type__body">Motion is not decoration. It is the sentence between a tap and the result.</p>
</div>`),
        note: 'The animation runs when the element first renders. Replay it by remounting the element or re-adding the class.',
      };
    },
  },
  {
    id: 'text-words',
    name: 'Word reveal',
    blurb: 'A sentence assembled word by word, with a rhythm you can tune.',
    family: 'text',
    easing: 'editorial',
    controls: [
      { key: 'duration', label: 'Duration', type: 'range', min: 200, max: 1400, step: 20, unit: 'ms' },
      { key: 'distance', label: 'Rise', type: 'range', min: 0, max: 50, step: 2, unit: 'px' },
      { key: 'stagger', label: 'Word stagger', type: 'range', min: 10, max: 180, step: 5, unit: 'ms' },
      { key: 'delay', label: 'Start delay', type: 'range', min: 0, max: 800, step: 20, unit: 'ms' },
    ],
    defaults: { duration: 700, distance: 20, stagger: 55, delay: 120 },
    build: ({ p, ease }) => {
      const duration = num(p, 'duration', 700);
      const distance = num(p, 'distance', 20);
      const stagger = num(p, 'stagger', 55);
      const delay = num(p, 'delay', 120);
      const phrase = 'Motion is a material you can design with.';
      return {
        css: `${artCss()}${textTypeCss()}
@keyframes mv-word-in {
  from { opacity: 0; transform: translateY(${distance}px) rotate(1deg); }
  to { opacity: 1; transform: translateY(0) rotate(0deg); }
}
.mv-word-line {
  margin: 0;
  max-width: 12ch;
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: clamp(40px, 7vw, 62px);
  line-height: 1.02;
  letter-spacing: -0.025em;
}
.mv-word {
  display: inline-block;
  animation: mv-word-in ${duration}ms ${bezierCss(ease)} both;
  animation-delay: calc(${delay}ms + var(--mv-i) * ${stagger}ms);
  margin-right: 0.18em;
}
${HINT}`,
        html: art(`<div>
  <p class="mv-word-line" aria-label="${phrase}">${words(phrase)}</p>
  <p class="mv-type__body" style="max-width:34ch">Every word arrives on its own beat, so the sentence reads the way it sounds.</p>
</div>`),
        note: 'Each word carries a --mv-i index. The delay is calculated in CSS from that index and your stagger value.',
      };
    },
  },
  {
    id: 'text-letters',
    name: 'Letter stagger',
    blurb: 'A display line where each character lands with a small tilt.',
    family: 'text',
    easing: 'editorial',
    controls: [
      { key: 'duration', label: 'Duration', type: 'range', min: 200, max: 1400, step: 20, unit: 'ms' },
      { key: 'stagger', label: 'Letter stagger', type: 'range', min: 8, max: 120, step: 2, unit: 'ms' },
      { key: 'distance', label: 'Drop', type: 'range', min: 0, max: 40, step: 2, unit: 'px' },
      { key: 'tilt', label: 'Tilt', type: 'range', min: 0, max: 14, step: 0.5, unit: 'deg' },
    ],
    defaults: { duration: 620, stagger: 34, distance: 16, tilt: 5 },
    build: ({ p, ease }) => {
      const duration = num(p, 'duration', 620);
      const stagger = num(p, 'stagger', 34);
      const distance = num(p, 'distance', 16);
      const tilt = num(p, 'tilt', 5);
      return {
        css: `${artCss()}
.mv-letters {
  margin: 0;
  max-width: 100%;
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: clamp(44px, 9vw, 78px);
  line-height: 0.98;
  letter-spacing: -0.025em;
  white-space: normal;
}
.mv-letter {
  display: inline-block;
  animation: mv-letter-in ${duration}ms ${bezierCss(ease)} both;
  animation-delay: calc(var(--mv-i) * ${stagger}ms);
  transform-origin: 50% 80%;
}
@keyframes mv-letter-in {
  from { opacity: 0; transform: translateY(${distance}px) rotate(${tilt}deg); }
  to { opacity: 1; transform: translateY(0) rotate(0deg); }
}
${HINT}`,
        html: art(`<div>
  <p class="mv-letters" aria-label="A sense of timing.">${letters('A sense of timing.')}</p>
  <p class="mv-type__body" style="margin-top:22px">Letter-level timing turns a headline into an entrance.</p>
</div>`),
        note: 'The letters are hidden from assistive technology individually; the parent carries the readable aria-label.',
      };
    },
  },
  {
    id: 'text-blur',
    name: 'Blur to sharp',
    blurb: 'Type emerging from soft focus — useful for atmospheric headlines.',
    family: 'text',
    easing: 'ease-out',
    controls: [
      { key: 'duration', label: 'Duration', type: 'range', min: 300, max: 1800, step: 20, unit: 'ms' },
      { key: 'blur', label: 'Starting blur', type: 'range', min: 2, max: 24, step: 1, unit: 'px' },
      { key: 'distance', label: 'Rise', type: 'range', min: 0, max: 30, step: 2, unit: 'px' },
    ],
    defaults: { duration: 1100, blur: 12, distance: 10 },
    build: ({ p, ease }) => {
      const duration = num(p, 'duration', 1100);
      const blur = num(p, 'blur', 12);
      const distance = num(p, 'distance', 10);
      return {
        css: `${artCss()}${textTypeCss()}
@keyframes mv-blur-in {
  0% { opacity: 0; filter: blur(${blur}px); transform: translateY(${distance}px); }
  55% { opacity: 1; }
  100% { opacity: 1; filter: blur(0); transform: translateY(0); }
}
.mv-blur-title {
  margin: 0;
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: clamp(42px, 8vw, 70px);
  line-height: 1;
  letter-spacing: -0.025em;
  animation: mv-blur-in ${duration}ms ${bezierCss(ease)} both;
}
.mv-blur-sub {
  margin: 18px 0 0;
  font-size: 13.5px;
  color: #6c6c66;
  animation: mv-blur-in ${duration}ms ${bezierCss(ease)} both;
  animation-delay: ${Math.round(duration * 0.22)}ms;
}
${HINT}`,
        html: art(`<div style="max-width:520px">
  <p class="mv-mono" style="color:#85857F;margin-bottom:18px">SLOW FOCUS / 01</p>
  <h2 class="mv-blur-title">Bring the room<br />into focus.</h2>
  <p class="mv-blur-sub">A slower entrance for the moments that deserve attention.</p>
</div>`),
      };
    },
  },
  {
    id: 'text-slide',
    name: 'Slide-in headline',
    blurb: 'A block of type that enters from a chosen edge of the frame.',
    family: 'text',
    easing: 'editorial',
    controls: [
      { key: 'duration', label: 'Duration', type: 'range', min: 200, max: 1400, step: 20, unit: 'ms' },
      { key: 'distance', label: 'Distance', type: 'range', min: 10, max: 120, step: 2, unit: 'px' },
      {
        key: 'direction',
        label: 'From',
        type: 'segmented',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Right', value: 'right' },
          { label: 'Below', value: 'below' },
        ],
      },
    ],
    defaults: { duration: 750, distance: 44, direction: 'left' },
    build: ({ p, ease }) => {
      const duration = num(p, 'duration', 750);
      const distance = num(p, 'distance', 44);
      const direction = str(p, 'direction', 'left');
      const transform =
        direction === 'right'
          ? `translateX(${distance}px)`
          : direction === 'below'
            ? `translateY(${distance}px)`
            : `translateX(-${distance}px)`;
      return {
        css: `${artCss()}${textTypeCss()}
@keyframes mv-slide-in {
  from { opacity: 0; transform: ${transform}; }
  to { opacity: 1; transform: translate(0, 0); }
}
.mv-slide-wrap {
  overflow: hidden;
  padding: 6px 2px 8px;
  margin: -6px -2px -8px;
}
.mv-slide-title {
  margin: 0;
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: clamp(40px, 7vw, 64px);
  line-height: 1.02;
  letter-spacing: -0.025em;
  animation: mv-slide-in ${duration}ms ${bezierCss(ease)} both;
}
.mv-slide-meta {
  margin: 18px 0 0;
  animation: mv-slide-in ${duration}ms ${bezierCss(ease)} both;
  animation-delay: ${Math.round(duration * 0.28)}ms;
}
${HINT}`,
        html: art(`<div style="max-width:560px">
  <div class="mv-slide-wrap">
    <h2 class="mv-slide-title">Made for the details.</h2>
  </div>
  <p class="mv-slide-meta mv-mono" style="color:#85857F">SECTION 02 — A NOTE ON CRAFT</p>
  <p class="mv-type__body" style="animation:mv-slide-in ${duration}ms ${bezierCss(ease)} both;animation-delay:${Math.round(duration * 0.4)}ms">The best transitions do not announce themselves. They simply make the next step easier to take.</p>
</div>`),
      };
    },
  },
  {
    id: 'text-counter',
    name: 'Animated counter',
    blurb: 'A number that counts into place with the same easing as the rest of your UI.',
    family: 'text',
    easing: 'ease-out',
    controls: [
      { key: 'target', label: 'Count to', type: 'range', min: 10, max: 9999, step: 1 },
      { key: 'duration', label: 'Duration', type: 'range', min: 300, max: 3000, step: 50, unit: 'ms' },
      { key: 'prefix', label: 'Prefix', type: 'text', maxLength: 4 },
      { key: 'suffix', label: 'Suffix', type: 'text', maxLength: 6 },
      { key: 'label', label: 'Label', type: 'text', maxLength: 48 },
    ],
    defaults: { target: 64, duration: 1400, prefix: '', suffix: '%', label: 'less time spent nudging keyframes' },
    build: ({ p, ease, demo }) => {
      const target = Math.round(num(p, 'target', 64));
      const duration = num(p, 'duration', 1400);
      const prefix = str(p, 'prefix', '');
      const suffix = str(p, 'suffix', '%');
      const label = str(p, 'label', 'less time spent nudging keyframes');
      const bezier = `[${ease.join(', ')}]`;
      return {
        css: `${artCss()}
.mv-counter {
  margin: 0;
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: clamp(80px, 14vw, 128px);
  line-height: 0.9;
  letter-spacing: -0.035em;
  font-variant-numeric: tabular-nums lining-nums;
}
.mv-counter__number {
  display: inline-block;
  min-width: 1.6ch;
}
.mv-counter__label {
  margin: 18px 0 0;
  max-width: 28ch;
  font-size: 13.5px;
  line-height: 1.55;
  color: #6c6c66;
}
.mv-counter__rule {
  width: 42px;
  height: 1px;
  background: #6157E8;
  margin: 20px 0;
  transform-origin: left;
  animation: mv-counter-rule 1200ms cubic-bezier(${ease.join(', ')}) both;
}
@keyframes mv-counter-rule {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
${HINT}`,
        html: art(`<div>
  <p class="mv-mono" style="color:#85857F;margin-bottom:14px">MEASURED / INTERACTION TIME</p>
  <p class="mv-counter"><span class="mv-counter__number" data-target="${target}" data-duration="${duration}" data-ease="${bezier}">0</span><span>${escapeHtml(prefix)}</span><span>${escapeHtml(suffix)}</span></p>
  <span class="mv-counter__rule" aria-hidden="true"></span>
  <p class="mv-counter__label">${escapeHtml(label)}</p>
</div>`),
        js: `(function () {
  var el = document.querySelector('.mv-counter__number');
  if (!el) return;
  var target = Number(el.getAttribute('data-target')) || 0;
  var duration = Number(el.getAttribute('data-duration')) || 1000;
  var bezier = ${bezier};
  /* The studio preview always counts: the point of the preset is to show the
     motion, so the system preference must not skip it there. Exported code
     still lands on the final value for reduced-motion visitors. */
  var reduced = ${demo ? 'false' : "window.matchMedia('(prefers-reduced-motion: reduce)').matches"};
  function ease(t) {
    var x1 = bezier[0], y1 = bezier[1], x2 = bezier[2], y2 = bezier[3];
    function sample(a, b, s) {
      return 3 * (1 - s) * (1 - s) * s * a + 3 * (1 - s) * s * s * b + s * s * s;
    }
    var lo = 0, hi = 1, s = t;
    for (var i = 0; i < 12; i += 1) {
      var x = sample(x1, x2, s);
      if (Math.abs(x - t) < 0.0001) break;
      if (x < t) lo = s; else hi = s;
      s = (lo + hi) / 2;
    }
    return sample(y1, y2, s);
  }
  if (reduced) { el.textContent = target.toLocaleString(); return; }
  var start = performance.now();
  function frame(now) {
    var progress = Math.min(1, (now - start) / duration);
    var value = Math.round(ease(progress) * target);
    el.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();`,
        note: 'The counter is JavaScript-driven, so its easing is sampled in JS with the same cubic-bezier curve. The exported script shows the final value when reduced motion is requested.',
      };
    },
  },
];
