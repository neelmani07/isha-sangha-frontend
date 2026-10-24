import type { CenterType } from '../types/api';

type BadgeInfo = {
  label: string;
  variant: 'default' | 'leaf' | 'gold' | 'ember' | 'shop' | 'temple';
};

export function centerTypeBadge(type: CenterType): BadgeInfo {
  switch (type) {
    case 'MAJOR_CENTER':
      return { label: 'Major center', variant: 'gold' };
    case 'DEVI_TEMPLE':
      return { label: 'Devi temple', variant: 'temple' };
    case 'ISHA_SHOP':
      return { label: 'Isha shop', variant: 'shop' };
    case 'CITY_CENTER':
      return { label: 'City center', variant: 'leaf' };
    default:
      return { label: String(type).replace(/_/g, ' '), variant: 'default' };
  }
}

export function formatEntityType(type: string) {
  return type.replace(/_/g, ' ');
}
