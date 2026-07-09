import { cn } from '@/lib/utils';

export function BrowserCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('hw-window', className)}>
      <div className="hw-window__bar">
        <div aria-hidden="true" className="hw-window__dots">
          <span className="hw-window__dot" />
          <span className="hw-window__dot" />
          <span className="hw-window__dot" />
        </div>
        <div className="hw-window__title">{title}</div>
        {/* Balances the dots so the title stays optically centered. */}
        <div aria-hidden="true" style={{ width: '44px', flex: 'none' }} />
      </div>
      {children}
    </div>
  );
}
