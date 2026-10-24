import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PhotoImage } from '../../../components/ui/PhotoImage';
import { categoryLabel, storyImage, type Story } from '../data/sampleStories';
import { AuthorChip } from './AuthorChip';
import { LikeButton } from './LikeButton';

export function formatStoryDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function StoryCard({ story }: { story: Story }) {
  return (
    <Link
      to={`/stories/${story.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <PhotoImage src={storyImage(story, 700)} alt="" className="h-full w-full transition duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-pill bg-cream/95 px-3 py-1 text-xs font-semibold text-maroon shadow-card">
          {categoryLabel[story.category]}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-medium leading-snug text-ink group-hover:text-saffron-dark">{story.title}</h3>
        <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-muted">{story.excerpt}</p>
        <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gold">
          <MapPin size={13} /> {story.place.name}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <AuthorChip name={story.author} detail={formatStoryDate(story.publishedOn)} />
          <LikeButton slug={story.slug} baseCount={story.likes} size="sm" />
        </div>
      </div>
    </Link>
  );
}

/** Wide, photo-led card used for the featured story. */
export function FeaturedStoryCard({ story }: { story: Story }) {
  return (
    <Link
      to={`/stories/${story.slug}`}
      className="group relative grid min-h-[420px] overflow-hidden rounded-xl shadow-panel md:min-h-[460px]"
    >
      <PhotoImage src={storyImage(story, 1600)} alt="" className="absolute inset-0 h-full w-full transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
      <div className="relative mt-auto max-w-2xl p-6 sm:p-10">
        <span className="rounded-pill bg-saffron px-3 py-1 text-xs font-semibold text-cream">Featured · {categoryLabel[story.category]}</span>
        <h2 className="mt-4 font-display text-3xl font-normal leading-tight text-cream sm:text-4xl">{story.title}</h2>
        <p className="mt-3 text-base leading-relaxed text-cream/85 sm:text-lg">{story.excerpt}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <AuthorChip name={story.author} detail={story.place.name} tone="light" />
          <LikeButton slug={story.slug} baseCount={story.likes} />
        </div>
      </div>
    </Link>
  );
}
