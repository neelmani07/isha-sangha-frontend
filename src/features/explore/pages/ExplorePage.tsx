import { ArrowRight, Building2, HandCoins, Search, Users } from 'lucide-react';
import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ClosingBand } from '../../../components/layout/ClosingBand';
import { LinkCard } from '../../../components/ui/Card';
import { SearchField } from '../../../components/ui/Form';
import { BackdropPhoto } from '../../../components/ui/BackdropPhoto';
import { sitePhotos, type SitePhoto } from '../../../content/sitePhotos';
import { TwoToneHeading } from '../../../components/ui/TwoToneHeading';
import { GlobeExplorer } from '../../globe/components/GlobeExplorer';
import { InitiativeCard } from '../../initiatives/components/InitiativeCard';
import { sampleInitiatives } from '../../initiatives/data/sampleInitiatives';
import { NearbyPanel } from '../../nearby/components/NearbyPanel';
import { StoryCard } from '../../stories/components/StoryCard';
import { sampleStories } from '../../stories/data/sampleStories';

/** Explore is one long page: globe hero, then Near me, Search & browse, and community stories. */
export function ExplorePage() {
  const location = useLocation();

  const jumpTo = useCallback((sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Deep links such as /#nearby (and the old /nearby route, which redirects here) land on their section.
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const timer = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 0);
      return () => window.clearTimeout(timer);
    }
  }, [location.hash]);

  return (
    <main className="bg-cream font-body text-ink">
      <GlobeExplorer onJumpToSection={jumpTo} />

      <ExploreSection
        id="nearby"
        eyebrow="Near me"
        title="Find Isha near you"
        subtitle="teachers, centers and temples close by"
      >
        <NearbyPanel />
      </ExploreSection>

      <ExploreSection
        id="search"
        eyebrow="Search & browse"
        title="Look up a place or a person"
        subtitle="across every country, city and center"
        paper
        backdrop={sitePhotos.velliangiriTridents}
      >
        <SearchAndBrowse />
      </ExploreSection>

      <ExploreSection
        id="stories"
        eyebrow="From the community"
        title="Stories from these places"
        subtitle="grace, change and the magic of Devi"
        action={<SeeAll to="/stories" label="All stories" />}
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sampleStories.slice(0, 3).map((story) => (
            <StoryCard key={story.slug} story={story} />
          ))}
        </div>
      </ExploreSection>

      <ExploreSection
        id="initiatives"
        eyebrow="Your initiatives"
        title="Seva that started with one person"
        subtitle="and grew with the community"
        action={<SeeAll to="/initiatives" label="All initiatives" />}
        paper
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sampleInitiatives.slice(0, 3).map((initiative) => (
            <InitiativeCard key={initiative.slug} initiative={initiative} />
          ))}
        </div>
      </ExploreSection>

      <DonateBand />
    </main>
  );
}

function ExploreSection({
  id,
  eyebrow,
  title,
  subtitle,
  action,
  paper = false,
  backdrop,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  action?: ReactNode;
  paper?: boolean;
  /** Optional photo that dissolves in from the right edge. */
  backdrop?: SitePhoto;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`relative isolate scroll-mt-20 overflow-hidden py-16 sm:py-20 ${paper ? 'bg-paper' : ''}`}>
      {backdrop && <BackdropPhoto photo={backdrop} variant="fade-right" className="-z-10 opacity-45 mix-blend-multiply" />}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <TwoToneHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
          {action}
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function SeeAll({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 text-sm font-semibold text-saffron-dark hover:text-saffron">
      {label} <ArrowRight size={16} />
    </Link>
  );
}

function DonateBand() {
  return (
    <ClosingBand
      photo={sitePhotos.adiyogi}
      photoPosition="center 30%"
      title="Your contribution"
      subtitle="can change someone's life"
      text="This community runs on volunteers. A small gift helps a tuition class buy books, a planting drive buy saplings, and keeps this map free for everyone."
      action={
        <Link
          to="/donate"
          className="inline-flex items-center gap-2 rounded-md bg-saffron px-6 py-3 text-sm font-semibold text-cream shadow-card transition hover:bg-saffron-dark"
        >
          <HandCoins size={16} /> Donate now
        </Link>
      }
    />
  );
}

function SearchAndBrowse() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  function submit(event: FormEvent) {
    event.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  const browse = [
    { to: '/teachers', title: 'All teachers', text: 'Hatha Yoga teachers and the programs they offer.', icon: Users },
    { to: '/centers', title: 'All centers', text: 'Centers, Devi temples and Isha shops.', icon: Building2 },
    { to: '/search', title: 'Advanced search', text: 'Search every country, state, city and person.', icon: Search },
  ];

  return (
    <div className="space-y-6">
      <form onSubmit={submit}>
        <SearchField value={query} onChange={setQuery} placeholder="Try “Coimbatore”, “Mumbai” or a teacher’s name" />
      </form>
      <div className="grid gap-4 md:grid-cols-3">
        {browse.map((item) => (
          <LinkCard key={item.to} to={item.to}>
            <item.icon className="text-saffron" size={22} />
            <p className="mt-3 font-display text-lg font-semibold">{item.title}</p>
            <p className="mt-1 text-sm text-muted">{item.text}</p>
          </LinkCard>
        ))}
      </div>
    </div>
  );
}
