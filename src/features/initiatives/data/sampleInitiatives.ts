// Sample initiatives used to preview "Your Initiatives" until listings are stored in the backend.
// People and projects are invented; places point at cities that exist in the seed data.

import type { StoryPlace } from '../../stories/data/sampleStories';

export type InitiativeKind = 'WELLBEING' | 'ENVIRONMENT' | 'EDUCATION' | 'SEVA' | 'VENTURE';
export type InitiativeNeed = 'VOLUNTEERS' | 'FUNDS' | 'SPACE' | 'SKILLS' | 'MATERIALS';

export type Initiative = {
  slug: string;
  title: string;
  kind: InitiativeKind;
  summary: string;
  description: string[];
  imageId: string;
  startedBy: string;
  place: StoryPlace;
  /** Where the initiative happens, for the map view. */
  coords: { lat: number; lng: number };
  startedIn: number;
  needs: InitiativeNeed[];
  needsNote: string;
  supporters: number;
  contact: { whatsapp?: boolean; email?: boolean; website?: boolean };
};

export const initiativeKinds: { value: InitiativeKind | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'WELLBEING', label: 'Yoga & wellbeing' },
  { value: 'ENVIRONMENT', label: 'Environment' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'SEVA', label: 'Seva & care' },
  { value: 'VENTURE', label: 'Ventures' },
];

export const kindLabel: Record<InitiativeKind, string> = {
  WELLBEING: 'Yoga & wellbeing',
  ENVIRONMENT: 'Environment',
  EDUCATION: 'Education',
  SEVA: 'Seva & care',
  VENTURE: 'Venture',
};

export const needLabel: Record<InitiativeNeed, string> = {
  VOLUNTEERS: 'Volunteers',
  FUNDS: 'Funds',
  SPACE: 'Space',
  SKILLS: 'Skills',
  MATERIALS: 'Materials',
};

