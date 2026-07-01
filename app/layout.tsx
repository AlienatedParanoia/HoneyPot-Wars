import type { Metadata } from 'next';
import { Press_Start_2P, VT323 } from 'next/font/google';
import './globals.css';
import { PixelatedCanvas } from '@/components/ui/pixel-cursor';
import { FallingPattern } from '@/components/ui/falling-pattern';

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start',
  display: 'swap',
});

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Honeypot Wars — Coverage Assurance for the Fraud-Defence Generation',
  description:
    'Honeypot Wars stress-tests your fraud defences against novel attack patterns and tells you exactly where your coverage fails.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${pressStart.variable} ${vt323.variable}`}>
      <body>
        {/* Site-wide animated backdrop. Fixed, behind all content (z-index:0),
            pointer-events:none so it never blocks clicks. Gold particles on the
            near-black brand background; kept subtle via .hw-bg-layer opacity. */}
        <div aria-hidden="true" className="hw-bg-layer">
          <FallingPattern color="#FFD700" backgroundColor="#0D0D0D" duration={150} blurIntensity="1.25em" density={1} />
        </div>
        {/* All page content stacks above the backdrop. */}
        <div className="hw-content">{children}</div>
        {/* Site-wide pixel cursor overlay. pointer-events:none so it never blocks clicks. */}
        <div aria-hidden="true" style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999 }}>
          <PixelatedCanvas />
        </div>
      </body>
    </html>
  );
}
