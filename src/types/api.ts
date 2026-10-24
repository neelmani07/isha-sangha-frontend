export type CommunityStats = {
  meditatorCount: number;
  volunteerCount: number;
  teacherCount: number;
  yantraCount: number;
  sannidhiCount: number;
  centerCount: number;
  templeCount: number;
  shopCount: number;
};

export type Country = {
  id: number;
  name: string;
  isoCode: string;
  latitude: number | null;
  longitude: number | null;
  cities: number;
  teachers: number;
  centers: number;
};

export type City = {
  id: number;
  countryId: number;
  countryName: string;
  stateId: number;
  stateName: string;
  slug: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  heroImageUrl: string | null;
  active: boolean;
  stats: CommunityStats;
};

export type CenterType = 'MAJOR_CENTER' | 'CITY_CENTER' | 'DEVI_TEMPLE' | 'ISHA_SHOP';

export type Center = {
  id: number;
  cityId: number;
  cityName: string;
  slug: string;
  name: string;
  type: CenterType;
  description: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  active: boolean;
  openingHours: string | null;
  photoUrl: string | null;
  languages: string | null;
  verified: boolean;
};

export type Program = {
  id: number;
  name: string;
  description: string | null;
};

export type Teacher = {
  id: number;
  cityId: number;
  cityName: string;
  slug: string;
  name: string;
  bio: string | null;
  photoUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  active: boolean;
  programs: Program[];
  teachingMode: TeachingMode;
  languages: string | null;
  yearsTeaching: number | null;
  verified: boolean;
};

export type TeachingMode = 'IN_PERSON' | 'ONLINE' | 'BOTH';

export type SearchResult = {
  type: 'COUNTRY' | 'STATE' | 'CITY' | 'CENTER' | 'TEACHER';
  id: number;
  slug: string | null;
  name: string;
  lat: number | null;
  lng: number | null;
};

export type FeedbackType = 'FEATURE_REQUEST' | 'DATA_CORRECTION' | 'GENERAL_FEEDBACK' | 'BUG';

export type Meditator = {
  id: number;
  displayName: string;
  cityId: number;
  cityName: string;
  citySlug: string;
  /** Approximate point inside the city, never the member's real location. */
  lat: number;
  lng: number;
  about: string | null;
  practices: string[];
  languages: string | null;
  openToConnect: boolean;
  openToVolunteer: boolean;
  visible: boolean;
};

export type NearbyResult = {
  type: string;
  id: number;
  slug: string | null;
  name: string;
  lat: number;
  lng: number;
  distanceKm: number;
  subtitle: string | null;
  citySlug: string | null;
};


export type InitiativeKind = 'WELLBEING' | 'ENVIRONMENT' | 'EDUCATION' | 'SEVA' | 'VENTURE';
export type InitiativeNeed = 'VOLUNTEERS' | 'FUNDS' | 'SPACE' | 'SKILLS' | 'MATERIALS';

export type Initiative = {
  id: number;
  slug: string;
  title: string;
  kind: InitiativeKind;
  summary: string;
  description: string | null;
  cityId: number;
  cityName: string;
  citySlug: string;
  lat: number | null;
  lng: number | null;
  startedYear: number | null;
  startedByName: string | null;
  needs: InitiativeNeed[];
  needsNote: string | null;
  contactWhatsapp: string | null;
  contactEmail: string | null;
  contactWebsite: string | null;
  photoUrl: string | null;
  supporters: number;
  supportedByMe: boolean;
};

export type InitiativeStats = { initiatives: number; supporters: number; places: number };

export type ResourceCategory = 'PROGRAMMES' | 'SEVA' | 'APPS' | 'READING' | 'VIDEOS' | 'GROUPS' | 'OTHER';

export type ResourceLink = {
  id: number;
  title: string;
  /** Null for members-only links when the visitor is not signed in. */
  url: string | null;
  host: string | null;
  description: string | null;
  category: ResourceCategory;
  membersOnly: boolean;
  cityId: number | null;
  cityName: string | null;
  language: string | null;
  helpful: number;
  helpfulByMe: boolean;
  sharedAt: string;
};

export type StoryCategory = 'DEVI' | 'TRANSFORMATION' | 'SADHANA' | 'SEVA';

export type Story = {
  id: number;
  slug: string;
  title: string;
  category: StoryCategory;
  excerpt: string;
  body: string;
  authorName: string;
  placeKind: 'city' | 'center' | null;
  placeSlug: string | null;
  placeName: string | null;
  cityId: number | null;
  photoUrl: string | null;
  featured: boolean;
  publishedAt: string;
  readMinutes: number;
  likes: number;
  likedByMe: boolean;
};

export type ShopCategory = 'FOOD' | 'CRAFTS' | 'CLOTHING' | 'BOOKS' | 'WELLNESS' | 'HOME' | 'OTHER';
export type ShopDelivery = 'PICKUP' | 'LOCAL_DELIVERY' | 'SHIPS_COUNTRY' | 'SHIPS_WORLDWIDE';

export type ShopListing = {
  id: number;
  slug: string;
  title: string;
  category: ShopCategory;
  description: string | null;
  priceAmount: number | null;
  priceNote: string | null;
  currency: string;
  delivery: ShopDelivery;
  cityId: number;
  cityName: string;
  citySlug: string;
  sellerName: string;
  contactWhatsapp: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  contactWebsite: string | null;
  photoUrl: string | null;
  listedAt: string;
};
