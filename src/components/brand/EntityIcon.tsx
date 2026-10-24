import type { LucideIcon } from 'lucide-react';
import { Building2, Globe2, Landmark, ShoppingBag, UserRound } from 'lucide-react';
import type { GlobeMarker } from '../../features/globe/types';

export type EntityKind =
  | 'all'
  | 'country'
  | 'city'
  | 'center'
  | 'teacher'
  | 'temple'
  | 'shop'
  | GlobeMarker['type'];

type EntityMeta = {
  Icon: LucideIcon;
  color: string;
  label: string;
};

const entityMeta: Record<string, EntityMeta> = {
  all: { Icon: Globe2, color: '#cf4520', label: 'All' },
  country: { Icon: Globe2, color: '#c45f12', label: 'Country' },
  COUNTRY: { Icon: Globe2, color: '#c45f12', label: 'Country' },
  city: { Icon: Building2, color: '#3d7a52', label: 'City' },
  CITY: { Icon: Building2, color: '#3d7a52', label: 'City' },
  center: { Icon: Landmark, color: '#d4a03c', label: 'Center' },
  CENTER: { Icon: Landmark, color: '#d4a03c', label: 'Center' },
  MAJOR_CENTER: { Icon: Landmark, color: '#d4a03c', label: 'Major center' },
  CITY_CENTER: { Icon: Landmark, color: '#b8892f', label: 'City center' },
  teacher: { Icon: UserRound, color: '#4a90b8', label: 'Teacher' },
  TEACHER: { Icon: UserRound, color: '#4a90b8', label: 'Teacher' },
  temple: { Icon: Landmark, color: '#c45f12', label: 'Temple' },
  DEVI_TEMPLE: { Icon: Landmark, color: '#c45f12', label: 'Temple' },
  shop: { Icon: ShoppingBag, color: '#6b9e3d', label: 'Shop' },
  ISHA_SHOP: { Icon: ShoppingBag, color: '#6b9e3d', label: 'Shop' },
};

export function getEntityMeta(kind: EntityKind) {
  return entityMeta[kind] ?? entityMeta.center;
}

type EntityIconProps = {
  kind: EntityKind;
  size?: 'sm' | 'md' | 'chip';
  showBackground?: boolean;
  className?: string;
};

export function EntityIcon({ kind, size = 'sm', showBackground = true, className = '' }: EntityIconProps) {
  const meta = getEntityMeta(kind);
  const dim = size === 'md' ? 'h-9 w-9' : size === 'chip' ? 'h-5 w-5' : 'h-7 w-7';
  const iconSize = size === 'chip' ? 12 : size === 'md' ? 16 : 14;
  const { Icon } = meta;

  const icon = <Icon size={iconSize} style={{ color: meta.color }} />;

  if (!showBackground) {
    return (
      <span className={`inline-flex ${className}`} aria-hidden>
        {icon}
      </span>
    );
  }

  if (size === 'chip') {
    return (
      <span
        className={`inline-grid ${dim} shrink-0 place-items-center rounded border border-border/80 bg-white ${className}`}
        aria-hidden
      >
        {icon}
      </span>
    );
  }

  return (
    <span
      className={`inline-grid ${dim} place-items-center rounded-md border border-border bg-white shadow-sm ${className}`}
      aria-hidden
    >
      {icon}
    </span>
  );
}

export function entityMarkerColor(kind: EntityKind) {
  return getEntityMeta(kind).color;
}
