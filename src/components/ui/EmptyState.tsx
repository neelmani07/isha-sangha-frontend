import type { ReactNode } from 'react';
import { MapPin } from 'lucide-react';

type EmptyStateProps = {
  title?: string;
  message: string;
  action?: ReactNode;
};

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-white p-8 text-center shadow-card">
      <MapPin className="mx-auto text-saffron/50" size={32} />
      {title && <h3 className="mt-4 font-display text-xl font-semibold text-ink">{title}</h3>}
      <p className="mt-2 text-sm text-muted">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
