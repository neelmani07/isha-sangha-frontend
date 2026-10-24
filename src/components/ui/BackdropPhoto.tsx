import type { CSSProperties } from 'react';
import type { SitePhoto } from '../../content/sitePhotos';

type Variant = 'cover' | 'fade-right' | 'fade-left' | 'horizon';

const masks: Record<Variant, string | undefined> = {
  cover: undefined,
  // Photo sits on one side and dissolves into the section background.
  'fade-right': 'linear-gradient(to left, black 25%, transparent 95%)',
  'fade-left': 'linear-gradient(to right, black 25%, transparent 95%)',
  // Only the lower part shows, like a distant horizon.
  horizon: 'linear-gradient(to top, black 10%, transparent 70%)',
};

const placement: Record<Variant, string> = {
  cover: 'inset-0 h-full w-full',
  'fade-right': 'inset-y-0 right-0 h-full w-full md:w-[60%]',
  'fade-left': 'inset-y-0 left-0 h-full w-full md:w-[60%]',
  horizon: 'inset-x-0 bottom-0 h-[55%] w-full',
};

/** Decorative photo used as a soft background or side accent; never the main content. */
export function BackdropPhoto({
  photo,
  variant = 'cover',
  className = '',
  position = 'center',
}: {
  photo: SitePhoto;
  variant?: Variant;
  className?: string;
  position?: string;
}) {
  const mask = masks[variant];
  const style: CSSProperties = {
    objectPosition: position,
    ...(mask ? { maskImage: mask, WebkitMaskImage: mask } : {}),
  };

  return (
    <img
      src={photo.src}
      alt=""
      aria-hidden
      loading="lazy"
      style={style}
      className={`pointer-events-none absolute object-cover ${placement[variant]} ${className}`}
      onError={(event) => event.currentTarget.remove()}
    />
  );
}
