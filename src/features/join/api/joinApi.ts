import { apiDelete, apiGet, apiPost, apiPut, apiUpload } from '../../../api/apiClient';
import type {
  Center,
  CenterType,
  Initiative,
  InitiativeKind,
  InitiativeNeed,
  Meditator,
  ResourceCategory,
  ResourceLink,
  Teacher,
  TeachingMode,
} from '../../../types/api';

export type ListingStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ListingKind = 'TEACHER' | 'CENTER' | 'INITIATIVE' | 'RESOURCE';

export type MyListing = {
  kind: ListingKind;
  id: number;
  name: string;
  slug: string;
  cityName: string;
  status: ListingStatus;
  rejectionReason: string | null;
  submittedAt: string;
};

export type OwnListing = {
  status: ListingStatus;
  rejectionReason: string | null;
  proofKey: string;
  teacher: Teacher | null;
  center: Center | null;
  initiative: Initiative | null;
  resource: ResourceLink | null;
};

export type InitiativeSubmission = {
  title: string;
  kind: InitiativeKind;
  summary: string;
  description?: string;
  cityId: number;
  startedYear?: number;
  startedByName?: string;
  needs: InitiativeNeed[];
  needsNote?: string;
  contactWhatsapp?: string;
  contactEmail?: string;
  contactWebsite?: string;
  photoKey?: string;
};

export type ResourceSubmission = {
  title: string;
  url: string;
  description?: string;
  category: ResourceCategory;
  cityId?: number;
  language?: string;
  membersOnly: boolean;
};

export type MeditatorProfileInput = {
  name: string;
  cityId: number;
  about?: string;
  practices: string[];
  languages?: string;
  openToConnect: boolean;
  openToVolunteer: boolean;
  visible: boolean;
};

export type TeacherSubmission = {
  name: string;
  cityId: number;
  bio?: string;
  programIds: number[];
  teachingMode: TeachingMode;
  languages?: string;
  yearsTeaching?: number;
  phone?: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  proofKey: string;
};

export type CenterSubmission = {
  name: string;
  type: CenterType;
  cityId: number;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
  openingHours?: string;
  languages?: string;
  proofKey: string;
};

export const joinApi = {
  myMeditator: () => apiGet<Meditator>('/me/meditator'),
  saveMeditator: (body: MeditatorProfileInput) => apiPut<Meditator>('/me/meditator', body),
  deleteMeditator: () => apiDelete<null>('/me/meditator'),
  myListings: () => apiGet<MyListing[]>('/me/listings'),
  uploadProof: (file: File) => apiUpload<{ proofKey: string }>('/me/proofs', file),
  uploadImage: (file: File) => apiUpload<{ imageKey: string; url: string }>('/me/images', file),
  ownInitiative: (id: number) => apiGet<OwnListing>(`/me/listings/initiatives/${id}`),
  submitInitiative: (body: InitiativeSubmission) => apiPost<MyListing>('/me/listings/initiatives', body),
  updateInitiative: (id: number, body: InitiativeSubmission) => apiPut<MyListing>(`/me/listings/initiatives/${id}`, body),
  ownResource: (id: number) => apiGet<OwnListing>(`/me/listings/resources/${id}`),
  submitResource: (body: ResourceSubmission) => apiPost<MyListing>('/me/listings/resources', body),
  updateResource: (id: number, body: ResourceSubmission) => apiPut<MyListing>(`/me/listings/resources/${id}`, body),
  ownTeacher: (id: number) => apiGet<OwnListing>(`/me/listings/teachers/${id}`),
  ownCenter: (id: number) => apiGet<OwnListing>(`/me/listings/centers/${id}`),
  submitTeacher: (body: TeacherSubmission) => apiPost<MyListing>('/me/listings/teachers', body),
  updateTeacher: (id: number, body: TeacherSubmission) => apiPut<MyListing>(`/me/listings/teachers/${id}`, body),
  submitCenter: (body: CenterSubmission) => apiPost<MyListing>('/me/listings/centers', body),
  updateCenter: (id: number, body: CenterSubmission) => apiPut<MyListing>(`/me/listings/centers/${id}`, body),
};

export const practiceOptions = [
  'Isha Kriya',
  'Shambhavi Mahamudra',
  'Surya Kriya',
  'Surya Shakti',
  'Upa Yoga',
  'Angamardana',
  'Yogasanas',
  'Bhuta Shuddhi',
  'Shoonya Meditation',
  'Samyama',
];
