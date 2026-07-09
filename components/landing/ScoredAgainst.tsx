import { Section } from '@/components/ui/section';
import { C, MONO } from '@/lib/theme';

const TOOLS = ['GitHub Secret Scanning', 'Snyk', 'SonarQube', 'Dependabot'];

export function ScoredAgainst() {
  return (
    <Section label="Scored against" style={{ padding: '72px 0 0' }}>
      <div
        data-reveal
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '36px',
          fontFamily: MONO,
          fontSize: '13px',
        }}
      >
        <span className="hw-mono-label">Scored against</span>
        {TOOLS.map((t) => (
          <span key={t} style={{ color: C.muted }}>
            {t}
          </span>
        ))}
      </div>
    </Section>
  );
}
