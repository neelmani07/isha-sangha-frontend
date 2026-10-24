import { useMemo, useState } from 'react';
import { Ornament } from '../../../components/brand/Ornament';
import { ClosingBand } from '../../../components/layout/ClosingBand';
import { BackdropPhoto } from '../../../components/ui/BackdropPhoto';
import { ContributeButton } from '../../../components/ui/ContributeButton';
import { sitePhotos } from '../../../content/sitePhotos';
import { SampleNotice } from '../../../components/ui/SampleNotice';
import { TwoToneHeading } from '../../../components/ui/TwoToneHeading';
import { FeaturedStoryCard, StoryCard } from '../components/StoryCard';
import { sampleStories, storyCategories, type StoryCategory } from '../data/sampleStories';

export function StoriesPage() {
  const [category, setCategory] = useState<StoryCategory | 'ALL'>('ALL');
  const featured = sampleStories.find((story) => story.featured) ?? sampleStories[0];

  const stories = useMemo(
    () =>
      sampleStories.filter(
        (story) => (category === 'ALL' ? story.slug !== featured.slug : story.category === category),
      ),
    [category, featured.slug],
  );

  return (
    <main className="font-body text-ink">
      <section className="relative isolate overflow-hidden bg-maroon-dark pt-[var(--header-h)] text-cream">
        <BackdropPhoto photo={sitePhotos.devi} variant="fade-right" position="70% 40%" className="-z-10 opacity-80" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-maroon-dark via-maroon-dark/70 to-transparent md:via-maroon-dark/40" />
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 sm:pt-24 lg:px-8">
          <div className="max-w-xl">
            <div className="[&>p]:border-cream/20 [&>p]:bg-cream/10 [&>p]:text-cream/80">
              <SampleNotice>Preview with sample stories</SampleNotice>
            </div>
            <TwoToneHeading
              as="h1"
              size="lg"
              tone="light"
              className="mt-6"
              title="Your Stories"
              subtitle="moments of grace, change and the magic of Devi"
            />
            <Ornament tone="light" className="mt-6 opacity-80" />
            <p className="mt-6 text-lg leading-relaxed text-cream/80">
              Meditators, volunteers and seekers share what the practices, the programs and Devi's grace have brought
              into their lives. Each story is linked to the place where it happened.
            </p>
            <div className="mt-8">
              <ContributeButton
                tone="light"
                label="Share your story"
                comingSoonText="Story submissions open soon. We'll let you know as soon as you can post yours."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        {category === 'ALL' && <FeaturedStoryCard story={featured} />}

        <div className={`flex gap-2 overflow-x-auto pb-2 ${category === 'ALL' ? 'mt-12' : ''}`} role="tablist" aria-label="Story categories">
          {storyCategories.map((item) => (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={category === item.value}
              onClick={() => setCategory(item.value)}
              className={`shrink-0 rounded-pill border px-4 py-2 text-sm font-semibold transition ${
                category === item.value
                  ? 'border-ink bg-ink text-cream'
                  : 'border-border bg-white text-muted hover:border-ink/30 hover:text-ink'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {category === 'DEVI' && <DeviBanner />}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <StoryCard key={story.slug} story={story} />
          ))}
        </div>
      </section>

      <ClosingBand
        photo={sitePhotos.dhyanalinga}
        photoPosition="center 45%"
        title="Every story"
        subtitle="begins in stillness"
        text="Something shifted for you: on a mat, in a temple, while serving a meal. Telling it might be exactly what someone else needs to hear today."
        action={
          <ContributeButton
            tone="light"
            label="Share your story"
            comingSoonText="Story submissions open soon. We'll let you know as soon as you can post yours."
          />
        }
      />
    </main>
  );
}

function DeviBanner() {
  return (
    <div className="relative mt-8 grid overflow-hidden rounded-xl bg-maroon-dark text-cream shadow-panel md:grid-cols-[1.1fr_1fr]">
      <div className="relative aspect-[3/2] md:aspect-auto md:min-h-[300px]">
        <img src={sitePhotos.devi.src} alt={sitePhotos.devi.alt} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark/70 to-transparent md:bg-gradient-to-l md:from-maroon-dark md:via-maroon-dark/30 md:to-transparent" />
      </div>
      <div className="relative flex flex-col justify-center p-6 sm:p-10">
        <TwoToneHeading tone="light" title="Magic of Devi" subtitle="her grace, in your words" />
        <Ornament tone="light" className="mt-5 opacity-70" />
        <p className="mt-5 text-[17px] leading-relaxed text-cream/80">
          Moments when Devi's presence was felt: in a temple full of lamps, in a hospital corridor, at a family altar.
          Share yours, however small it seems.
        </p>
      </div>
    </div>
  );
}