export const sampleInitiatives: Initiative[] = [
  {
    slug: 'saplings-for-school-grounds',
    title: 'Saplings for School Grounds',
    kind: 'ENVIRONMENT',
    summary: 'Turning bare government-school compounds into shaded green spaces, one native sapling at a time.',
    description: [
      'Many government schools around Coimbatore have large, bare compounds where children play in full sun. We plant native, fast-shading trees along the boundaries and teach the students to care for them.',
      'Each school adopts its trees: every class gets a few saplings with name boards, and the students water them through the dry months.',
      'So far we have planted around 1,400 saplings across 9 schools, with roughly 80% surviving their first summer.',
    ],
    imageId: '1542601906990-b4d3fb778b09',
    startedBy: 'Karthik V.',
    place: { kind: 'city', slug: 'coimbatore', name: 'Coimbatore' },
    coords: { lat: 11.0168, lng: 76.9558 },
    startedIn: 2023,
    needs: ['VOLUNTEERS', 'MATERIALS'],
    needsNote: 'Weekend volunteers for planting drives, plus tree guards and drip-irrigation kits.',
    supporters: 64,
    contact: { whatsapp: true, email: true },
  },
  {
    slug: 'sunday-yoga-in-the-park',
    title: 'Sunday Yoga in the Park',
    kind: 'WELLBEING',
    summary: 'Free simple yoga practices every Sunday morning for anyone who walks into Cubbon Park.',
    description: [
      'Every Sunday at 6:30 am we roll out mats under the trees and guide simple yoga practices and a short meditation, free and open to all.',
      'Walkers, joggers, grandparents and college students join. Some come once; many have been coming every week for two years.',
    ],
    imageId: '1601925260368-ae2f83cf8b7f',
    startedBy: 'Arjun K.',
    place: { kind: 'city', slug: 'bengaluru', name: 'Bengaluru' },
    coords: { lat: 12.9763, lng: 77.5929 },
    startedIn: 2022,
    needs: ['VOLUNTEERS', 'MATERIALS'],
    needsNote: 'Volunteers to set up and welcome people, and spare mats for first-timers.',
    supporters: 112,
    contact: { whatsapp: true, website: true },
  },
  {
    slug: 'evening-tuition-for-village-children',
    title: 'Evening Tuition for Village Children',
    kind: 'EDUCATION',
    summary: 'After-school maths, English and reading support for children in three villages near the Velliangiri foothills.',
    description: [
      'Most children in these villages are the first in their families to finish school. In the evenings there is no one at home who can help with homework.',
      'Volunteers run two-hour sessions, five evenings a week, in a borrowed community hall. We focus on reading, basic maths and spoken English.',
      'Around 70 children attend regularly. Last year every Class 10 student in the programme passed their board exams.',
    ],
    imageId: '1497486751825-1233686d5d80',
    startedBy: 'Lakshmi S.',
    place: { kind: 'center', slug: 'isha-yoga-center-coimbatore', name: 'Near Isha Yoga Centre' },
    coords: { lat: 10.9724, lng: 76.7366 },
    startedIn: 2021,
    needs: ['VOLUNTEERS', 'FUNDS', 'MATERIALS'],
    needsNote: 'Teachers (even one evening a week, online works too), notebooks and a small fund for evening snacks.',
    supporters: 48,
    contact: { whatsapp: true, email: true },
  },
  {
    slug: 'friday-meals',
    title: 'Friday Meals',
    kind: 'SEVA',
    summary: 'A warm vegetarian meal every Friday evening for anyone in the neighbourhood who needs one.',
    description: [
      'Every Friday a small team cooks a simple vegetarian meal in a community kitchen in Neukölln and serves it to whoever comes, no questions asked.',
      'We serve between 80 and 150 people each week. Leftover produce is donated by two local organic shops.',
    ],
    imageId: '1593113598332-cd288d649433',
    startedBy: 'Daniel W.',
    place: { kind: 'city', slug: 'berlin', name: 'Berlin' },
    coords: { lat: 52.4811, lng: 13.4354 },
    startedIn: 2024,
    needs: ['VOLUNTEERS', 'SPACE'],
    needsNote: 'Cooks and servers on Friday afternoons, and a larger kitchen for the winter months.',
    supporters: 37,
    contact: { email: true, website: true },
  },
  {
    slug: 'native-seed-library',
    title: 'Native Seed Library',
    kind: 'ENVIRONMENT',
    summary: 'Saving and sharing heirloom and native seeds with home gardeners and small farmers.',
    description: [
      'We collect, dry and catalogue seeds from local gardens and lend them out for free. Borrowers return a handful of seeds from their harvest.',
      'The library now holds more than 220 varieties, most of them native to the region.',
    ],
    imageId: '1466692476868-aef1dfb1e735',
    startedBy: 'Sarah T.',
    place: { kind: 'city', slug: 'mcminnville', name: 'McMinnville' },
    coords: { lat: 35.6834, lng: -85.7697 },
    startedIn: 2023,
    needs: ['SKILLS', 'VOLUNTEERS'],
    needsNote: 'Someone with cataloguing or database skills, and helpers for our spring seed swap.',
    supporters: 29,
    contact: { email: true },
  },
  {
    slug: 'kitchen-garden-collective',
    title: 'Kitchen Garden Collective',
    kind: 'VENTURE',
    summary: 'A small social enterprise selling organic vegetables grown on shared suburban plots.',
    description: [
      'We turn unused backyards into productive kitchen gardens. Owners get a share of the harvest; the rest is sold in weekly boxes.',
      'Profits pay two part-time growers and fund free gardening workshops for schools.',
    ],
    imageId: '1464226184884-fa280b87c399',
    startedBy: 'Emma L.',
    place: { kind: 'city', slug: 'melbourne', name: 'Melbourne' },
    coords: { lat: -37.8136, lng: 144.9631 },
    startedIn: 2024,
    needs: ['SPACE', 'FUNDS'],
    needsNote: 'More backyards to grow in, and early supporters for a delivery van.',
    supporters: 53,
    contact: { email: true, website: true },
  },
  {
    slug: 'elder-care-visits',
    title: 'Elder Care Visits',
    kind: 'SEVA',
    summary: 'Volunteers spend an afternoon a week with elders living alone: conversation, errands and a little chanting.',
    description: [
      'Many elders in our city live alone while their children work abroad. Loneliness is often harder for them than illness.',
      'Volunteers are paired with one elder and visit weekly: they talk, help with errands and medicines, and sometimes sing or chant together.',
    ],
    imageId: '1469571486292-0ba58a3f068b',
    startedBy: 'Priya N.',
    place: { kind: 'city', slug: 'bengaluru', name: 'Bengaluru' },
    coords: { lat: 12.9352, lng: 77.6245 },
    startedIn: 2022,
    needs: ['VOLUNTEERS'],
    needsNote: 'Kind, patient people who can commit to one afternoon a week for at least three months.',
    supporters: 71,
    contact: { whatsapp: true, email: true },
  },
];

/** "How can I help?" groups shown as the main filter. */
export const helpGroups: { value: 'ALL' | 'TIME' | 'SKILLS' | 'FUNDS' | 'SPACE'; label: string; needs: InitiativeNeed[] }[] = [
  { value: 'ALL', label: 'Show everything', needs: [] },
  { value: 'TIME', label: 'I can give time', needs: ['VOLUNTEERS'] },
  { value: 'SKILLS', label: 'I have a skill', needs: ['SKILLS'] },
  { value: 'FUNDS', label: 'I can give funds', needs: ['FUNDS'] },
  { value: 'SPACE', label: 'I can offer space or things', needs: ['SPACE', 'MATERIALS'] },
];

export type HelpGroup = (typeof helpGroups)[number]['value'];

export function findInitiative(slug: string | undefined) {
  return sampleInitiatives.find((initiative) => initiative.slug === slug);
}
