import Link from 'next/link';
import { Wordmark } from '@/components/ui/wordmark';
import { C, DISPLAY } from '@/lib/theme';

// Framed page shell used by the auth, dashboard, and admin screens.
export function Shell({
  title,
  subtitle,
  children,
  maxWidth = '760px',
  right,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
  right?: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh', padding: '32px 20px', color: C.text }}>
      <div style={{ maxWidth, margin: '0 auto' }}>
        <div
          style={{
            padding: '32px',
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 'var(--r-card)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              paddingBottom: '24px',
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <Wordmark size={12} />
            {right}
          </div>
          <h1
            style={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: '26px',
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              color: C.text,
              margin: '28px 0 0',
            }}
          >
            {title}
          </h1>
          {subtitle && <p style={{ fontSize: '15px', color: C.muted, margin: '10px 0 0' }}>{subtitle}</p>}
          <div style={{ marginTop: '28px' }}>{children}</div>
        </div>
      </div>
    </div>
  );
}

export const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  color: C.muted,
  margin: '0 0 8px',
};

// Inputs use className="hw-input" and buttons use <Button> — both need
// :focus/:hover, which a plain style object cannot express.

// Bordered content panel, repeated across the dashboard and admin screens.
export const panelStyle: React.CSSProperties = {
  border: `1px solid ${C.border}`,
  borderRadius: 'var(--r-card)',
  padding: '22px',
};

export function BackLink({ href = '/admin', children = 'Back to console' }: { href?: string; children?: string }) {
  return (
    <Link href={href} style={{ color: C.accent, fontSize: '14px' }}>
      ← {children}
    </Link>
  );
}
