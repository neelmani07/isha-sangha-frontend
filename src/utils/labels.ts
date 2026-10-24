import type { CenterType } from '../types/api';
import { centreTypeLabel, labelFor } from '../content/copy';

type BadgeInfo = {
  label: string;
  variant: 'default' | 'leaf' | 'gold' | 'ember' | 'shop' | 'temple';
};

export function centerTypeBadge(type: CenterType): BadgeInfo {
  switch (type) {
    case 'MAJOR_CENTER':
      return { label: centreTypeLabel.MAJOR_CENTER, variant: 'gold' };
    case 'DEVI_TEMPLE':
      return { label: centreTypeLabel.DEVI_TEMPLE, variant: 'temple' };
    case 'ISHA_SHOP':
      return { label: centreTypeLabel.ISHA_SHOP, variant: 'shop' };
    case 'CITY_CENTER':
      return { label: centreTypeLabel.CITY_CENTER, variant: 'leaf' };
    default:
      return { label: String(type).replace(/_/g, ' '), variant: 'default' };
  }
}

export function formatEntityType(type: string) {
  return labelFor(type);
}
