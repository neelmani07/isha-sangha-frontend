import { PenLine } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../features/auth/context/AuthContext';

/**
 * "Share your story" / "List your initiative" call to action. Asks visitors to sign in first;
 * submissions themselves open with the backend for that section.
 */
export function ContributeButton({
  label,
  comingSoonText,
  tone = 'dark',
}: {
  label: string;
  comingSoonText: string;
  /** 'light' when placed on a dark background. */
  tone?: 'dark' | 'light';
}) {
  const { user, openSignIn } = useAuth();
  const [showNote, setShowNote] = useState(false);

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={() => (user ? setShowNote(true) : openSignIn())}
        className="inline-flex items-center gap-2 rounded-md bg-saffron px-5 py-3 text-sm font-semibold text-cream shadow-card transition hover:bg-saffron-dark"
      >
        <PenLine size={16} />
        {label}
      </button>
      {showNote && (
        <p role="status" className={`max-w-xs text-sm ${tone === 'light' ? 'text-cream/75' : 'text-muted'}`}>
          {comingSoonText}
        </p>
      )}
    </div>
  );
}
