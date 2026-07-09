import { Section } from '@/components/ui/section';
import { C, DISPLAY, MONO } from '@/lib/theme';

const STEPS = [
  {
    n: '01',
    title: 'You book a consultation',
    body: 'We scope the engagement to the repository and domain you register, and you sign a consent agreement covering exactly what we will touch. Nothing runs before that.',
  },
  {
    n: '02',
    title: 'The attacker agent works your code',
    body: 'It reads the repository for injection vectors, committed secrets, and insecure defaults, then probes the deployed app one category at a time — strictly inside your registered domain.',
  },
  {
    n: '03',
    title: 'The detector scores every action',
    body: 'A second agent watches every probe and classifies what actually broke. You get two reports: one technical, one written for a business owner.',
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" label="How it works" style={{ padding: '140px 0 0' }}>
      <p data-reveal className="hw-mono-label" style={{ margin: 0 }}>
        How it works
      </p>
      <h2
        data-reveal
        style={{
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: 'clamp(30px, 4.4vw, 52px)',
          lineHeight: 1.05,
          letterSpacing: '-0.015em',
          color: C.text,
          textTransform: 'uppercase',
          margin: '20px 0 0',
          maxWidth: '20ch',
        }}
      >
        Attack it before someone else does.
      </h2>

      <div style={{ margin: '64px 0 0', borderTop: `1px solid ${C.border}` }}>
        {STEPS.map((s) => (
          <div
            key={s.n}
            data-reveal
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto minmax(0, 1fr)',
              gap: '32px',
              alignItems: 'start',
              padding: '36px 0',
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <span style={{ fontFamily: MONO, fontSize: '13px', color: C.accent }}>{s.n}</span>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: C.text, margin: '0 0 12px' }}>{s.title}</h3>
              <p style={{ fontSize: '15px', lineHeight: 1.65, color: C.muted, margin: 0, maxWidth: '64ch', textWrap: 'pretty' }}>
                {s.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
