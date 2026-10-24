import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Clock, MapPin } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { mediaUrl } from '../../../api/apiClient';
import { Ornament } from '../../../components/brand/Ornament';
import { PhotoImage } from '../../../components/ui/PhotoImage';
import { NotFoundPage } from '../../../pages/NotFoundPage';
import { categoryLabel, placeHref, storiesApi } from '../api/storiesApi';
import { AuthorChip } from '../components/AuthorChip';
import { LikeButton } from '../components/LikeButton';
import { formatStoryDate, StoryCard } from '../components/StoryCard';

export function StoryPage() {
  const { slug = '' } = useParams();
  const { data: story, isLoading, isError } = useQuery({ queryKey: ['story', slug], queryFn: () => storiesApi.bySlug(slug) });
  const all = useQuery({ queryKey: ['stories'], queryFn: storiesApi.list });

  if (isError) return <NotFoundPage />;
  if (isLoading || !story) return <div className="min-h-[60vh] bg-maroon-dark" aria-busy="true" />;

  const others = (all.data ?? []).filter((item) => item.slug !== story.slug);
  const more = [...others.filter((item) => item.category === story.category), ...others.filter((item) => item.category !== story.category)].slice(0, 3);
  const place = placeHref(story);
  const paragraphs = story.body.split(/\n{2,}/).filter((p) => p.trim());

  return (
    <main className="font-body text-ink">
      <section className="relative isolate overflow-hidden pt-[var(--header-h)]">
        <PhotoImage src={mediaUrl(story.photoUrl) ?? undefined} alt="" className="absolute inset-0 -z-10 h-full w-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/20" />
        <div className="mx-auto max-w-3xl px-4 pb-14 pt-24 sm:px-6 sm:pt-40">
          <Link to="/stories" className="inline-flex items-center gap-1.5 text-sm font-semibold text-cream/80 hover:text-cream">
            <ArrowLeft size={16} /> All stories
          </Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-gold-light">{categoryLabel[story.category]}</p>
          <h1 className="mt-3 font-display text-4xl font-normal leading-tight text-cream sm:text-5xl">{story.title}</h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-cream/80">
            <AuthorChip name={story.authorName} detail={formatStoryDate(story.publishedAt)} tone="light" />
            {place && (
              <Link to={place} className="inline-flex items-center gap-1.5 hover:text-cream">
                <MapPin size={15} /> {story.placeName}
              </Link>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock size={15} /> {story.readMinutes} min read
            </span>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <div className="space-y-6 font-display text-xl leading-relaxed text-ink/90">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={index === 0 ? 'first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.9] first-letter:text-saffron' : ''}
            >
              {paragraph}
            </p>
          ))}
        </div>
        <Ornament className="mx-auto mt-12" />
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-white p-5 shadow-card">
          <p className="text-sm text-muted">Did this story touch you?</p>
          <LikeButton story={story} />
        </div>
        {place && (
          <Link to={place} className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-border bg-paper p-5 transition hover:border-gold/50">
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-gold">Where it happened</span>
              <span className="mt-1 block font-display text-xl">{story.placeName}</span>
            </span>
            <MapPin className="text-saffron" />
          </Link>
        )}
      </article>

      {more.length > 0 && (
        <section className="bg-paper">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl">More stories</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((item) => (
                <StoryCard key={item.slug} story={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
