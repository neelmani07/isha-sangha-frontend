import { Info } from 'lucide-react';

/** Marks preview content so nobody mistakes sample entries for real community posts. */
export function SampleNotice({ children }: { children: string }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-pill border border-gold/40 bg-gold-light/60 px-3 py-1 text-xs font-semibold text-maroon">
      <Info size={14} />
      {children}
    </p>
  );
}
