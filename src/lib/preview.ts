import { bezierCss, bezierLabel, getEasing } from './motion/easing';
import { reducedMotionBlock } from './motion/css';
import { buildDocument, getPreset } from './motion/presets';
import { stepLabel } from './motion/documents';
import type { StudioDocument } from './motion/types';

export const FONT_FACES = `
@font-face {
  font-family: 'Instrument Sans';
  src: url('/fonts/instrument-sans.woff2') format('woff2');
  font-weight: 400 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Instrument Serif';
  src: url('/fonts/instrument-serif.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Instrument Serif';
  src: url('/fonts/instrument-serif-italic.woff2') format('woff2');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}
@font-face {
  font-family: 'Spline Sans Mono';
  src: url('/fonts/spline-mono.woff2') format('woff2');
  font-weight: 400 500;
  font-style: normal;
  font-display: swap;
}`;

const PREVIEW_RESET = `
html {
  height: 100%;
}
body {
  margin: 0;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
body > .mv-art {
  flex: 1 0 auto;
}
`;

const BASE_SCRIPT = `
(function () {
  window.addEventListener('message', function (event) {
    var data = event.data;
    if (!data || typeof data !== 'object' || data.type !== 'movolette:state') return;
    var state = typeof data.state === 'string' ? data.state : 'idle';
    if (state === 'idle') delete document.body.dataset.sim;
    else document.body.dataset.sim = state;
  });
})();`;

export function buildPreviewDocument(
  doc: StudioDocument,
  options: { demo?: boolean } = {},
): string {
  const { demo = true } = options;
  const built = buildDocument(doc, demo);
  const js = built.js ?? '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>${FONT_FACES}${PREVIEW_RESET}${built.css}</style>
</head>
<body>
${built.html}
<script>${BASE_SCRIPT}${js}</script>
</body>
</html>`;
}

export interface ExportSetting {
  label: string;
  value: string;
}

export interface ExportBundle {
  presetName: string;
  presetBlurb: string;
  css: string;
  html: string;
  js: string;
  note?: string;
  settings: ExportSetting[];
}

function settingsFor(doc: StudioDocument): ExportSetting[] {
  const preset = getPreset(doc.presetId);
  if (!preset) return [];
  const out: ExportSetting[] = [];
  const easing = doc.easing;
  out.push({
    label: 'Easing',
    value: easing.id === 'custom' ? `custom cubic-bezier(${bezierLabel(easing.bezier)})` : `${easing.id} · ${bezierCss(easing.bezier)}`,
  });
  for (const control of preset.controls) {
    if (control.type === 'text' || control.type === 'textarea') continue;
    const value = doc.params[control.key] ?? preset.defaults[control.key];
    if (control.type === 'range') {
      out.push({ label: control.label, value: `${value}${control.unit ? ` ${control.unit}` : ''}` });
    } else if (control.type === 'switch') {
      out.push({ label: control.label, value: value === true ? 'On' : 'Off' });
    } else if (control.options) {
      const option = control.options.find((entry) => entry.value === value);
      if (option) out.push({ label: control.label, value: option.label });
    }
  }
  if (preset.family === 'heroes' && doc.hero) {
    out.length = 0;
    out.push({ label: 'Sequence', value: `${doc.hero.steps.length} steps` });
    for (const step of doc.hero.steps) {
      out.push({
        label: stepLabel(step.id),
        value: `${step.duration} ms · ${bezierCss(getEasing(step.easing).bezier)}`,
      });
    }
  }
  return out;
}

export function buildExportBundle(doc: StudioDocument): ExportBundle {
  const preset = getPreset(doc.presetId);
  const built = buildDocument(doc, false);
  const header = `/* ${preset?.name ?? 'Movolette animation'} — exported by Movolette.
   Add this stylesheet, then paste the HTML into any container. ${built.js ? 'Include the JavaScript for interactive states.' : 'This animation needs no JavaScript.'}
   Fonts used in the preview: Instrument Sans, Instrument Serif, Spline Sans Mono. */\n\n`;
  const css = `${header}${built.css.trimEnd()}\n${reducedMotionBlock()}\n`;
  return {
    presetName: preset?.name ?? 'Animation',
    presetBlurb: preset?.blurb ?? '',
    css,
    html: built.html,
    js: built.js ?? '',
    note: built.note,
    settings: settingsFor(doc),
  };
}
