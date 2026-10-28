import { memo, useEffect, useMemo, useRef } from 'react';
import { buildPreviewDocument } from '../lib/preview';
import type { StudioDocument } from '../lib/motion/types';

export interface PreviewFrameProps {
  doc: StudioDocument;
  title: string;
  demo?: boolean;
  sim?: string;
  replayKey?: number;
  className?: string;
  style?: React.CSSProperties;
}

/*
 * The generated document only changes when the (debounced) document does, so
 * the frame can skip re-rendering while the inspector is being dragged.
 */
export const PreviewFrame = memo(function PreviewFrame({
  doc,
  title,
  demo = true,
  sim = 'idle',
  replayKey = 0,
  className,
  style,
}: PreviewFrameProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const html = useMemo(() => buildPreviewDocument(doc, { demo }), [doc, demo]);

  const sendState = () => {
    const win = frameRef.current?.contentWindow;
    if (!win) return;
    try {
      win.postMessage({ type: 'movolette:state', state: sim }, '*');
    } catch {
      /* A preview can be replaced while a message is in flight. */
    }
  };

  useEffect(() => {
    sendState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sim, html, replayKey]);

  return (
    <iframe
      key={replayKey}
      ref={frameRef}
      className={`preview-frame${className ? ` ${className}` : ''}`}
      title={title}
      srcDoc={html}
      sandbox="allow-scripts"
      onLoad={sendState}
      style={style}
    />
  );
});
