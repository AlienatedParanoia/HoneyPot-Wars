import { Chip, type Severity } from '@/components/ui/chip';
import { C, MONO } from '@/lib/theme';

type Finding = {
  level: Severity;
  title: string;
  file: string;
};

const FINDINGS: Finding[] = [
  { level: 'high', title: 'JWT verified without expiry check', file: 'auth.js:42' },
  { level: 'high', title: 'Wildcard CORS on authenticated route', file: 'server.js:23' },
  { level: 'med', title: 'DB credentials in committed config', file: 'config/db.js:7' },
  { level: 'low', title: 'Verbose stack traces in production', file: 'app.js:118' },
];

export function FindingsFeed() {
  return (
    <div className="hw-mockup__pane">
      <div className="hw-mono-label">Findings feed</div>
      <ul
        style={{
          listStyle: 'none',
          margin: '22px 0 0',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {FINDINGS.map((f) => (
          <li
            key={f.file}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              background: C.surface2,
              border: `1px solid ${C.border}`,
              borderRadius: '8px',
              padding: '14px 16px',
            }}
          >
            <Chip level={f.level} />
            <span style={{ flex: 1, fontSize: '14px', color: C.text }}>{f.title}</span>
            <span style={{ fontFamily: MONO, fontSize: '12px', color: C.muted, flex: 'none' }}>{f.file}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
