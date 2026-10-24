import { apiDelete, apiGet, apiPost } from '../../../api/apiClient';
import type { ResourceCategory, ResourceLink } from '../../../types/api';

export const resourceLibraryApi = {
  list: () => apiGet<ResourceLink[]>('/resources'),
  markHelpful: (id: number) => apiPost<ResourceLink>(`/me/resources/${id}/helpful`, {}),
  unmarkHelpful: (id: number) => apiDelete<ResourceLink>(`/me/resources/${id}/helpful`),
};

export const categoryLabel: Record<ResourceCategory, string> = {
  PROGRAMMES: 'Programmes & events',
  SEVA: 'Seva',
  APPS: 'Apps & tools',
  READING: 'Reading',
  VIDEOS: 'Videos',
  GROUPS: 'Groups',
  OTHER: 'Other',
};

export const categoryOptions: { value: ResourceCategory | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Everything' },
  ...(Object.keys(categoryLabel) as ResourceCategory[]).map((value) => ({ value, label: categoryLabel[value] })),
];
