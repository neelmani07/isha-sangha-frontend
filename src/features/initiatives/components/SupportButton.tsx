import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HandHeart } from 'lucide-react';
import type { Initiative } from '../../../types/api';
import { useAuth } from '../../auth/context/AuthContext';
import { initiativesApi } from '../api/initiativesApi';

/** "I support this": one per member; asks visitors to sign in first. */
export function SupportButton({ initiative, size = 'md' }: { initiative: Initiative; size?: 'sm' | 'md' }) {
  const { user, openSignIn } = useAuth();
  const queryClient = useQueryClient();
  const toggle = useMutation({
    mutationFn: () => (initiative.supportedByMe ? initiativesApi.unsupport(initiative.id) : initiativesApi.support(initiative.id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['initiatives'] });
      queryClient.invalidateQueries({ queryKey: ['initiative', initiative.slug] });
      queryClient.invalidateQueries({ queryKey: ['initiative-stats'] });
    },
  });
  const on = initiative.supportedByMe;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!user) openSignIn();
        else toggle.mutate();
      }}
      disabled={toggle.isPending}
      aria-pressed={on}
      className={`inline-flex items-center gap-1.5 rounded-pill border font-semibold transition ${
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-4 py-2 text-sm'
      } ${on ? 'border-teal bg-teal text-cream' : 'border-teal/25 bg-white text-teal hover:border-teal/60 hover:bg-teal-light/50'}`}
    >
      <HandHeart size={size === 'sm' ? 14 : 16} />
      {on ? 'Supporting' : 'I support this'} · {initiative.supporters.toLocaleString()}
    </button>
  );
}
