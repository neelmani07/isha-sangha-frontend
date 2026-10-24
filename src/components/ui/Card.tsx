import type { ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

type CardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
};

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-border bg-white shadow-card ${hover ? 'transition hover:-translate-y-0.5 hover:border-saffron/30 hover:shadow-card-hover' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

type LinkCardProps = LinkProps & {
  children: ReactNode;
  className?: string;
};

export function LinkCard({ children, className = '', ...props }: LinkCardProps) {
  return (
    <Link
      className={`block rounded-lg border border-border bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-saffron/30 hover:shadow-card-hover ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}

export function PanelCard({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-lg border border-border bg-white/90 p-5 shadow-panel backdrop-blur-md ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Card className="p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-ink">{value}</p>
    </Card>
  );
}
