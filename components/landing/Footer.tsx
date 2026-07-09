import Link from 'next/link';
import { Wordmark } from '@/components/ui/wordmark';
import { C } from '@/lib/theme';

const LINKS = [
  { href: '/login', label: 'Login' },
  { href: '#', label: 'Privacy' },
  { href: '#', label: 'Terms' },
  { href: '#', label: 'Contact' },
];

export function Footer() {
  return (
    <footer style={{ margin: '140px 0 0', borderTop: `1px solid ${C.border}` }}>
      <div className="hw-container" style={{ padding: '40px 24px' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <Wordmark size={12} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
            {LINKS.map((l, i) => (
              <Link key={`${l.label}-${i}`} href={l.href} className="hw-navlink">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <p style={{ fontSize: '13px', color: C.muted, margin: '32px 0 0' }}>
          © 2026 Honeypot Wars. Adversarial security code review, Singapore.
        </p>
      </div>
    </footer>
  );
}
