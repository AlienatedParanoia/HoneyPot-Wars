import { cn } from '@/lib/utils';

export function Section({
  id,
  children,
  className,
  style,
  label,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}) {
  return (
    <section id={id} aria-label={label} className={cn('hw-section', className)} style={style}>
      <div className="hw-container">{children}</div>
    </section>
  );
}
