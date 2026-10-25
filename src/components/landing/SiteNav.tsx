import { useEffect, useState } from 'react';
import { Wordmark } from '../Mark';
import { ThemeToggle } from '../ThemeToggle';
import { studioHash } from '../../lib/router';
import { useReducedMotion } from '../../hooks';

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const goTo = (id: string) => {
    setOpen(false);
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <header className="site-nav">
      <div className="container site-nav__inner">
        <Wordmark />
        <nav className="site-nav__links" aria-label="Primary">
          <button type="button" className="site-nav__link" onClick={() => goTo('explore')}>
            Explore
          </button>
          <a className="site-nav__link" href={studioHash()}>
            Studio
          </a>
          <button type="button" className="site-nav__link" onClick={() => goTo('how')}>
            How it works
          </button>
        </nav>
        <div className="site-nav__actions">
          <ThemeToggle />
          <a className="site-nav__studio" href={studioHash()}>
            Open Studio
          </a>
          <button
            type="button"
            className="site-nav__menu"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="site-nav__menu-label">{open ? 'Close' : 'Menu'}</span>
            <span className={`site-nav__menu-icon${open ? ' is-open' : ''}`} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>
      <div className={`site-menu${open ? ' is-open' : ''}`} id="site-menu" hidden={!open}>
        <div className="container site-menu__inner">
          <button type="button" className="site-menu__link" onClick={() => goTo('explore')}>
            Explore animations
          </button>
          <a className="site-menu__link" href={studioHash()} onClick={() => setOpen(false)}>
            Animation studio
          </a>
          <button type="button" className="site-menu__link" onClick={() => goTo('how')}>
            How it works
          </button>
          <a className="btn site-menu__cta" href={studioHash()}>
            Open the Studio
          </a>
        </div>
      </div>
    </header>
  );
}
