import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, Store } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClosingBand } from '../../../components/layout/ClosingBand';
import { BackdropPhoto } from '../../../components/ui/BackdropPhoto';
import { TwoToneHeading } from '../../../components/ui/TwoToneHeading';
import { sitePhotos } from '../../../content/sitePhotos';
import type { ShopCategory } from '../../../types/api';
import { shopApi, shopCategoryLabel, shopRules } from '../api/shopApi';
import { ProductCard } from '../components/ProductCard';

function SellLink({ className = '' }: { className?: string }) {
  return (
    <Link
      to="/shop/sell"
      className={`inline-flex items-center gap-2 rounded-md bg-saffron px-5 py-3 text-sm font-semibold text-cream shadow-card transition hover:bg-saffron-dark ${className}`}
    >
      <Store size={16} /> List something to sell
    </Link>
  );
}

const filters: (ShopCategory | 'ALL')[] = ['ALL', ...(Object.keys(shopCategoryLabel) as ShopCategory[])];

export function ShopPage() {
  const [category, setCategory] = useState<ShopCategory | 'ALL'>('ALL');
  const { data, isLoading } = useQuery({ queryKey: ['shop'], queryFn: shopApi.list });
  const items = useMemo(() => (data ?? []).filter((item) => category === 'ALL' || item.category === category), [data, category]);

  return (
    <main className="font-body text-ink">
      <section className="relative isolate overflow-hidden bg-maroon-dark pt-[var(--header-h)] text-cream">
        <BackdropPhoto photo={sitePhotos.velliangiriTridents} variant="fade-right" position="center 40%" className="-z-10 opacity-60" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-maroon-dark via-maroon-dark/80 to-transparent" />
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-24 lg:px-8">
          <div className="max-w-xl">
            <TwoToneHeading as="h1" size="lg" tone="light" title="Sangha Shop" subtitle="made, grown and shared by meditators" />
            <p className="mt-6 text-lg leading-relaxed text-cream/80">
              Cold-pressed oils, millets, hand-printed cloth, books and more, from volunteers in the community. Contact the
              seller directly to buy.
            </p>
            <div className="mt-8">
              <SellLink />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Categories">
          {filters.map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={category === value}
              onClick={() => setCategory(value)}
              className={`shrink-0 rounded-pill border px-4 py-1.5 text-sm font-semibold transition ${
                category === value ? 'border-maroon bg-maroon text-cream' : 'border-border bg-white text-muted hover:border-gold/60 hover:text-ink'
              }`}
            >
              {value === 'ALL' ? 'Everything' : shopCategoryLabel[value]}
            </button>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted">
          {isLoading ? 'Loading…' : items.length === 0 ? 'Nothing listed here yet.' : `${items.length} item${items.length === 1 ? '' : 's'}`}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {items.map((item) => (
            <ProductCard key={item.slug} item={item} />
          ))}
        </div>
      </section>

      <section className="bg-sand/60">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-[1fr_1.4fr] lg:px-8">
          <div>
            <TwoToneHeading title="Shop rules" subtitle="so the shop stays simple and honest" />
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              A volunteer reviews every listing before it appears. Isha Sangha is a community site and is not part of Isha
              Foundation; we do not check quality or handle disputes.
            </p>
          </div>
          <ul className="grid gap-3">
            {shopRules.map((rule) => (
              <li key={rule} className="flex gap-3 rounded-lg border border-border bg-white p-4 text-[15px] shadow-card">
                <ShieldCheck size={20} className="mt-0.5 shrink-0 text-leaf" /> {rule}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ClosingBand
        photo={sitePhotos.velliangiriMist}
        photoPosition="center 60%"
        title="Something to share?"
        subtitle="the sangha would love to know"
        text="If you grow, cook, stitch or write something with care, list it here. Buyers will reach you directly."
        action={<SellLink />}
      />
    </main>
  );
}
