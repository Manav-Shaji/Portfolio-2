import { SiteEffects } from '@/components/effects/SiteEffects';
import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { Hero } from '@/components/sections/Hero';
import { Skills } from '@/components/sections/Skills';
import { Work } from '@/components/sections/Work';
import { Navigation } from '@/components/ui/Navigation';

export default function HomePage() {
  return (
    <div className="relative isolate min-h-screen overflow-x-hidden bg-transparent text-[var(--text)]">
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:border focus:border-[var(--border)] focus:bg-[var(--bg)] focus:px-4 focus:py-2 focus:text-[var(--text)]"
      >
        Skip to content
      </a>
      <SiteEffects />
      <Navigation />

      <main id="home" tabIndex={-1} className="mx-auto max-w-6xl px-4 pb-0 md:px-6">
        <Hero />
        <About />
        <Work />
        <Skills />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
