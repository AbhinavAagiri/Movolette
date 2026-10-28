import { studioHash } from '../lib/router';
import { Wordmark } from '../components/Mark';
import { ThemeToggle } from '../components/ThemeToggle';
import { Reveal } from '../components/Reveal';
import { SiteCredit } from '../components/SiteCredit';

/**
 * Shown for a `#/...` address that does not name a page. The static host
 * serves index.html for every path, so this is the one place a broken link can
 * land without losing the theme, the navigation or the studio.
 */
export function NotFound() {
  return (
    <div className="notfound">
      <header className="notfound__bar">
        <div className="container notfound__bar-inner">
          <Wordmark />
          <ThemeToggle />
        </div>
      </header>

      <main className="notfound__main" id="main-content" tabIndex={-1}>
        <div className="container notfound__grid">
          <Reveal className="notfound__copy" shift="sm">
            <p className="notfound__code mono">
              PAGE NOT FOUND <span aria-hidden="true">/</span> 404
            </p>
            <h1 className="notfound__title">
              This frame
              <br />
              isn&rsquo;t here.
            </h1>
            <p className="notfound__body">
              The address doesn&rsquo;t match a page in Movolette. It may be an old share link, or a preset
              that has since been renamed. Nothing was lost &mdash; saves made in this browser are still on
              this device.
            </p>
            <div className="notfound__actions">
              <a className="btn" href="#/">
                Back to the landing page
              </a>
              <a className="btn btn--ghost" href={studioHash()}>
                Open the studio
              </a>
            </div>
          </Reveal>

          <Reveal className="notfound__aside" delay={120} shift="sm">
            <div className="notfound__frame" aria-hidden="true">
              <div className="notfound__frame-head">
                <span className="mono">FRAME STRIP</span>
                <span className="mono">03 / 04</span>
              </div>
              <div className="notfound__strip">
                <span className="notfound__cell">01</span>
                <span className="notfound__cell">02</span>
                <span className="notfound__cell">03</span>
                <span className="notfound__cell notfound__cell--missing">
                  <span>04</span>
                  <span>NO ROUTE</span>
                </span>
              </div>
              <p className="notfound__frame-foot">
                Frames 01&ndash;03 rendered. The address after them was never part of the sequence.
              </p>
            </div>
          </Reveal>
        </div>
      </main>

      <footer className="notfound__footer">
        <div className="container">
          <SiteCredit />
        </div>
      </footer>
    </div>
  );
}
