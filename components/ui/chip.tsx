import { cn } from '@/lib/utils';

export type Severity = 'high' | 'med' | 'low';

export function Chip({ level, className }: { level: Severity; className?: string }) {
  return <span className={cn('hw-chip', `hw-chip--${level}`, className)}>{level.toUpperCase()}</span>;
}
