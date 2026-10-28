import { useEffect, useMemo, useRef, useState } from 'react';
import { encodeDocument } from '../../lib/motion/documents';
import { studioHash } from '../../lib/router';
import type { StudioDocument } from '../../lib/motion/types';
import { copyText } from '../../lib/clipboard';
import { Dialog } from '../Dialog';
import { useToast } from '../Toast';

export function ShareDialog({
  open,
  onClose,
  doc,
}: {
  open: boolean;
  onClose: () => void;
  doc: StudioDocument;
}) {
  const notify = useToast();
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | null>(null);
  const url = useMemo(() => {
    if (!open) return '';
    const token = encodeDocument(doc);
    const hash = studioHash({ share: token });
    return `${window.location.origin}${window.location.pathname}${window.location.search}${hash}`;
  }, [doc, open]);

  useEffect(() => {
    if (open) setCopied(false);
  }, [open]);

  useEffect(() => {
    return () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    };
  }, []);

  const copy = async () => {
    window.history.replaceState(null, '', url);
    const ok = await copyText(url);
    if (ok) {
      setCopied(true);
      notify('Share link copied');
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 2200);
    } else {
      notify('Copy failed — select the link and copy it manually.', 'error');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      eyebrow="Share link"
      title="Carry the settings with you"
      description="This link contains the preset, its settings and any hero copy — encoded in the URL itself."
    >
      <div className="share">
        <label className="label" htmlFor="share-url">
          Your link
        </label>
        <div className="share__field">
          <input
            id="share-url"
            className="share__input"
            readOnly
            value={url}
            onFocus={(event) => event.currentTarget.select()}
          />
          <button
            type="button"
            className={`btn btn--sm${copied ? ' is-copied' : ''}`}
            onClick={copy}
            data-autofocus
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
              'Copy link'
            )}
          </button>
        </div>
        <p className="share__length mono">{url.length.toLocaleString()} characters · no server involved</p>

        <ul className="share__facts">
          <li>
            <span className="label">Local saves</span>
            <p>Saved in this browser only. They never leave this device and are not in the link.</p>
          </li>
          <li>
            <span className="label">Shared links</span>
            <p>Anyone who opens the link sees exactly these settings. Editing your copy will not change theirs.</p>
          </li>
          <li>
            <span className="label">Invalid links</span>
            <p>The studio validates every imported setting and falls back to a safe default rather than breaking.</p>
          </li>
        </ul>
      </div>
    </Dialog>
  );
}
