import type { ReactNode } from 'react';
import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs';
import { Badge } from '../ui/Badge';

type DetailPageLayoutProps = {
  title: string;
  subtitle?: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  badge?: string;
  badgeVariant?: 'default' | 'leaf' | 'gold' | 'ember' | 'shop' | 'temple' | 'sky' | 'saffron';
  heroImageUrl?: string | null;
  children?: ReactNode;
  actions?: ReactNode;
};

export function DetailPageLayout({
  title,
  subtitle,
  description,
  breadcrumbs,
  badge,
  badgeVariant = 'saffron',
  heroImageUrl,
  children,
  actions,
}: DetailPageLayoutProps) {
  return (
    <main className="min-h-screen bg-cream font-body text-ink">
      {heroImageUrl ? (
        <div className="relative h-48 overflow-hidden sm:h-64">
          <img src={heroImageUrl} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/50 to-transparent" />
        </div>
      ) : (
        <div className="h-28 bg-gradient-to-br from-saffron-light via-sand to-cream sm:h-36" />
      )}

      <div className="mx-auto max-w-7xl animate-fade-in px-4 sm:px-6 lg:px-8">
        <div className={heroImageUrl ? '-mt-16 relative' : 'pt-8'}>
          <Breadcrumbs items={breadcrumbs} />

          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              {badge && (
                <Badge variant={badgeVariant} className="mb-3">
                  {badge}
                </Badge>
              )}
              <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{title}</h1>
              {subtitle && <p className="mt-2 text-lg font-medium text-saffron-dark">{subtitle}</p>}
              {description && <p className="mt-4 text-lg leading-relaxed text-muted">{description}</p>}
            </div>
            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
          </div>

          <div className="mt-8 space-y-8 pb-10">{children}</div>
        </div>
      </div>
    </main>
  );
}
