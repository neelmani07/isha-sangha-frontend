import { apiDelete, apiGet, apiPost } from '../../../api/apiClient';
import type { Initiative, InitiativeStats } from '../../../types/api';

export const initiativesApi = {
  list: () => apiGet<Initiative[]>('/initiatives'),
  stats: () => apiGet<InitiativeStats>('/initiatives/stats'),
  bySlug: (slug: string) => apiGet<Initiative>(`/initiatives/slug/${slug}`),
  support: (id: number) => apiPost<Initiative>(`/me/initiatives/${id}/support`, {}),
  unsupport: (id: number) => apiDelete<Initiative>(`/me/initiatives/${id}/support`),
};

/** Ready-to-use contact links for an initiative, in the order supporters usually prefer. */
export function contactLinks(initiative: Initiative) {
  const message = encodeURIComponent(`Namaskaram! I found "${initiative.title}" on Isha Sangha and would like to help.`);
  return [
    initiative.contactWhatsapp && { key: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/${initiative.contactWhatsapp}?text=${message}` },
    initiative.contactEmail && {
      key: 'email',
      label: 'Email',
      href: `mailto:${initiative.contactEmail}?subject=${encodeURIComponent(initiative.title)}&body=${message}`,
    },
    initiative.contactWebsite && { key: 'website', label: 'Website', href: initiative.contactWebsite },
  ].filter(Boolean) as { key: 'whatsapp' | 'email' | 'website'; label: string; href: string }[];
}
