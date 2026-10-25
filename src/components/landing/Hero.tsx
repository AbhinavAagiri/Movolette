import { studioHash } from '../../lib/router';
import { PRESETS } from '../../lib/motion/presets';
import { useReducedMotion } from '../../hooks';
import { Reveal } from '../Reveal';
import { HeroStage } from './HeroStage';

export function Hero() {
  const reduced = useReducedMotion();
  const explore = () => {
    document.getElementById('explore')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <Reveal as="p" className="hero__kicker mono" delay={0} shift="sm">
            <span className="hero__kicker-line" aria-hidden="true" />
            An animation studio for the web
          </Reveal>
          <h1 className="display hero__title" id="hero-title">
            <Reveal as="span" className="hero__line" delay={90}>
              Make every{' '}
            </Reveal>
            <Reveal as="span" className="hero__line" delay={170}>
              interaction{' '}
            </Reveal>
            <Reveal as="span" className="hero__line" delay={250}>
              <em>feel alive.</em>
            </Reveal>
          </h1>
          <Reveal as="p" className="lede hero__lede" delay={330} shift="sm">
            Create beautiful UI animations, fine-tune every movement, and export production-ready code. No
            complicated animation software required.
          </Reveal>
          <Reveal className="hero__actions" delay={420} shift="sm">
            <a className="btn" href={studioHash()}>
              Open the Studio
            </a>
            <button type="button" className="btn btn--ghost" onClick={explore}>
              Explore animations
            </button>
          </Reveal>
          <Reveal as="p" className="hero__footnote mono" delay={500} shift="none">
            {PRESETS.length} presets · runs in your browser · saves on this device
          </Reveal>
        </div>
        <div className="hero__stage">
          <HeroStage />
        </div>
      </div>
    </section>
  );
}
