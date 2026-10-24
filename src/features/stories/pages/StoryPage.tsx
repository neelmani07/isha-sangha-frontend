import { ArrowLeft, Clock, MapPin } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Ornament } from '../../../components/brand/Ornament';
import { PhotoImage } from '../../../components/ui/PhotoImage';
import { SampleNotice } from '../../../components/ui/SampleNotice';
import { NotFoundPage } from '../../../pages/NotFoundPage';
import { AuthorChip } from '../components/AuthorChip';
import { LikeButton } from '../components/LikeButton';
import { formatStoryDate, StoryCard } from '../components/StoryCard';
import { categoryLabel, findStory, placeHref, sampleStories, storyImage } from '../data/sampleStories';

export function StoryPage() {
  const { slug } = useParams();
  const story = findStory(slug);

  if (!story) {
    return <NotFoundPage />;
  }

  const more = sampleStories.filter((item) => item.slug !== story.slug && item.category === story.category).slice(0, 3);
  const others = more.length >= 3 ? more : [...more, ...sampleStories.filter((item) => item.slug !== story.slug && !more.includes(item))].slice(0, 3);

  return (
    <main className="font-body text-ink">
      <section className="relative isolate overflow-hidden pt-[var(--header-h)]">
        <PhotoImage src={storyImage(story, 1800)} alt="" className="absolute inset-0 -z-10 h-full w-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/20" />
        <div className="mx-auto max-w-3xl px-4 pb-14 pt-24 sm:px-6 sm:pt-40">
          <Link to="/stories" className="inline-flex items-center gap-1.5 text-sm font-semibold text-cream/80 hover:text-cream">
            <ArrowLeft size={16} /> All stories
          </Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-gold-light">{categoryLabel[story.category]}</p>
          <h1 className="mt-3 font-display text-4xl font-normal leading-tight text-cream sm:text-5xl">{story.title}</h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-cream/80">
            <AuthorChip name={story.author} detail={formatStoryDate(story.publishedOn)} tone="light" />
            <Link to={placeHref(story.place)} className="inline-flex items-center gap-1.5 hover:text-cream">
              <MapPin size={15} /> {story.place.name}
            </Link>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={15} /> {story.readMinutes} min read
            </span>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <SampleNotice>Sample story for preview</SampleNotice>
        <div className="mt-8 space-y-6 font-display text-xl leading-relaxed text-ink/90">
          {story.body.map((paragraph, index) => (
            <p key={index} className={index === 0 ? 'first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.9] first-letter:text-saffron' : ''}>
              {paragraph}
            </p>
          ))}
        </div>
        <Ornament className="mx-auto mt-12" />
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-white p-5 shadow-card">
          <p className="text-sm text-muted">Did this story touch you?</p>
          <LikeButton slug={story.slug} baseCount={story.likes} />
        </div>
        <Link
          to={placeHref(story.place)}
          className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-border bg-paper p-5 transition hover:border-gold/50"
        >
          <span>
            <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-gold">Where it happened</span>
            <span className="mt-1 block font-display text-xl">{story.place.name}</span>
          </span>
          <MapPin className="text-saffron" />
        </Link>
      </article>

      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl">More stories</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((item) => (
              <StoryCard key={item.slug} story={item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
