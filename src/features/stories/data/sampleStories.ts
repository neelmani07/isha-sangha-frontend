// Sample stories used to preview the Stories section until real submissions are stored in the backend.
// Authors and events are invented; place links point at cities and centers that exist in the seed data.

export type StoryCategory = 'DEVI' | 'TRANSFORMATION' | 'SADHANA' | 'SEVA';

export type StoryPlace = { kind: 'city' | 'center'; slug: string; name: string };

export type Story = {
  slug: string;
  title: string;
  category: StoryCategory;
  excerpt: string;
  body: string[];
  imageId: string;
  /** Overrides imageId with a photo from our own collection (e.g. /images/ashram/...). */
  photo?: string;
  author: string;
  place: StoryPlace;
  publishedOn: string;
  likes: number;
  readMinutes: number;
  featured?: boolean;
};

export const storyCategories: { value: StoryCategory | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All stories' },
  { value: 'DEVI', label: 'Magic of Devi' },
  { value: 'TRANSFORMATION', label: 'Transformation' },
  { value: 'SADHANA', label: 'Sadhana' },
  { value: 'SEVA', label: 'Seva' },
];

export const categoryLabel: Record<StoryCategory, string> = {
  DEVI: 'Magic of Devi',
  TRANSFORMATION: 'Transformation',
  SADHANA: 'Sadhana',
  SEVA: 'Seva',
};

const DEVI_PHOTO = '/images/ashram/devi-linga-bhairavi.webp';

