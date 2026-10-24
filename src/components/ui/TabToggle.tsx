import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type TabItem = {
  key: string;
  label: string;
  icon?: ReactNode;
  to?: string;
  active?: boolean;
};

export function TabToggle({ items }: { items: TabItem[] }) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-white p-1 shadow-panel">
      {items.map((item) => {
        const className = `inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
          item.active
            ? 'bg-saffron-light text-saffron-dark ring-1 ring-saffron/20'
            : 'text-ink hover:bg-sand'
        }`;

        if (item.to) {
          return (
            <Link key={item.key} to={item.to} className={className}>
              {item.icon}
              {item.label}
            </Link>
          );
        }

        return (
          <span key={item.key} className={className} aria-current="page">
            {item.icon}
            {item.label}
          </span>
        );
      })}
    </div>
  );
}
