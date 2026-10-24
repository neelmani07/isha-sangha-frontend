import { useState, type ImgHTMLAttributes } from 'react';

/** Photo with a warm gradient fallback, so a missing remote image never leaves a broken box. */
export function PhotoImage({ className = '', alt = '', ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);

  if (failed || !props.src) {
    return <div className={`bg-gradient-to-br from-gold/40 via-saffron/30 to-maroon/50 ${className}`} role="img" aria-label={alt} />;
  }

  return <img loading="lazy" alt={alt} onError={() => setFailed(true)} className={`object-cover ${className}`} {...props} />;
}

/** Unsplash image URL at a given width (images are used under the Unsplash licence). */
export function unsplash(id: string, width = 900) {
  return `https://images.unsplash.com/photo-${id}?w=${width}&q=70&auto=format&fit=crop`;
}
