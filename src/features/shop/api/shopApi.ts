import { apiGet } from '../../../api/apiClient';
import type { ShopCategory, ShopDelivery, ShopListing } from '../../../types/api';

export const shopApi = {
  list: () => apiGet<ShopListing[]>('/shop'),
  bySlug: (slug: string) => apiGet<ShopListing>(`/shop/slug/${slug}`),
};

/** Shown on the shop pages and confirmed by every seller. */
export const shopRules = [
  'Only things you make, grow or have the right to sell.',
  'Nothing carrying the Isha or Sadhguru name, logo or photos.',
  'Nothing presented as consecrated or as an official Isha product.',
  'Payment and delivery are agreed between buyer and seller. The site never takes payment.',
];

export const shopCategoryLabel: Record<ShopCategory, string> = {
  FOOD: 'Food & farm',
  CRAFTS: 'Crafts',
  CLOTHING: 'Clothing',
  BOOKS: 'Books & art',
  WELLNESS: 'Wellness',
  HOME: 'Home',
  OTHER: 'Other',
};

export const deliveryLabel: Record<ShopDelivery, string> = {
  PICKUP: 'Pick up in person',
  LOCAL_DELIVERY: 'Delivers locally',
  SHIPS_COUNTRY: 'Ships within the country',
  SHIPS_WORLDWIDE: 'Ships worldwide',
};

/** Price as the seller wrote it: amount in rupees by default, with any note ("per litre"). */
export function priceText(item: Pick<ShopListing, 'priceAmount' | 'priceNote' | 'currency'>) {
  if (item.priceAmount == null) return item.priceNote ?? 'Ask the seller';
  const amount = Number(item.priceAmount).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  const noteHasCurrency = item.priceNote && /\b(EUR|USD|AUD|GBP|CAD|SGD)\b/.test(item.priceNote);
  const prefix = noteHasCurrency ? '' : item.currency === 'INR' ? '₹' : `${item.currency} `;
  return `${prefix}${amount}${item.priceNote ? ` ${item.priceNote}` : ''}`;
}

/** Ways to reach the seller, most direct first. */
export function sellerLinks(item: ShopListing) {
  const message = encodeURIComponent(`Namaskaram! I saw "${item.title}" on the Isha Sangha shop and would like to know more.`);
  return [
    item.contactWhatsapp && { key: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/${item.contactWhatsapp}?text=${message}` },
    item.contactPhone && { key: 'phone', label: 'Call', href: `tel:${item.contactPhone.replace(/[^\d+]/g, '')}` },
    item.contactEmail && {
      key: 'email',
      label: 'Email',
      href: `mailto:${item.contactEmail}?subject=${encodeURIComponent(item.title)}&body=${message}`,
    },
    item.contactWebsite && { key: 'website', label: 'Website', href: item.contactWebsite },
  ].filter(Boolean) as { key: 'whatsapp' | 'phone' | 'email' | 'website'; label: string; href: string }[];
}
