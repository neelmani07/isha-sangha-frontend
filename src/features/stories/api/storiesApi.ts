import { apiDelete, apiGet, apiPost } from '../../../api/apiClient';
import type { Story, StoryCategory } from '../../../types/api';

export const storiesApi = {
  list: () => apiGet<Story[]>('/stories'),
  bySlug: (slug: string) => apiGet<Story>(`/stories/slug/${slug}`),
  like: (id: number) => apiPost<Story>(`/me/stories/${id}/like`, {}),
  unlike: (id: number) => apiDelete<Story>(`/me/stories/${id}/like`),
};

export const categoryLabel: Record<StoryCategory, string> = {
  DEVI: 'Magic of Devi',
  TRANSFORMATION: 'Transformation',
  SADHANA: 'Sadhana',
  SEVA: 'Seva',
};

export const storyCategories: { value: StoryCategory | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All stories' },
  ...(Object.keys(categoryLabel) as StoryCategory[]).map((value) => ({ value, label: categoryLabel[value] })),
];

export function placeHref(story: Story) {
  if (!story.placeSlug) return null;
  return story.placeKind === 'center' ? `/center/${story.placeSlug}` : `/city/${story.placeSlug}`;
}
