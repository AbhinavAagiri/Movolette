import { studioHash } from '../../lib/router';
import { Wordmark } from '../Mark';
import { Reveal } from '../Reveal';
import { SiteCredit } from '../SiteCredit';

export function FinalCta() {
  return (
    <>
      <section className="cta" aria-labelledby="cta-title">
        <div className="cta__ticks" aria-hidden="true" />
        <div className="container cta__inner">
          <Reveal className="cta__copy">
            <p className="cta__eyebrow mono">A NOTE ON CRAFT</p>
            <h2 className="cta__title" id="cta-title">
              Good design is
              <br />
              in the <em>details.</em>
            </h2>
            <p className="cta__body">Give your interfaces the little moments that make them memorable.</p>
          </Reveal>
          <Reveal className="cta__action" delay={120}>
            <a className="btn cta__button" href={studioHash()}>
              Start Creating
            </a>
            <p className="cta__note mono">NO ACCOUNT. NO UPLOADS. JUST THE STUDIO.</p>
          </Reveal>
        </div>
        <div className="cta__sequence" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </section>
      <footer className="footer">
        <div className="container footer__inner">
          <Reveal className="footer__brand" shift="sm">
            <Wordmark />
            <p>
              A small, browser-based studio for interface motion. Make the interactions people remember,
              then take the code with you.
            </p>
          </Reveal>
          <Reveal as="nav" className="footer__nav" aria-label="Footer" delay={80} shift="sm">
            <a href="#explore">Explore</a>
            <a href={studioHash()}>Studio</a>
            <a href="#how">How it works</a>
          </Reveal>
          <Reveal className="footer__meta" delay={140} shift="none">
            <span className="mono">SAVED LOCALLY · NO ACCOUNT</span>
            <span className="mono">© 2026 MOVOLETTE</span>
          </Reveal>
        </div>
        <div className="container footer__credit">
          <SiteCredit />
        </div>
      </footer>
    </>
  );
}