export const sampleStories: Story[] = [
  {
    slug: 'the-lamp-that-stayed-lit',
    title: 'The evening the lamp stayed lit',
    category: 'DEVI',
    excerpt:
      'My mother was in hospital and I had run out of ways to be strong. I went to Devi with nothing to offer except how tired I was.',
    body: [
      'My mother was in hospital for most of that monsoon, and by the third week I had run out of ways to be strong. A friend suggested I go to the evening arati. I went because I did not know where else to go.',
      'I remember the wind that evening. It kept coming through the open sides and every lamp around me flickered. I held mine with both hands and told Devi the truth: I had nothing to offer except how tired I was.',
      'The lamp did not go out. I know it is a small thing. But I sat there long after the arati ended, and for the first time in weeks my breath went all the way down. Nothing outside had changed. Something inside had stopped fighting.',
      'My mother came home ten days later. I still go on Tuesdays. I no longer go to ask for anything. I go to say thank you.',
    ],
    imageId: '1506126613408-eca07ce68773',
    photo: DEVI_PHOTO,
    author: 'Meera R.',
    place: { kind: 'center', slug: 'isha-yoga-center-coimbatore', name: 'Isha Yoga Centre Coimbatore' },
    publishedOn: '2026-09-28',
    likes: 214,
    readMinutes: 3,
    featured: true,
  },
  {
    slug: 'twenty-one-minutes',
    title: 'Twenty-one minutes that changed my mornings',
    category: 'TRANSFORMATION',
    excerpt:
      'I was the person who hit snooze five times. Two years of daily practice later, I wake before my alarm and actually look forward to the day.',
    body: [
      'I worked night shifts in a Bengaluru tech park for six years. My mornings were coffee, snooze buttons and a low hum of irritation that I thought was just my personality.',
      'I learned the practice almost by accident, because a colleague had an extra seat. For the first forty days I did it mostly out of stubbornness.',
      'Somewhere around the third month I noticed I was waking up before the alarm. Then I noticed I had not shouted at anyone in traffic for a while. My wife noticed before I did.',
      'It is twenty-one minutes. I used to spend longer than that scrolling in bed. Now it is the part of the day I protect the most.',
    ],
    imageId: '1508672019048-805c876b67e2',
    author: 'Arjun K.',
    place: { kind: 'city', slug: 'bengaluru', name: 'Bengaluru' },
    publishedOn: '2026-09-21',
    likes: 187,
    readMinutes: 2,
  },
  {
    slug: 'washing-vessels-for-three-thousand',
    title: 'What I learned washing vessels for three thousand people',
    category: 'SEVA',
    excerpt:
      'I signed up hoping for a role near the stage. I was sent to the kitchen. It turned out to be the most joyful week of my year.',
    body: [
      'I signed up as a volunteer hoping for something near the stage. I was sent to the kitchen, to the vessel-washing line, and I was quietly disappointed.',
      'By the second day something shifted. There was a rhythm to it: scrub, rinse, pass, and a stranger next to me humming the same chant. Nobody was trying to be seen.',
      'By the end of the week I knew everyone on the line by name. We had fed thousands of people and none of them knew who we were. I have never felt so useful or so light.',
    ],
    imageId: '1593113598332-cd288d649433',
    author: 'Lakshmi S.',
    place: { kind: 'center', slug: 'isha-yoga-center-coimbatore', name: 'Isha Yoga Centre Coimbatore' },
    publishedOn: '2026-09-14',
    likes: 342,
    readMinutes: 2,
  },
  {
    slug: 'a-winter-of-hatha-yoga-in-berlin',
    title: 'A winter of Hatha Yoga in Berlin',
    category: 'SADHANA',
    excerpt:
      'Berlin winters are long and grey. This year, a small group of us met at six every morning in a borrowed studio, and the cold stopped mattering.',
    body: [
      'Berlin winters are long and grey, and I usually spend them waiting for April. This year a few of us who had learned Hatha Yoga together decided to practise as a group.',
      'We met at six every morning in a borrowed studio above a bakery. Some days there were two of us, some days eleven. The smell of bread came up through the floor.',
      'I cannot say exactly what changed. I slept better. I was less heavy. But mostly I remember the feeling of walking out into the dark street afterwards, completely awake, while the city was still asleep.',
    ],
    imageId: '1544367567-0f2fcb009e0b',
    author: 'Daniel W.',
    place: { kind: 'city', slug: 'berlin', name: 'Berlin' },
    publishedOn: '2026-09-07',
    likes: 96,
    readMinutes: 2,
  },
  {
    slug: 'from-anger-to-quiet',
    title: 'From anger to a quiet I did not know I had',
    category: 'TRANSFORMATION',
    excerpt:
      'I used to think my temper kept me sharp. A weekend programme in Melbourne showed me how much of my life it was quietly eating.',
    body: [
      'I was proud of my temper. I thought it made me effective at work and honest at home. My teenage son had a different word for it.',
      'I went to a weekend programme in Melbourne mostly so he would stop bringing it up. On the second day, in a very simple process, I watched an old anger rise and pass without me doing anything with it.',
      'It still rises. The difference is that there is now a little space between it and me. My son says I have become boring. I take it as the highest compliment.',
    ],
    imageId: '1490730141103-6cac27aaab94',
    author: 'Emma L.',
    place: { kind: 'city', slug: 'melbourne', name: 'Melbourne' },
    publishedOn: '2026-08-30',
    likes: 158,
    readMinutes: 2,
  },
  {
    slug: 'navratri-with-my-grandmother',
    title: 'Navratri with my grandmother, and again with Devi',
    category: 'DEVI',
    excerpt:
      'Every Navratri my grandmother lit nine lamps. After she passed, I did not light any for three years, until a friend took me to a Devi temple.',
    body: [
      'Every Navratri my grandmother lit nine lamps, one each night, and told me a story for each. After she passed I did not light any for three years. It hurt too much.',
      'Last year a friend took me to a Devi temple on the first night. The fragrance of the flowers, the sound of the bells: it was exactly her. I cried through the whole arati.',
      'This year I lit the nine lamps again in my own home, and told my daughter the stories. I could feel both of them there: my grandmother, and the Devi she loved.',
    ],
    imageId: '1518241353330-0f7941c2d9b5',
    photo: DEVI_PHOTO,
    author: 'Priya N.',
    place: { kind: 'city', slug: 'bengaluru', name: 'Bengaluru' },
    publishedOn: '2026-08-22',
    likes: 263,
    readMinutes: 2,
  },
  {
    slug: 'learning-to-sit-still-in-tennessee',
    title: 'Learning to sit still in Tennessee',
    category: 'SADHANA',
    excerpt:
      'I flew in for a residential programme expecting to be bored. I left with a stillness I keep coming back to every evening.',
    body: [
      'I had never sat still for more than ten minutes in my adult life. I flew to Tennessee for a residential programme mostly because my sister had already paid for it.',
      'The hills there are soft and green, and the silence is a different kind of silence. By the third day I stopped checking my phone. By the fifth I stopped wanting to.',
      'Back home the noise came back, of course. But I found I could return to that stillness for a few minutes each evening. That is enough. That is more than I had.',
    ],
    imageId: '1552196563-55cd4e45efb3',
    author: 'Sarah T.',
    place: { kind: 'center', slug: 'isha-institute-of-inner-sciences', name: 'Isha Institute of Inner-sciences' },
    publishedOn: '2026-08-15',
    likes: 121,
    readMinutes: 2,
  },
  {
    slug: 'planting-saplings-with-strangers',
    title: 'Planting saplings with strangers who became family',
    category: 'SEVA',
    excerpt:
      'Two hundred saplings, forty volunteers, one very muddy Sunday. A year later the trees are taller than my son and we still meet every month.',
    body: [
      'A notice on a WhatsApp group said: two hundred saplings, one Sunday, bring a hat. I went alone and knew nobody.',
      'It rained the whole morning. We dug, planted and laughed at how muddy we were. An older farmer showed us how to press the soil so the roots could breathe.',
      'A year later most of the trees are taller than my son. The forty of us still meet once a month, sometimes to plant, sometimes just to eat together.',
    ],
    imageId: '1542601906990-b4d3fb778b09',
    author: 'Karthik V.',
    place: { kind: 'city', slug: 'coimbatore', name: 'Coimbatore' },
    publishedOn: '2026-08-02',
    likes: 205,
    readMinutes: 2,
  },
];

export function storyImage(story: Story, width: number) {
  return story.photo ?? `https://images.unsplash.com/photo-${story.imageId}?w=${width}&q=70&auto=format&fit=crop`;
}

export function findStory(slug: string | undefined) {
  return sampleStories.find((story) => story.slug === slug);
}

export function placeHref(place: StoryPlace) {
  return place.kind === 'city' ? `/city/${place.slug}` : `/center/${place.slug}`;
}
