import type { ReactNode } from 'react';

type FilterChipProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
  color?: string;
  icon?: ReactNode;
};

export function FilterChip({ label, active = false, onClick, color, icon }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition ${
        active
          ? 'border-saffron bg-saffron-light text-saffron-dark shadow-sm ring-1 ring-saffron/20'
          : 'border-border bg-white text-ink hover:border-saffron/40 hover:bg-sand/50'
      }`}
    >
      {icon}
      {!icon && color && <span className="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-black/10" style={{ backgroundColor: color }} />}
      <span>{label}</span>
    </button>
  );
}
