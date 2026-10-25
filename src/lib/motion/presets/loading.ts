import { bezierCss } from '../easing';
import { art, artCss, escapeHtml, num, str } from '../css';
import type { Preset } from '../types';

const HINT = `.mv-hint { margin: 20px 0 0; text-align: center; font-family: 'Spline Sans Mono', monospace; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: #85857F; }`;

export const loadingPresets: Preset[] = [
  {
    id: 'progress-fill',
    name: 'Progress fill',
    blurb: 'A determinate progress bar that fills with your easing, not the browser default.',
    family: 'loading',
    easing: 'editorial',
    controls: [
      { key: 'percent', label: 'Complete', type: 'range', min: 5, max: 100, step: 1, unit: '%' },
      { key: 'duration', label: 'Duration', type: 'range', min: 300, max: 4000, step: 50, unit: 'ms' },
      { key: 'height', label: 'Track height', type: 'range', min: 2, max: 14, step: 1, unit: 'px' },
      { key: 'label', label: 'Label', type: 'text', maxLength: 32 },
    ],
    defaults: { percent: 72, duration: 1500, height: 4, label: 'Publishing release' },
    build: ({ p, ease, demo }) => {
      const percent = Math.round(num(p, 'percent', 72));
      const duration = num(p, 'duration', 1500);
      const height = num(p, 'height', 4);
      const label = str(p, 'label', 'Publishing release');
      return {
        css: `${artCss()}
.mv-progress {
  width: min(100%, 460px);
}
.mv-progress__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}
.mv-progress__label {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
}
.mv-progress__value {
  margin: 0;
  font-family: 'Spline Sans Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.08em;
  color: #6157E8;
}
.mv-progress__track {
  height: ${height}px;
  background: #e9e7df;
  border-radius: 99px;
  overflow: hidden;
}
.mv-progress__fill {
  height: 100%;
  width: ${percent}%;
  background: var(--mv-violet);
  border-radius: 99px;
  transform-origin: left;
  animation: mv-progress-fill ${duration}ms ${bezierCss(ease)} both;
}
@keyframes mv-progress-fill {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
.mv-progress__foot {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 10px;
  font-family: 'Spline Sans Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #85857F;
}
${HINT}`,
        html: art(`<div>
  <div class="mv-progress">
    <div class="mv-progress__head">
      <p class="mv-progress__label">${escapeHtml(label)}</p>
      <p class="mv-progress__value">${percent}%</p>
    </div>
    <div class="mv-progress__track" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100" aria-label="${escapeHtml(label)}">
      <div class="mv-progress__fill"></div>
    </div>
    <div class="mv-progress__foot"><span>STAGING / 2.4</span><span>EST. 4 SEC</span></div>
  </div>
  ${demo ? '<p class="mv-hint">Replay to watch the fill</p>' : ''}
</div>`),
        note: 'The bar animates on render with a scaleX transform. The width is set inline to the chosen percentage, so reduced-motion users see the completed bar.',
      };
    },
  },
  {
    id: 'spinner',
    name: 'Loading spinner',
    blurb: 'Three ways to hold a waiting state: an arc, a pulse of dots, or a set of bars.',
    family: 'loading',
    easing: 'linear',
    controls: [
      {
        key: 'variant',
        label: 'Variant',
        type: 'segmented',
        options: [
          { label: 'Arc', value: 'arc' },
          { label: 'Dots', value: 'dots' },
          { label: 'Bars', value: 'bars' },
        ],
      },
      { key: 'size', label: 'Size', type: 'range', min: 14, max: 56, step: 1, unit: 'px' },
      { key: 'duration', label: 'Cycle', type: 'range', min: 300, max: 2000, step: 50, unit: 'ms' },
    ],
    defaults: { variant: 'arc', size: 32, duration: 780 },
    build: ({ p, demo }) => {
      const variant = str(p, 'variant', 'arc');
      const size = num(p, 'size', 32);
      const duration = num(p, 'duration', 780);
      let visual = '';
      let visualCss = '';
      if (variant === 'dots') {
        visual = `<span class="mv-dots" role="status" aria-label="Loading"><span></span><span></span><span></span></span>`;
        visualCss = `
.mv-dots {
  display: inline-flex;
  align-items: flex-end;
  gap: ${Math.max(3, Math.round(size * 0.16))}px;
  height: ${size}px;
}
.mv-dots span {
  display: block;
  width: ${Math.max(4, Math.round(size * 0.24))}px;
  height: ${Math.max(4, Math.round(size * 0.24))}px;
  border-radius: 50%;
  background: var(--mv-violet);
  animation: mv-dot-pulse ${duration}ms ease-in-out infinite;
}
.mv-dots span:nth-child(2) { animation-delay: ${Math.round(duration / 6)}ms; }
.mv-dots span:nth-child(3) { animation-delay: ${Math.round(duration / 3)}ms; }
@keyframes mv-dot-pulse {
  0%, 100% { transform: translateY(0); opacity: 0.4; }
  40% { transform: translateY(-${Math.round(size * 0.28)}px); opacity: 1; }
}`;
      } else if (variant === 'bars') {
        visual = `<span class="mv-bars" role="status" aria-label="Loading"><span></span><span></span><span></span><span></span></span>`;
        visualCss = `
.mv-bars {
  display: inline-flex;
  align-items: center;
  gap: ${Math.max(3, Math.round(size * 0.12))}px;
  height: ${size}px;
}
.mv-bars span {
  display: block;
  width: ${Math.max(3, Math.round(size * 0.14))}px;
  height: ${size}px;
  border-radius: 2px;
  background: var(--mv-violet);
  animation: mv-bar-pulse ${duration}ms ease-in-out infinite;
}
.mv-bars span:nth-child(2) { animation-delay: ${Math.round(duration * 0.12)}ms; }
.mv-bars span:nth-child(3) { animation-delay: ${Math.round(duration * 0.24)}ms; }
.mv-bars span:nth-child(4) { animation-delay: ${Math.round(duration * 0.36)}ms; }
@keyframes mv-bar-pulse {
  0%, 100% { transform: scaleY(0.35); opacity: 0.45; }
  50% { transform: scaleY(1); opacity: 1; }
}`;
      } else {
        visual = `<span class="mv-spinner-arc" role="status" aria-label="Loading"></span>`;
        visualCss = `
.mv-spinner-arc {
  display: inline-block;
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  border: ${Math.max(2, Math.round(size / 10))}px solid #e9e7df;
  border-top-color: var(--mv-violet);
  border-right-color: var(--mv-violet);
  animation: mv-spinner-rotate ${duration}ms linear infinite;
}
@keyframes mv-spinner-rotate {
  to { transform: rotate(360deg); }
}`;
      }
      return {
        css: `${artCss()}
.mv-loading-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  width: min(100%, 360px);
  border: 1px solid var(--mv-line);
  border-radius: 6px;
  background: #fff;
  padding: 34px 28px;
}
.mv-loading-stage__label {
  margin: 0;
  font-size: 12px;
  color: #6c6c66;
}
.mv-loading-stage__meta {
  margin: 0;
  font-family: 'Spline Sans Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.1em;
  color: #85857F;
  text-transform: uppercase;
}
${visualCss}
${HINT}`,
        html: art(`<div>
  <div class="mv-loading-stage">
    ${visual}
    <div style="text-align:center">
      <p class="mv-loading-stage__label">Preparing your preview</p>
      <p class="mv-loading-stage__meta" style="margin-top:5px">${size}px / ${duration}ms</p>
    </div>
  </div>
  ${demo ? '<p class="mv-hint">Decorative loading state</p>' : ''}
</div>`),
        note: 'The spinner is decorative motion. Keep a visible label nearby and respect reduced motion in the surrounding interface.',
      };
    },
  },
];
