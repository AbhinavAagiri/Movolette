import { SiteNav } from '../components/landing/SiteNav';
import { Hero } from '../components/landing/Hero';
import { Explore } from '../components/landing/Explore';
import { HowItWorks } from '../components/landing/HowItWorks';
import { FinalCta } from '../components/landing/FinalCta';

export function Landing() {
  return (
    <div className="landing">
      <SiteNav />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Explore />
        <HowItWorks />
        <FinalCta />
      </main>
    </div>
  );
}
