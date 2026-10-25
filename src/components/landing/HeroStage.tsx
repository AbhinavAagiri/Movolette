import { Fragment, useCallback, useState } from 'react';

const NAME = 'Abhinav Aagiri';
const WORDS = NAME.split(' ');

/*
 * A miniature of abhinavaagiri.com's hero. The entrance mirrors the site's
 * GSAP timeline: each word settles out of a 10px blur from 95% scale, 0.1s
 * apart on an expo curve after a 0.6s hold, and the role line follows 0.2s
 * after the words begin. The pointer trail is deliberately left out.
 */
export function HeroStage() {
  const [playKey, setPlayKey] = useState(0);
  const replay = useCallback(() => setPlayKey((value) => value + 1), []);

  return (
    <div className="stage">
      <div className="stage__chrome">
        <span className="stage__live">
          <span className="stage__dot" aria-hidden="true" />
          LIVE PREVIEW
        </span>
        <a
          className="stage__url"
          href="https://abhinavaagiri.com"
          target="_blank"
          rel="noreferrer noopener"
        >
          abhinavaagiri.com
          <svg viewBox="0 0 10 10" width="8" height="8" fill="none" aria-hidden="true">
            <path
              d="M2.6 7.4 7.4 2.6M3.6 2.6h3.8v3.8"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        <span className="stage__timecode">SEQ 01 / 2.0s</span>
      </div>
      <div className="stage__ruler" aria-hidden="true" />
      <div className="stage__canvas stage__canvas--site">
        <div className="pfsite" key={playKey}>
          <div className="pfsite__nav" aria-hidden="true">
            <span className="pfsite__mark">Abhinav©</span>
            <span className="pfsite__links">
              {['Home', 'Works', 'About', 'Contact'].map((label, index) => (
                <span key={label} className={index === 0 ? 'is-current' : undefined}>
                  {label}
                </span>
              ))}
            </span>
            <span className="pfsite__meta">Menu</span>
          </div>

          <div className="pfsite__hero">
            <p className="pfsite__title">
              {WORDS.map((word, index) => (
                <Fragment key={`${word}-${index}`}>
                  {index > 0 ? ' ' : null}
                  <span className="pfsite__word" style={{ ['--i' as string]: index }}>
                    {word}
                  </span>
                </Fragment>
              ))}
            </p>
            <p className="pfsite__sub">Software &amp; game developer from California</p>
          </div>
        </div>
      </div>
      <div className="stage__timeline">
        <button type="button" className="stage__replay" onClick={replay}>
          <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
            <path
              d="M13 8a5 5 0 1 1-1.6-3.7M13 2.6V6h-3.4"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Replay
        </button>
        <div className="stage__line" aria-hidden="true">
          <span className="stage__segment" key={playKey} />
          <span className="stage__playhead" key={`head-${playKey}`} />
        </div>
        <span className="stage__timecode">00:00 / 02:00</span>
      </div>
    </div>
  );
}
