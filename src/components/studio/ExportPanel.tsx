import { useEffect, useMemo, useRef, useState } from 'react';
import { buildExportBundle } from '../../lib/preview';
import type { StudioDocument } from '../../lib/motion/types';
import { copyText, downloadText } from '../../lib/clipboard';
import { Dialog } from '../Dialog';
import { CodeBlock } from '../CodeBlock';
import { useToast } from '../Toast';

type ExportTab = 'css' | 'html' | 'js';

interface ExportPanelProps {
  open: boolean;
  onClose: () => void;
  doc: StudioDocument;
}

const TAB_LABELS: Record<ExportTab, string> = {
  css: 'CSS',
  html: 'HTML',
  js: 'JavaScript',
};

/*
 * The stylesheet build is only useful while the dialog is open, so the body
 * is a separate component that mounts with it. Keeping it mounted would
 * rebuild the export bundle on every inspector tick behind a closed dialog.
 */
export function ExportPanel({ open, onClose, doc }: ExportPanelProps) {
  if (!open) return null;
  return <ExportPanelBody onClose={onClose} doc={doc} />;
}

function ExportPanelBody({ onClose, doc }: Omit<ExportPanelProps, 'open'>) {
  const [tab, setTab] = useState<ExportTab>('css');
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | null>(null);
  const notify = useToast();
  const bundle = useMemo(() => buildExportBundle(doc), [doc]);
  const hasJs = bundle.js.trim().length > 0;
  const filename = `movolette-${doc.presetId}.css`;

  useEffect(() => {
    return () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    };
  }, []);

  const code = tab === 'css' ? bundle.css : tab === 'html' ? bundle.html : bundle.js;
  const language = tab === 'js' ? 'js' : tab;

  const copyCurrent = async () => {
    const ok = await copyText(code);
    if (!ok) {
      notify('Copy failed — select the code and copy it manually.', 'error');
      return;
    }
    setCopied(true);
    if (copyTimer.current) window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 1800);
    notify(`${TAB_LABELS[tab]} copied to clipboard`);
  };

  const downloadCss = () => {
    const ok = downloadText(filename, bundle.css, 'text/css');
    notify(
      ok ? `Downloaded ${filename}` : 'Download failed. You can copy the CSS instead.',
      ok ? 'success' : 'error',
    );
  };

  return (
    <Dialog
      open
      onClose={onClose}
      variant="wide"
      eyebrow="Export code"
      title={bundle.presetName}
      description="The CSS, markup and behavior below are generated from this exact preview."
    >
      <div className="export">
        <div className="export__meta">
          <p className="export__blurb">{bundle.presetBlurb}</p>
          <ul className="export__settings" aria-label="Selected animation settings">
            {bundle.settings.map((setting) => (
              <li key={`${setting.label}-${setting.value}`}>
                <span className="label">{setting.label}</span>
                <span className="mono">{setting.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="export__tabs" role="tablist" aria-label="Export formats">
          {(['css', 'html', 'js'] as ExportTab[]).map((entry) => (
            <button
              key={entry}
              type="button"
              role="tab"
              aria-selected={tab === entry}
              aria-controls={`export-code-${entry}`}
              className={`export__tab${tab === entry ? ' is-active' : ''}`}
              onClick={() => {
                setTab(entry);
                setCopied(false);
              }}
            >
              {TAB_LABELS[entry]}
              {entry === 'js' && !hasJs ? <span className="export__tab-note">none needed</span> : null}
            </button>
          ))}
        </div>

        <div id={`export-code-${tab}`} role="tabpanel" aria-label={`${TAB_LABELS[tab]} code`} className="export__code">
          {tab === 'js' && !hasJs ? (
            <div className="export__empty">
              <p className="h3">No JavaScript required.</p>
              <p>This animation is built entirely with CSS. Paste the HTML and stylesheet, and it will run.</p>
            </div>
          ) : (
            <CodeBlock code={code} language={language} />
          )}
        </div>

        <div className="export__actions">
          <div className="export__action-group">
            <button
              type="button"
              className={`btn btn--sm${copied ? ' is-copied' : ''}`}
              onClick={copyCurrent}
              disabled={tab === 'js' && !hasJs}
            >
              {copied ? (
                <>
                  <svg viewBox="0 0 16 16" width="11" height="11" fill="none" aria-hidden="true">
                    <path
                      d="m3 8.5 3.4 3.4L13 4.6"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Copied
                </>
              ) : (
                `Copy ${TAB_LABELS[tab]}`
              )}
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={downloadCss}>
              Download CSS
            </button>
          </div>
          <span className="mono export__chars">{code.length.toLocaleString()} chars</span>
        </div>

        <div className="export__instructions">
          <div>
            <span className="label">How to use it</span>
            <ol>
              <li>Add the CSS to your stylesheet.</li>
              <li>Paste the HTML where the component should live. The <code>.mv-art</code> wrapper is optional but carries the layout defaults.</li>
              {hasJs ? (
                <li>
                  Load the JavaScript after the markup. It targets one instance on the page; duplicate it with
                  unique selectors if you need several.
                </li>
              ) : null}
            </ol>
          </div>
          <div className="export__caveats">
            {bundle.note ? <p>{bundle.note}</p> : null}
            <p>
              The preview uses Instrument Sans, Instrument Serif and Spline Sans Mono. The export keeps their
              font stacks; substitute your own typefaces if you have not bundled them.
            </p>
            <p>The exported stylesheet includes a reduced-motion rule that disables the animation for visitors who ask for less motion.</p>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
