import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  decodeShare,
  documentsEqual,
  encodeDocument,
  sanitizeDocument,
} from '../lib/motion/documents';
import { defaultDocument, familyOf, getPreset, isPresetId, PRESETS } from '../lib/motion/presets';
import { defaultHeroState } from '../lib/motion/heroes';
import { studioHash } from '../lib/router';
import { buildExportBundle } from '../lib/preview';
import {
  loadLastDocument,
  loadSaves,
  removeSave,
  saveDocumentLocally,
  saveLastDocument,
} from '../lib/storage';
import type {
  EasingValue,
  HeroState,
  HeroTemplateId,
  ParamValue,
  Preset,
  StudioDocument,
} from '../lib/motion/types';
import { useDebouncedValue, useMediaQuery } from '../hooks';
import { Wordmark } from '../components/Mark';
import { Library } from '../components/studio/Library';
import { Inspector } from '../components/studio/Inspector';
import { PreviewFrame } from '../components/PreviewFrame';
import { ExportPanel } from '../components/studio/ExportPanel';
import { ShareDialog } from '../components/studio/ShareDialog';
import { ThemeToggle } from '../components/ThemeToggle';
import { useToast } from '../components/Toast';
import type { SavedDocument } from '../lib/storage';

type PreviewSize = 'fit' | 'desktop' | 'tablet' | 'mobile';
type MobilePanel = 'library' | 'preview' | 'settings';

const SIZES: { id: PreviewSize; label: string; width: number | null; title: string }[] = [
  { id: 'fit', label: 'FIT', width: null, title: 'Fit the canvas' },
  { id: 'desktop', label: '1024', width: 1024, title: 'Desktop width, 1024 pixels' },
  { id: 'tablet', label: '768', width: 768, title: 'Tablet width, 768 pixels' },
  { id: 'mobile', label: '390', width: 390, title: 'Mobile width, 390 pixels' },
];

function initialDocument(search: URLSearchParams): { doc: StudioDocument; notice?: string } {
  const shared = search.get('s');
  const presetParam = search.get('preset');
  if (shared) {
    const result = decodeShare(shared);
    if (result.ok) return { doc: result.doc };
    const fallback = presetParam && isPresetId(presetParam) ? presetParam : 'btn-lift';
    return {
      doc: defaultDocument(fallback),
      notice: `${result.error} Loaded the default settings instead.`,
    };
  }
  if (presetParam) {
    if (isPresetId(presetParam)) return { doc: defaultDocument(presetParam) };
    return {
      doc: defaultDocument(),
      notice: 'That preset is not in this release. Loaded the default preset instead.',
    };
  }
  const last = loadLastDocument();
  return { doc: last ?? defaultDocument() };
}

function savedTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export function Studio({ search }: { search: URLSearchParams }) {
  const initial = useMemo(() => initialDocument(search), [search]);
  const [doc, setDoc] = useState<StudioDocument>(initial.doc);
  const [notice, setNotice] = useState<string | null>(initial.notice ?? null);
  const [saves, setSaves] = useState<SavedDocument[]>(() => loadSaves());
  const [replayKey, setReplayKey] = useState(0);
  const [sim, setSim] = useState('idle');
  const [size, setSize] = useState<PreviewSize>('fit');
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('preview');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const notify = useToast();
  const narrow = useMediaQuery('(max-width: 1240px)');
  const previewDoc = useDebouncedValue(doc, 150);

  const preset: Preset = getPreset(doc.presetId) ?? PRESETS[0];
  const family = familyOf(preset.family);
  const savedEntry = saves.find((save) => save.presetId === doc.presetId);
  const isDirty = !savedEntry || !documentsEqual(savedEntry.doc, doc);
  const sizeOption = SIZES.find((entry) => entry.id === size) ?? SIZES[0];

  useEffect(() => {
    document.title = `${preset.name} — Movolette Studio`;
  }, [preset.name]);

  useEffect(() => {
    return () => {
      document.title = 'Movolette — a studio for interface motion';
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => saveLastDocument(doc), 300);
    return () => window.clearTimeout(timer);
  }, [doc]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const token = encodeDocument(doc);
        const hash = studioHash({ share: token });
        const target = `${window.location.pathname}${window.location.search}${hash}`;
        if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== target) {
          window.history.replaceState(null, '', target);
        }
      } catch {
        /* The editor still works if a URL cannot be encoded. */
      }
    }, 800);
    return () => window.clearTimeout(timer);
  }, [doc]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 9000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!settingsOpen) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSettingsOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [settingsOpen]);

  const replay = () => {
    setSim('idle');
    setReplayKey((value) => value + 1);
  };

  const selectPreset = (presetId: string) => {
    if (!isPresetId(presetId)) return;
    if (presetId !== doc.presetId) {
      setDoc(defaultDocument(presetId));
      setReplayKey((value) => value + 1);
      setSim('idle');
    }
    setMobilePanel('preview');
    setSettingsOpen(false);
  };

  const updateParam = (key: string, value: ParamValue) => {
    setDoc((current) => ({ ...current, params: { ...current.params, [key]: value } }));
  };

  const updateEasing = (easing: EasingValue) => {
    setDoc((current) => ({ ...current, easing }));
  };

  const updateHero = (hero: HeroState) => {
    setDoc((current) => ({ ...current, hero }));
  };

  const changeTemplate = (template: HeroTemplateId) => {
    if (!isPresetId(template)) return;
    setDoc((current) => ({
      ...current,
      presetId: template,
      params: {},
      hero: current.hero ?? defaultHeroState(template),
    }));
    setReplayKey((value) => value + 1);
  };

  const reset = () => {
    setDoc(defaultDocument(doc.presetId));
    setReplayKey((value) => value + 1);
    setSim('idle');
    notify('Reset to the preset defaults');
  };

  const saveLocal = () => {
    const entry = saveDocumentLocally(doc);
    if (!entry) {
      notify('Could not save locally. Browser storage may be unavailable.');
      return;
    }
    setSaves(loadSaves());
    notify('Saved in this browser');
  };

  const loadSave = (save: SavedDocument) => {
    const safe = sanitizeDocument(save.doc);
    if (!safe) {
      notify('That local save could not be read.');
      return;
    }
    setDoc(safe);
    setReplayKey((value) => value + 1);
    setSim('idle');
    setMobilePanel('preview');
    notify(`Loaded ${save.name} from this browser`);
  };

  const deleteSave = (presetId: string) => {
    setSaves(removeSave(presetId));
    notify('Local save removed');
  };

  const closeInspector = () => {
    setSettingsOpen(false);
    setMobilePanel('preview');
  };

  // Export is computed again inside the panel, which reads from the same document.
  const exportBundle = useMemo(() => buildExportBundle(doc), [doc]);

  return (
    <main className="studio" id="main-content" data-mobile={mobilePanel} tabIndex={-1}>
      <header className="studio-bar">
        <div className="studio-bar__left">
          <Wordmark />
          <span className="studio-bar__rule" aria-hidden="true" />
          <span className="studio-bar__crumb mono">
            {family.short.toUpperCase()} <span aria-hidden="true">/</span> {preset.name}
          </span>
        </div>
        <div className="studio-bar__status" aria-live="polite">
          <span className={`studio-bar__dot${isDirty ? ' is-dirty' : ''}`} aria-hidden="true" />
          <span>
            {isDirty
              ? savedEntry
                ? 'Edited since local save'
                : 'Not saved locally'
              : savedEntry
                ? `Saved locally · ${savedTime(savedEntry.savedAt)}`
                : 'Local draft'}
          </span>
        </div>
        <div className="studio-bar__actions">
          <ThemeToggle />
          <span className="studio-bar__divider" aria-hidden="true" />
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={saveLocal}
            title="Save in this browser"
            aria-label="Save locally"
          >
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 2.5h8.2L13 4.3v9.2H3v-11Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
              <path d="M5.5 2.5v4h5v-4M5.5 13.5V9.8h5v3.7" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
            </svg>
            <span className="studio-bar__btn-label">Save</span>
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => setShareOpen(true)}
            aria-label="Share link"
          >
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6.7 9.3a3 3 0 0 0 4.2 0l1.8-1.8a3 3 0 1 0-4.2-4.2L7.3 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M9.3 6.7a3 3 0 0 0-4.2 0L3.3 8.5a3 3 0 1 0 4.2 4.2l1.2-1.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span className="studio-bar__btn-label">Share</span>
          </button>
          <button
            type="button"
            className="btn btn--sm"
            onClick={() => setExportOpen(true)}
            aria-label="Export code"
          >
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="m5.5 4-4 4 4 4M10.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="studio-bar__btn-label">Export code</span>
          </button>
          <a className="studio-bar__exit" href="#/" title="Back to the Movolette homepage">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M6.5 3.5 2 8l4.5 4.5M2.5 8H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </header>

      {notice ? (
        <div className="studio-notice" role="status">
          <span className="mono studio-notice__label">IMPORT</span>
          <p>{notice}</p>
          <button type="button" className="studio-notice__close" onClick={() => setNotice(null)} aria-label="Dismiss notice">
            ×
          </button>
        </div>
      ) : null}

      <div className={`studio-grid${settingsOpen ? ' is-settings-open' : ''}`}>
        <aside className="studio-panel studio-library" aria-label="Preset library">
          <Library
            activeId={doc.presetId}
            onSelect={selectPreset}
            saves={saves}
            onLoadSave={loadSave}
            onDeleteSave={deleteSave}
          />
        </aside>

        <section className="studio-panel studio-canvas" aria-label="Live preview canvas">
          <div className="canvas-toolbar">
            <div className="canvas-toolbar__left">
              <button type="button" className="toolbar-button toolbar-button--primary" onClick={replay}>
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
                  <path d="M5 3.5 12 8l-7 4.5v-9Z" fill="currentColor" />
                </svg>
                Replay
              </button>
              <button
                type="button"
                className="toolbar-button"
                onClick={() => {
                  setSim('idle');
                  setReplayKey((value) => value + 1);
                }}
                title="Reset the preview state"
              >
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
                  <path d="M8 3a5 5 0 1 1-4.9 4M8 3v4H4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Reset
              </button>
              {preset.demoStates ? (
                <>
                  <span className="canvas-toolbar__divider" aria-hidden="true" />
                  <div className="state-group" role="group" aria-label="Simulate component state">
                    <span className="canvas-toolbar__caption mono">STATE</span>
                    {preset.demoStates.map((state) => (
                      <button
                        key={state.id}
                        type="button"
                        className={`state-button${sim === state.id ? ' is-active' : ''}`}
                        aria-pressed={sim === state.id}
                        onClick={() => setSim(state.id)}
                      >
                        {state.label}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
            <div className="canvas-toolbar__right">
              <button
                type="button"
                className="toolbar-button canvas-settings-trigger"
                onClick={() => setSettingsOpen(true)}
                aria-expanded={settingsOpen}
                aria-controls="studio-settings"
              >
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
                  <path d="M2.5 5h11M2.5 11h11M6 2.8v4.4M10 8.8v4.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                Settings
              </button>
              <div className="size-group" role="group" aria-label="Preview size">
                <span className="canvas-toolbar__caption mono">SIZE</span>
                {SIZES.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`size-button${size === option.id ? ' is-active' : ''}`}
                    aria-pressed={size === option.id}
                    aria-label={option.title}
                    title={option.title}
                    onClick={() => setSize(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <span className="canvas-toolbar__preset mono">
                {family.short.toUpperCase()} / {preset.name}
              </span>
            </div>
          </div>

          <div className="canvas-viewport">
            <div
              className={`canvas-board${size === 'fit' ? ' is-fit' : ''}${
                preset.family === 'heroes' ? '' : ' canvas-board--component'
              }`}
              style={sizeOption.width ? ({ '--preview-width': `${sizeOption.width}px` } as CSSProperties) : undefined}
            >
              <div className="canvas-board__tab">
                <span className="canvas-board__live" aria-hidden="true" />
                <span className="mono">LIVE CANVAS</span>
                <span className="canvas-board__tab-name">{preset.name}</span>
              </div>
              <div className="canvas-board__surface">
                <PreviewFrame
                  doc={previewDoc}
                  title={`${preset.name} live animation preview`}
                  replayKey={replayKey}
                  sim={sim}
                  demo
                  style={{ height: '100%' }}
                />
              </div>
            </div>
            {size !== 'fit' ? (
              <span className="canvas-viewport__badge mono" aria-hidden="true">
                {sizeOption.width}px
              </span>
            ) : null}
          </div>

          <div className="canvas-foot">
            <div className="canvas-foot__copy">
              <span className="label">Live preview</span>
              <p>{preset.blurb}</p>
            </div>
            <div className="canvas-foot__meta">
              {sim !== 'idle' ? <span className="canvas-foot__sim mono">SIMULATING {sim.toUpperCase()}</span> : null}
              <button type="button" className="canvas-foot__export text-link" onClick={() => setExportOpen(true)}>
                Export {exportBundle.js ? 'CSS, HTML & JS' : 'CSS & HTML'}
              </button>
            </div>
          </div>
        </section>

        <aside className={`studio-panel studio-inspector${settingsOpen ? ' is-open' : ''}`} id="studio-settings" aria-label="Animation inspector">
          <Inspector
            doc={doc}
            preset={preset}
            savedAt={savedEntry?.savedAt}
            isDirty={isDirty}
            onParamChange={updateParam}
            onEasingChange={updateEasing}
            onHeroChange={updateHero}
            onTemplateChange={changeTemplate}
            onReplay={replay}
            onSave={saveLocal}
            onReset={reset}
            onClose={narrow ? closeInspector : undefined}
          />
        </aside>

        {settingsOpen ? (
          <button
            type="button"
            className="studio-backdrop"
            onClick={() => setSettingsOpen(false)}
            aria-label="Close settings panel"
            tabIndex={-1}
          />
        ) : null}
      </div>

      <nav className="studio-tabs" aria-label="Studio panels">
        {(
          [
            { id: 'library', label: 'Library' },
            { id: 'preview', label: 'Preview' },
            { id: 'settings', label: 'Settings' },
          ] as { id: MobilePanel; label: string }[]
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`studio-tab${mobilePanel === tab.id ? ' is-active' : ''}`}
            aria-pressed={mobilePanel === tab.id}
            onClick={() => setMobilePanel(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <ExportPanel open={exportOpen} onClose={() => setExportOpen(false)} doc={doc} />
      <ShareDialog open={shareOpen} onClose={() => setShareOpen(false)} doc={doc} />
    </main>
  );
}
