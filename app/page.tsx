import { Nav } from '@/components/landing/Nav';
import { Hero } from '@/components/landing/Hero';
import { ScanMockup } from '@/components/landing/ScanMockup';
import { ScoredAgainst } from '@/components/landing/ScoredAgainst';
import { Problem } from '@/components/landing/Problem';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { FinalCta } from '@/components/landing/FinalCta';
import { Footer } from '@/components/landing/Footer';
import { Reveal } from '@/components/landing/Reveal';

export default function LandingPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ScanMockup />
        <ScoredAgainst />
        <Problem />
        <HowItWorks />
        <FinalCta />
      </main>
      <Footer />
      <Reveal />
    </>
  );
}
