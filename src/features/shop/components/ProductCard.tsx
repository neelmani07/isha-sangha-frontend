import { BookOpen, Flower2, Home, Leaf, Package, Scissors, Shirt, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mediaUrl } from '../../../api/apiClient';
import { PhotoImage } from '../../../components/ui/PhotoImage';
import type { ShopCategory, ShopListing } from '../../../types/api';
import { priceText, shopCategoryLabel } from '../api/shopApi';

export const categoryIcon: Record<ShopCategory, LucideIcon> = {
  FOOD: Leaf,
  CRAFTS: Scissors,
  CLOTHING: Shirt,
  BOOKS: BookOpen,
  WELLNESS: Flower2,
  HOME: Home,
  OTHER: Package,
};

/** Photo, or a calm category tile when the seller did not add one. */
export function ProductPhoto({ item, className = '' }: { item: ShopListing; className?: string }) {
  const Icon = categoryIcon[item.category];
  if (item.photoUrl) {
    return <PhotoImage src={mediaUrl(item.photoUrl) ?? undefined} alt={item.title} className={className} />;
  }
  return (
    <div className={`grid place-items-center bg-gradient-to-br from-gold-light to-sand text-gold ${className}`} aria-hidden="true">
      <Icon size={40} strokeWidth={1.3} />
    </div>
  );
}

export function ProductCard({ item }: { item: ShopListing }) {
  return (
    <Link
      to={`/shop/${item.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-white shadow-card transition hover:-translate-y-0.5 hover:border-gold/50"
    >
      <ProductPhoto item={item} className="aspect-[4/3] w-full" />
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">{shopCategoryLabel[item.category]}</p>
        <h3 className="mt-1.5 font-display text-base leading-snug sm:text-lg text-ink group-hover:text-saffron">{item.title}</h3>
        <p className="mt-auto pt-3 font-semibold text-maroon">{priceText(item)}</p>
        <p className="mt-1 text-sm text-muted">
          {item.sellerName} · {item.cityName}
        </p>
      </div>
    </Link>
  );
}
