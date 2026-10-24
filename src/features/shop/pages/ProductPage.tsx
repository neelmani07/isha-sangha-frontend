import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Globe, Mail, MapPin, MessageCircle, Phone, Truck } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { NotFoundPage } from '../../../pages/NotFoundPage';
import { deliveryLabel, priceText, sellerLinks, shopApi, shopCategoryLabel, shopRules } from '../api/shopApi';
import { ProductCard, ProductPhoto } from '../components/ProductCard';

const linkIcon = { whatsapp: MessageCircle, phone: Phone, email: Mail, website: Globe };

export function ProductPage() {
  const { slug = '' } = useParams();
  const { data: item, isLoading, isError } = useQuery({ queryKey: ['shop-item', slug], queryFn: () => shopApi.bySlug(slug) });
  const all = useQuery({ queryKey: ['shop'], queryFn: shopApi.list });

  if (isError) return <NotFoundPage />;
  if (isLoading || !item) return <div className="min-h-[60vh] bg-cream pt-[var(--header-h)]" aria-busy="true" />;

  const links = sellerLinks(item);
  const more = (all.data ?? []).filter((other) => other.slug !== item.slug && other.sellerName === item.sellerName).slice(0, 4);

  return (
    <main className="bg-cream pt-[var(--header-h)] font-body text-ink">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
          <ArrowLeft size={16} /> Sangha Shop
        </Link>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <ProductPhoto item={item} className="aspect-square w-full rounded-xl border border-border" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{shopCategoryLabel[item.category]}</p>
            <h1 className="mt-2 font-display text-4xl leading-tight">{item.title}</h1>
            <p className="mt-4 font-display text-2xl text-maroon">{priceText(item)}</p>
            <div className="mt-5 grid gap-2 text-sm text-muted">
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} className="text-saffron" />
                Sold by <strong className="text-ink">{item.sellerName}</strong> in{' '}
                <Link to={`/city/${item.citySlug}`} className="font-semibold text-ink underline-offset-2 hover:underline">
                  {item.cityName}
                </Link>
              </span>
              <span className="inline-flex items-center gap-2">
                <Truck size={16} className="text-saffron" /> {deliveryLabel[item.delivery]}
              </span>
            </div>
            {item.description && <p className="mt-6 whitespace-pre-line text-[17px] leading-relaxed text-ink/85">{item.description}</p>}

            <div className="mt-8 rounded-lg border border-border bg-white p-5 shadow-card">
              <p className="font-semibold">Contact the seller to buy</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {links.map((link, index) => {
                  const Icon = linkIcon[link.key];
                  return (
                    <a
                      key={link.key}
                      href={link.href}
                      target={link.key === 'website' || link.key === 'whatsapp' ? '_blank' : undefined}
                      rel="noreferrer"
                      className={`inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition ${
                        index === 0 ? 'bg-saffron text-cream hover:bg-saffron-dark' : 'border border-border text-ink hover:border-gold/60'
                      }`}
                    >
                      <Icon size={16} /> {link.label}
                    </a>
                  );
                })}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted">
                Payment and delivery are agreed directly with the seller. Isha Sangha does not take payment and is not part of
                Isha Foundation.
              </p>
            </div>
          </div>
        </div>

        {more.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl">More from {item.sellerName}</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {more.map((other) => (
                <ProductCard key={other.slug} item={other} />
              ))}
            </div>
          </section>
        )}

        <details className="mt-12 rounded-lg border border-border bg-white p-5 text-sm text-muted">
          <summary className="cursor-pointer font-semibold text-ink">Shop rules</summary>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            {shopRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </details>
      </div>
    </main>
  );
}
