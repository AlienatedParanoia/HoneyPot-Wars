import { Section } from '@/components/ui/section';
import { C, DISPLAY } from '@/lib/theme';

const CARDS = [
  {
    title: 'Scanners match patterns, not intent',
    body: 'A free-tier scanner flags a known CVE signature. It cannot reason about a token that validates correctly but never expires, because nothing in that code looks wrong on its own.',
  },
  {
    title: 'Code review trusts the author',
    body: 'Your reviewer reads the diff the way it was meant to be read. An attacker reads it looking for the path you did not consider — and chains two safe-looking changes into one exploit.',
  },
  {
    title: 'The gap only shows up in a breach',
    body: 'Nothing in your dashboard reports the vulnerability nobody tested for. By the time the finding has a date attached, it has a cost attached too.',
  },
];

export function Problem() {
  return (
    <Section id="problem" label="The problem" style={{ padding: '140px 0 0' }}>
      <p data-reveal className="hw-mono-label" style={{ margin: 0 }}>
        The problem
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
        You don&apos;t know what you&apos;re missing.
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          margin: '64px 0 0',
        }}
      >
        {CARDS.map((c) => (
          <div
            key={c.title}
            data-reveal
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 'var(--r-card)',
              padding: '28px',
            }}
          >
            <h3 style={{ fontSize: '17px', fontWeight: 600, color: C.text, margin: '0 0 14px', lineHeight: 1.35 }}>
              {c.title}
            </h3>
            <p style={{ fontSize: '15px', lineHeight: 1.6, color: C.muted, margin: 0, textWrap: 'pretty' }}>{c.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
