import { C, MONO } from '@/lib/theme';

type LogLine = {
  text: string;
  /** The moment the attacker breaks through — the one lime line in the panel. */
  hit?: boolean;
  /** Still running; rendered dimmed with a caret instead of a chevron. */
  pending?: boolean;
};

const LINES: LogLine[] = [
  { text: 'probing auth flows' },
  { text: 'tracing token lifecycle' },
  { text: 'chaining cors + expiry' },
  { text: 'exploit path confirmed', hit: true },
  { text: 'detector scoring…', pending: true },
];

export function AttackerLog() {
  return (
    <div className="hw-mockup__pane">
      <div className="hw-mono-label">Attacker agent</div>
      <ul
        style={{
          listStyle: 'none',
          margin: '22px 0 0',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          fontFamily: MONO,
          fontSize: '13px',
        }}
      >
        {LINES.map((line) => (
          <li
            key={line.text}
            style={{
              display: 'flex',
              gap: '10px',
              color: line.hit ? C.accent : line.pending ? C.border : C.muted,
            }}
          >
            <span aria-hidden="true" style={{ flex: 'none' }}>
              {line.pending ? '_' : '»'}
            </span>
            <span>{line.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
