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
      <SiteEffects />
      <Navigation />

      <main id="home" className="mx-auto max-w-6xl px-4 pb-0 md:px-6">
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
