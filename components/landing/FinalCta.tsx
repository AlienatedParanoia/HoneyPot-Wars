import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { C, DISPLAY } from '@/lib/theme';

export function FinalCta() {
  return (
    <Section id="request" label="Book a consultation" style={{ padding: '140px 0 0' }}>
      <div
        data-reveal
        style={{
          background: C.accent,
          color: C.accentInk,
          borderRadius: 'var(--r-card)',
          padding: 'clamp(48px, 7vw, 88px) 32px',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontSize: 'clamp(30px, 5vw, 60px)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            margin: 0,
            textWrap: 'balance',
          }}
        >
          Find them before an attacker does.
        </h2>
        <p style={{ fontSize: '16px', lineHeight: 1.6, margin: '24px auto 0', maxWidth: '48ch', opacity: 0.75 }}>
          Every engagement starts with a consultation. We scope it, you consent to it, then we run it.
        </p>
        <div style={{ margin: '40px 0 0' }}>
          {/* Inverted: on the lime panel the primary pill would disappear. */}
          <Button href="/request-session" className="hw-btn--invert">
            Book a consultation
          </Button>
        </div>
      </div>
    </Section>
  );
}
