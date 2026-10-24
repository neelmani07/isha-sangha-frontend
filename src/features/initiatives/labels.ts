import type { InitiativeKind, InitiativeNeed } from '../../types/api';

export const kindLabel: Record<InitiativeKind, string> = {
  WELLBEING: 'Yoga & wellbeing',
  ENVIRONMENT: 'Environment',
  EDUCATION: 'Education',
  SEVA: 'Seva & care',
  VENTURE: 'Venture',
};

export const initiativeKinds: { value: InitiativeKind | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All' },
  ...(Object.keys(kindLabel) as InitiativeKind[]).map((value) => ({ value, label: kindLabel[value] })),
];

export const needLabel: Record<InitiativeNeed, string> = {
  VOLUNTEERS: 'Volunteers',
  FUNDS: 'Funds',
  SPACE: 'Space',
  SKILLS: 'Skills',
  MATERIALS: 'Materials',
};

/** "How can I help?" groups shown as the main filter. */
export const helpGroups: { value: 'ALL' | 'TIME' | 'SKILLS' | 'FUNDS' | 'SPACE'; label: string; needs: InitiativeNeed[] }[] = [
  { value: 'ALL', label: 'Show everything', needs: [] },
  { value: 'TIME', label: 'I can give time', needs: ['VOLUNTEERS'] },
  { value: 'SKILLS', label: 'I have a skill', needs: ['SKILLS'] },
  { value: 'FUNDS', label: 'I can give funds', needs: ['FUNDS'] },
  { value: 'SPACE', label: 'I can offer space or things', needs: ['SPACE', 'MATERIALS'] },
];

export type HelpGroup = (typeof helpGroups)[number]['value'];
