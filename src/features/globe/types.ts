export type GlobeMarkerType =
  | 'COUNTRY'
  | 'STATE'
  | 'CITY'
  | 'CENTER'
  | 'TEACHER'
  | 'MAJOR_CENTER'
  | 'CITY_CENTER'
  | 'DEVI_TEMPLE'
  | 'ISHA_SHOP'
  | 'MEDITATOR';

export type GlobeMarker = {
  id: number;
  slug?: string | null;
  name: string;
  type: GlobeMarkerType;
  lat: number;
  lng: number;
  teacherCount?: number;
  meditatorCount?: number;
  centerCount?: number;
  templeCount?: number;
  shopCount?: number;
};
