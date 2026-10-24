import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import type { Story } from '../../../types/api';
import { useAuth } from '../../auth/context/AuthContext';
import { storiesApi } from '../api/storiesApi';

/** One like per member; asks visitors to sign in first. */
export function LikeButton({ story, size = 'md' }: { story: Story; size?: 'sm' | 'md' }) {
  const { user, openSignIn } = useAuth();
  const queryClient = useQueryClient();
  const toggle = useMutation({
    mutationFn: () => (story.likedByMe ? storiesApi.unlike(story.id) : storiesApi.like(story.id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      queryClient.invalidateQueries({ queryKey: ['story', story.slug] });
    },
  });
  const liked = story.likedByMe;

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
      aria-pressed={liked}
      aria-label={liked ? 'Unlike story' : 'Like story'}
      className={`inline-flex items-center gap-1.5 rounded-pill border font-semibold transition ${
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-4 py-2 text-sm'
      } ${liked ? 'border-saffron/30 bg-saffron-light text-saffron-dark' : 'border-border bg-white text-muted hover:border-saffron/40 hover:text-saffron-dark'}`}
    >
      <Heart size={size === 'sm' ? 14 : 16} className={liked ? 'fill-saffron text-saffron' : ''} />
      {story.likes.toLocaleString()}
    </button>
  );
}
