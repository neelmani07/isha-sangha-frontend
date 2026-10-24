// Every ashram / place photo used as a background or accent across the site, in one place.
//
// To use your own photos: put the files in public/images/ashram/ and change `src` to
// '/images/ashram/<file name>'. Set `credit` to null for photos you own, or fill it in for
// photos you have permission to use. Credits are listed automatically in the footer.

export type SitePhoto = {
  src: string;
  alt: string;
  credit: { author: string; license: string; source: string } | null;
};

const commons = (path: string, file: string, width = 1280) =>
  `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}/${file}/${width}px-${file}`;

export const sitePhotos = {
  velliangiriMist: {
    src: commons('8/83', 'Velliangiri_Mountains.jpg'),
    alt: 'Mist over the Velliangiri mountains',
    credit: { author: 'Silvershocky', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Velliangiri_Mountains.jpg' },
  },
  velliangiriTridents: {
    src: commons('5/56', 'Velliangiri_Mountains_2.jpg'),
    alt: 'Tridents on the Velliangiri hills',
    credit: { author: 'Silvershocky', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Velliangiri_Mountains_2.jpg' },
  },
  adiyogi: {
    src: commons('1/1e', 'Adiyogi_Shiva_steel_burst_2018.jpg'),
    alt: 'Adiyogi at the foot of the Velliangiri mountains',
    credit: { author: 'Prabhuthiru57', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Adiyogi_Shiva_steel_burst_2018.jpg' },
  },
  adiyogiWide: {
    src: commons('4/40', 'Isha_temple_view.jpg', 960),
    alt: 'Adiyogi and the Velliangiri range',
    credit: { author: 'Manju Thilagavathi', license: 'CC0', source: 'https://commons.wikimedia.org/wiki/File:Isha_temple_view.jpg' },
  },
  dhyanalinga: {
    src: commons('a/a5', 'Dhyanalinga_Ellipsoidal_dome.JPG'),
    alt: 'The Dhyanalinga dome',
    credit: { author: 'Balajijagadesh', license: 'CC BY-SA 3.0', source: 'https://commons.wikimedia.org/wiki/File:Dhyanalinga_Ellipsoidal_dome.JPG' },
  },
  devi: {
    src: '/images/ashram/devi-linga-bhairavi.webp',
    alt: 'Devi, lit by rows of oil lamps',
    // Provided by the site team for Devi stories.
    credit: null,
  },
  sadhguru: {
    src: '/images/ashram/sadhguru.jpg',
    alt: 'Sadhguru',
    // Provided by the site team (photo area of a quote card, text cropped off).
    credit: null,
  },
  nandi: {
    src: commons('2/2c', 'Isha_Yoga_Center_-_Bull.jpg'),
    alt: 'Nandi at the Isha Yoga Centre',
    credit: { author: 'Natesh Ramasamy', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Isha_Yoga_Center_-_Bull.jpg' },
  },
} satisfies Record<string, SitePhoto>;

export const photoCredits = Object.values(sitePhotos).flatMap((photo) => (photo.credit ? [{ ...photo.credit, alt: photo.alt }] : []));
