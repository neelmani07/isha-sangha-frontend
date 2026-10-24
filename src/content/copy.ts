// All shared wording for the site, in one place.
//
// House style (agreed 2026-10-24):
// - Indian English spelling: centre, organisation, programme, colour.
// - Sanskrit and spiritual terms used freely: seva, sadhana, satsang, sangha, Devi.
// - Warm and simple: short sentences, gentle and welcoming; "Namaskaram" only in greetings.
// - People on the map are "meditators".
//
// Internal names in code, the database and web addresses (CENTER, /center/...) stay as they are;
// only words people read come from here.

import type { CenterType, TeachingMode } from '../types/api';

/** Names of things, singular and plural. */
export const terms = {
  centre: 'centre',
  centres: 'centres',
  programme: 'programme',
  programmes: 'programmes',
  teacher: 'teacher',
  teachers: 'teachers',
  meditator: 'meditator',
  meditators: 'meditators',
  city: 'city',
  cities: 'cities',
};

/** Labels for each kind of place or person, as shown on badges, maps and search results. */
export const entityLabel: Record<string, string> = {
  COUNTRY: 'Country',
  STATE: 'State',
  CITY: 'City',
  CENTER: 'Centre',
  CITY_CENTER: 'Isha centre',
  MAJOR_CENTER: 'Ashram',
  DEVI_TEMPLE: 'Devi temple',
  ISHA_SHOP: 'Isha shop',
  TEACHER: 'Teacher',
  MEDITATOR: 'Meditator',
};

export function labelFor(type: string) {
  return entityLabel[type] ?? type.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}

export const centreTypeLabel: Record<CenterType, string> = {
  CITY_CENTER: 'Isha centre',
  MAJOR_CENTER: 'Ashram',
  DEVI_TEMPLE: 'Devi temple',
  ISHA_SHOP: 'Isha shop',
};

/** Short plural labels for filter chips. */
export const centreTypeFilterLabel: Record<CenterType, string> = {
  CITY_CENTER: 'Centres',
  MAJOR_CENTER: 'Ashrams',
  DEVI_TEMPLE: 'Temples',
  ISHA_SHOP: 'Shops',
};

export const teachingModeLabel: Record<TeachingMode, string> = {
  IN_PERSON: 'In person',
  ONLINE: 'Online',
  BOTH: 'In person and online',
};

/** Navigation and account labels. */
export const nav = {
  explore: 'Explore',
  stories: 'Stories',
  initiatives: 'Your Initiatives',
  donate: 'Donate',
  join: 'Join the map',
  myProfile: 'My profile & listings',
  signIn: 'Sign in',
  signOut: 'Sign out',
  feedback: 'Feedback',
  nearMe: 'Near me',
  teachers: 'Teachers',
  centres: 'Centres',
  search: 'Search',
};

/** Page headings, introductions and calls to action. */
export const pages = {
  explore: {
    eyebrow: 'Discover',
    title: 'Find Isha',
    subtitle: 'wherever you are',
    intro: 'Centres, teachers, Devi temples and fellow meditators across the world, and the stories that connect them.',
    searchPlaceholder: 'Search cities, centres, teachers',
    nearMe: {
      eyebrow: 'Near me',
      title: 'Find Isha near you',
      subtitle: 'teachers, centres and temples close by',
      join: 'Add yourself to the map',
    },
    browse: {
      eyebrow: 'Search & browse',
      title: 'Look up a place or a person',
      subtitle: 'across every country, city and centre',
      placeholder: 'Try “Coimbatore”, “Mumbai” or a teacher’s name',
      teachers: { title: 'All teachers', text: 'Isha Hatha Yoga teachers and the programmes they offer.' },
      centres: { title: 'All centres', text: 'Isha centres, ashrams, Devi temples and Isha shops.' },
      search: { title: 'Search everything', text: 'Every country, state, city, centre and teacher.' },
    },
    stories: { eyebrow: 'From the sangha', title: 'Stories from these places', subtitle: 'grace, change and the magic of Devi' },
    initiatives: { eyebrow: 'Your initiatives', title: 'Seva that started with one person', subtitle: 'and grew with the sangha' },
    donate: {
      title: 'Your contribution',
      subtitle: "can change someone's life",
      text: 'This sangha runs on volunteers. A small gift helps a tuition class buy books, a planting drive buy saplings, and keeps this map free for everyone.',
    },
  },
  search: {
    title: 'Search',
    description: 'Find cities, centres, teachers and Devi temples on the map.',
    placeholder: 'Search cities, centres, teachers…',
    emptyTitle: 'Where would you like to go?',
    emptyMessage: 'Type a city, a centre or a teacher’s name.',
    noResults: 'Nothing found. Try another spelling or a nearby city.',
  },
  teachers: {
    title: 'Teachers',
    description: 'Isha Hatha Yoga teachers around the world, and the programmes they offer.',
  },
  centres: {
    title: 'Centres',
    description: 'Isha centres, ashrams, Devi temples and Isha shops around the world.',
  },
  feedback: {
    title: 'Feedback',
    description: 'Spotted a mistake, missing a place, or have an idea? Tell us. Every message is read by a volunteer.',
  },
  notFound: {
    title: 'Page not found',
    description: 'This part of the map hasn’t been charted yet.',
    message: 'The page you’re looking for doesn’t exist or may have moved.',
  },
};
