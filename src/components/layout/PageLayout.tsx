import type { ReactNode } from 'react';
import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs';

type PageLayoutProps = {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: ReactNode;
  actions?: ReactNode;
};

export function PageLayout({ title, description, breadcrumbs, children, actions }: PageLayoutProps) {
  return (
    <main className="min-h-screen bg-cream font-body text-ink">
      <div className="mx-auto max-w-7xl animate-fade-in px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{title}</h1>
            {description && <p className="mt-3 text-lg text-muted">{description}</p>}
          </div>
          {actions}
        </div>

        <div className="mt-8 space-y-8">{children}</div>
      </div>
    </main>
  );
}

type SectionProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  actions?: ReactNode;
};

export function Section({ title, description, children, actions }: SectionProps) {
  return (
    <section className="animate-slide-up space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">{title}</h2>
          {description && <p className="mt-1 text-sm text-muted">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}
