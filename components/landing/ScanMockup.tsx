import { BrowserCard } from '@/components/ui/browser-card';
import { Section } from '@/components/ui/section';
import { AttackerLog } from './AttackerLog';
import { FindingsFeed } from './FindingsFeed';

export function ScanMockup() {
  return (
    <Section id="demo-scan" label="Demo scan" style={{ padding: '96px 0 0' }}>
      <div data-reveal>
        <BrowserCard title="honeypotwars — scan in progress">
          <div className="hw-mockup">
            <AttackerLog />
            <FindingsFeed />
          </div>
        </BrowserCard>
      </div>
    </Section>
  );
}
