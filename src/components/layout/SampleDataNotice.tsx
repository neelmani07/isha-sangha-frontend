import { Info, X } from 'lucide-react';
import { useState } from 'react';
import { useSiteConfig } from '../../features/site/useSiteConfig';

const STORAGE_KEY = 'sample-data-notice-closed';

function wasClosed() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

/** Pinned to the bottom while the site shows preview sample data, so nobody mistakes a sample centre for a real one. */
export function SampleDataNotice() {
  const { sampleData } = useSiteConfig();
  const [closed, setClosed] = useState(wasClosed);

  if (!sampleData || closed) return null;

  return (
    <div role="status" className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 pointer-events-none">
      <div className="pointer-events-auto flex max-w-xl items-start gap-3 rounded-lg bg-ink/90 px-4 py-3 text-sm text-cream shadow-panel backdrop-blur">
        <Info size={18} className="mt-0.5 shrink-0 text-gold-light" />
        <p className="leading-snug">
          <strong className="font-semibold">Preview.</strong> The centres, teachers, members and stories shown are sample
          data, not real listings.
        </p>
        <button
          type="button"
          onClick={() => {
            setClosed(true);
            try {
              sessionStorage.setItem(STORAGE_KEY, '1');
            } catch {
              // Private mode: it simply shows again on the next visit.
            }
          }}
          className="-mr-1 shrink-0 rounded p-0.5 text-cream/70 hover:text-cream"
          aria-label="Close notice"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
