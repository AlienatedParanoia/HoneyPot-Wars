import Link from 'next/link';
import { C } from '@/lib/theme';

// The diamond is an inline SVG rather than a glyph: font coverage for
// geometric and emoji characters varies by OS, so a text mark would render
// inconsistently across platforms.
export function Wordmark({ href = '/', size = 13 }: { href?: string | null; size?: number }) {
  const inner = (
    <>
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" style={{ flex: 'none' }}>
        <rect
          x="7"
          y="0.5"
          width="9.2"
          height="9.2"
          transform="rotate(45 7 0.5)"
          fill="none"
          stroke={C.accent}
          strokeWidth="1.5"
        />
        <rect x="7" y="4.2" width="3.9" height="3.9" transform="rotate(45 7 4.2)" fill={C.accent} />
      </svg>
      <span
        style={{
          fontFamily: 'var(--font-display), system-ui, sans-serif',
          fontWeight: 800,
          fontSize: `${size}px`,
          letterSpacing: '1.5px',
          color: C.text,
        }}
      >
        HONEYPOT WARS
      </span>
    </>
  );

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  };

  if (href === null) return <span style={style}>{inner}</span>;

  return (
    <Link href={href} style={style} aria-label="Honeypot Wars — home">
      {inner}
    </Link>
  );
}
