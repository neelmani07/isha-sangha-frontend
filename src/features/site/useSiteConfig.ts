import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../../api/apiClient';

export type SiteConfig = {
  name: string;
  tagline: string;
  contactEmail: string;
  organization: {
    legalName: string;
    registrationNumber: string;
    taxExemption: string;
    address: string;
  };
  disclaimer: string;
  googleClientId: string | null;
  /** True while the site shows preview sample data. */
  sampleData: boolean;
};

// Used until the backend answers (or if it is unreachable), so the shell always renders.
const fallbackSiteConfig: SiteConfig = {
  name: 'Isha Sangha',
  tagline: 'A community of meditators, volunteers and seekers',
  contactEmail: '',
  organization: { legalName: '', registrationNumber: '', taxExemption: '', address: '' },
  disclaimer:
    'This is an independent volunteer community. It is not affiliated with, endorsed by, or operated by Isha Foundation.',
  googleClientId: null,
  sampleData: false,
};

export function useSiteConfig() {
  const { data } = useQuery({
    queryKey: ['site-config'],
    queryFn: () => apiGet<SiteConfig>('/site-config'),
    staleTime: Infinity,
    retry: 1,
  });

  return data ?? fallbackSiteConfig;
}
