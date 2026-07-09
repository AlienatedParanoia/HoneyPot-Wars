'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wordmark } from '@/components/ui/wordmark';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '#problem', label: 'Problem' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#demo-scan', label: 'Demo scan' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={cn('hw-nav', scrolled && 'is-scrolled')}>
      <div
        className="hw-container"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
      >
        <Wordmark />
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <div className="hw-navlinks" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="hw-navlink">
                {l.label}
              </a>
            ))}
            <Link href="/login" className="hw-navlink">
              Login
            </Link>
          </div>
          <Button href="/request-session" size="sm">
            Book a consultation
          </Button>
        </div>
      </div>
    </nav>
  );
}
