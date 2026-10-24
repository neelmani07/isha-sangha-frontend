import { Heart } from 'lucide-react';
import { useState } from 'react';

const STORAGE_KEY = 'isha-sample-story-likes';

function readLikes(): Record<string, boolean> {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

/**
 * Like toggle for sample stories. Likes are remembered in this browser only; real likes
 * (one per signed-in user) arrive with the Stories backend.
 */
export function LikeButton({ slug, baseCount, size = 'md' }: { slug: string; baseCount: number; size?: 'sm' | 'md' }) {
  const [liked, setLiked] = useState(() => Boolean(readLikes()[slug]));

  function toggle(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const next = !liked;
    setLiked(next);
    try {
      const likes = readLikes();
      likes[slug] = next;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(likes));
    } catch {
      // Storage unavailable: the like still shows for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={liked}
      aria-label={liked ? 'Unlike story' : 'Like story'}
      className={`inline-flex items-center gap-1.5 rounded-pill border font-semibold transition ${
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-4 py-2 text-sm'
      } ${liked ? 'border-saffron/30 bg-saffron-light text-saffron-dark' : 'border-border bg-white text-muted hover:border-saffron/40 hover:text-saffron-dark'}`}
    >
      <Heart size={size === 'sm' ? 14 : 16} className={liked ? 'fill-saffron text-saffron' : ''} />
      {(baseCount + (liked ? 1 : 0)).toLocaleString()}
    </button>
  );
}
