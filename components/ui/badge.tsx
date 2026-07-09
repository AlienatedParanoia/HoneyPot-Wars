import { cn } from '@/lib/utils';

export function Badge({
  children,
  dot = true,
  className,
}: {
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span className={cn('hw-badge', className)}>
      {dot && <span aria-hidden="true" className="hw-badge__dot" />}
      {children}
    </span>
  );
}
