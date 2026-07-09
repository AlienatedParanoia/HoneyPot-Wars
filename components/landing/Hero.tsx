import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { C, DISPLAY } from '@/lib/theme';

export function Hero() {
  return (
    <Section label="Hero" style={{ padding: '120px 0 0', textAlign: 'center' }}>
      <div data-reveal>
        <Badge>Adversarial security code review · Singapore</Badge>
      </div>

      <h1
        data-reveal
        style={{
          fontFamily: DISPLAY,
          fontWeight: 900,
          // Fluid so the four-line headline never overflows on narrow screens.
          fontSize: 'clamp(40px, 8.2vw, 104px)',
          lineHeight: 0.94,
          letterSpacing: '-0.02em',
          color: C.text,
          textTransform: 'uppercase',
          margin: '40px auto 0',
          maxWidth: '14ch',
          textWrap: 'balance',
        }}
      >
        The vulnerabilities your tools don&apos;t catch.
      </h1>

      <p
        data-reveal
        style={{
          fontSize: '17px',
          lineHeight: 1.6,
          color: C.muted,
          margin: '32px auto 0',
          maxWidth: '58ch',
          textWrap: 'pretty',
        }}
      >
        Most SMEs run free-tier scanners and trust the team&apos;s code review. One can&apos;t afford more; the other
        doesn&apos;t know what it&apos;s missing. Both leave the same gap.
      </p>

      <div
        data-reveal
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          margin: '44px 0 0',
        }}
      >
        <Button href="/request-session">Book a consultation</Button>
        <Button href="#demo-scan" variant="ghost">
          See the demo scan <span aria-hidden="true">→</span>
        </Button>
      </div>
    </Section>
  );
}
