import { Link } from 'react-router-dom';
import { photoCredits } from '../../content/sitePhotos';
import { useSiteConfig } from '../../features/site/useSiteConfig';
import { IshaWorldLogo, SiteWordmark } from '../brand/IshaWorldLogo';
import { Ornament } from '../brand/Ornament';

const columns = [
  {
    title: 'Explore',
    links: [
      { to: '/', label: 'Globe' },
      { to: '/nearby', label: 'Near me' },
      { to: '/teachers', label: 'Teachers' },
      { to: '/centers', label: 'Centers' },
    ],
  },
  {
    title: 'Community',
    links: [
      { to: '/stories', label: 'Stories' },
      { to: '/initiatives', label: 'Your Initiatives' },
      { to: '/join', label: 'Join the map' },
      { to: '/donate', label: 'Donate' },
      { to: '/feedback', label: 'Feedback' },
    ],
  },
];

export function AppFooter() {
  const site = useSiteConfig();

  return (
    <footer className="bg-ink text-cream/75">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <IshaWorldLogo size="lg" />
              <SiteWordmark name={site.name} tone="light" size="lg" />
            </div>
            <p className="mt-4 font-display text-lg italic text-gold-light/80">{site.tagline}</p>
            <Ornament tone="light" className="mt-6 opacity-60" />
          </div>
          {columns.map((column) => (
            <nav key={column.title} className="grid content-start gap-2.5 text-sm" aria-label={column.title}>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">{column.title}</p>
              {column.links.map((link) => (
                <Link key={link.to} className="transition hover:text-cream" to={link.to}>
                  {link.label}
                </Link>
              ))}
              {column.title === 'Community' && site.contactEmail && (
                <a className="transition hover:text-cream" href={`mailto:${site.contactEmail}`}>
                  {site.contactEmail}
                </a>
              )}
            </nav>
          ))}
        </div>
        <p className="mt-12 border-t border-cream/10 pt-6 text-xs leading-5 text-cream/50">{site.disclaimer}</p>
        {photoCredits.length > 0 && (
          <p className="mt-3 text-[11px] leading-5 text-cream/40">
            Photos via Wikimedia Commons:{' '}
            {photoCredits.map((credit, index) => (
              <span key={credit.source}>
                {index > 0 && ' · '}
                <a href={credit.source} target="_blank" rel="noreferrer" className="hover:text-cream/70">
                  {credit.alt}
                </a>{' '}
                by {credit.author} ({credit.license})
              </span>
            ))}
          </p>
        )}
      </div>
    </footer>
  );
}
