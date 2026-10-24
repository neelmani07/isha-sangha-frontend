import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type BadgeVariant = 'default' | 'leaf' | 'gold' | 'ember' | 'sky' | 'shop' | 'temple' | 'saffron';

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variants: Record<BadgeVariant, string> = {
  default: 'border-border bg-sand text-muted',
  leaf: 'border-leaf/25 bg-leaf/10 text-leaf',
  saffron: 'border-saffron/25 bg-saffron-light text-saffron-dark',
  gold: 'border-gold/30 bg-gold/10 text-ink',
  ember: 'border-ember/25 bg-ember/10 text-ember',
  sky: 'border-sky-200 bg-sky-50 text-sky-800',
  shop: 'border-lime-300 bg-lime-50 text-lime-900',
  temple: 'border-orange-200 bg-orange-50 text-orange-900',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-pill border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.1em] ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function DistanceBadge({ distance }: { distance: string }) {
  return (
    <Badge variant="saffron" className="normal-case tracking-normal">
      {distance}
    </Badge>
  );
}

export function ProgramBadge({ name }: { name: string }) {
  const variant = programVariant(name);
  return (
    <Badge variant={variant} className="normal-case tracking-normal">
      {name}
    </Badge>
  );
}

function programVariant(name: string): BadgeVariant {
  const lower = name.toLowerCase();
  if (lower.includes('surya')) return 'saffron';
  if (lower.includes('angamardana')) return 'ember';
  if (lower.includes('bhuta')) return 'leaf';
  return 'default';
}

type LinkButtonProps = {
  to: string;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
};

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'gold' | 'dark';

const linkVariantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-saffron text-white border border-saffron hover:bg-saffron-dark',
  secondary: 'bg-white text-ink border border-border hover:border-saffron/40',
  ghost: 'bg-transparent text-ink border border-border hover:bg-sand',
  gold: 'bg-saffron text-white border border-saffron hover:bg-saffron-dark',
  dark: 'bg-ink text-white border border-ink hover:bg-ink/90',
};

const linkSizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-sm',
  lg: 'px-5 py-4 text-base',
};

export function LinkButton({ to, variant = 'primary', size = 'md', children, className = '' }: LinkButtonProps) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-semibold transition ${linkVariantClasses[variant]} ${linkSizeClasses[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
