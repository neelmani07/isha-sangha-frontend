import type { ReactNode } from 'react';
import type { SitePhoto } from '../../content/sitePhotos';
import { Ornament } from '../brand/Ornament';
import { BackdropPhoto } from '../ui/BackdropPhoto';
import { TwoToneHeading } from '../ui/TwoToneHeading';

/**
 * Deep-maroon band that closes a page: a slanted top edge, a photo dissolving in from one side,
 * and a heading + call to action on the other.
 */
export function ClosingBand({
  photo,
  photoSide = 'left',
  photoPosition = 'center',
  photoOpacity = 'opacity-35',
  palette = 'maroon',
  title,
  subtitle,
  text,
  action,
}: {
  photo: SitePhoto;
  photoSide?: 'left' | 'right';
  photoPosition?: string;
  /** Tailwind opacity class; darker photos need more. */
  photoOpacity?: string;
  palette?: 'maroon' | 'teal';
  title: string;
  subtitle: string;
  text: string;
  action: ReactNode;
}) {
  const textOnRight = photoSide === 'left';

  return (
    <section className={`relative isolate overflow-hidden text-cream clip-slant-top ${palette === 'teal' ? 'bg-teal-texture' : 'bg-maroon-texture'}`}>
      <BackdropPhoto
        photo={photo}
        variant={photoSide === 'left' ? 'fade-left' : 'fade-right'}
        position={photoPosition}
        className={`-z-10 mix-blend-luminosity ${photoOpacity}`}
      />
      <div
        className={`mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 pb-20 pt-28 sm:px-6 lg:px-8 ${
          textOnRight ? 'lg:items-end lg:text-right' : ''
        }`}
      >
        <TwoToneHeading tone="light" title={title} subtitle={subtitle} className={textOnRight ? 'lg:text-right' : ''} />
        <Ornament tone="light" className="opacity-80" />
        <p className="max-w-xl text-lg leading-relaxed text-cream/80">{text}</p>
        {action}
      </div>
    </section>
  );
}
