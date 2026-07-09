import Link from 'next/link';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'ghost';

type BaseProps = {
  variant?: Variant;
  size?: 'md' | 'sm';
  className?: string;
  children: React.ReactNode;
};

type LinkProps = BaseProps & {
  href: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps | 'href'>;

type NativeProps = BaseProps & {
  href?: never;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>;

// Interaction states (:hover/:active/:focus-visible) can only live on a class,
// never on an inline style object — so every button routes through here.
export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: LinkProps | NativeProps) {
  const classes = cn(
    'hw-btn',
    variant === 'primary' ? 'hw-btn--primary' : 'hw-btn--ghost',
    size === 'sm' && 'hw-btn--sm',
    className,
  );

  if (typeof rest.href === 'string') {
    const { href, ...anchorProps } = rest as LinkProps;
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
