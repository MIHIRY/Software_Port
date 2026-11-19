import { siteConfig } from '../config';

/** Copy for the About v2 page. Facts come from siteConfig wherever they exist. */

const firstName = siteConfig.name.split(' ')[0];

export const intro = {
  /** Rendered as "Hi, I'm {name}." with "Hi" and the name in the accent colour. */
  name: firstName,
  heading: `Hi, I'm ${firstName}.`,
  line: 'I live in the USA. I like training models and building software.',
  aside: "By day I'm an engineer; by night I read books.",
};

const bookTitles = siteConfig.reading.map((book) => book.title);
export const books = {
  /** The second part is kept on one line; the line underlines it. */
  heading: ['I read a lot of books and', 'keep the best ones close'],
  body: `Three I keep coming back to: ${bookTitles.slice(0, -1).join(', ')}, and ${bookTitles[bookTitles.length - 1]}.`,
  links: [
    { label: 'What I read', to: '/work#reading' },
    { label: 'Kaggle', href: siteConfig.social.kaggle },
  ],
};

/** Short, one-line descriptions for the rows, in config order. */
const rowDescriptions = [
  'Taxi demand forecasting over 85.6M trips, with XGBoost.',
  'A transformer that predicts which SQL plan runs faster.',
  'Ask questions of research papers, answered with RAG.',
  'AI-first analytics over SEC filings for 24 SaaS companies.',
  'A keyboard that suggests the next word for the context.',
];

export const rows = siteConfig.projects.slice(0, rowDescriptions.length).map((project, i) => ({
  name: project.name.split(':')[0],
  description: rowDescriptions[i],
  link: project.link,
}));

/**
 * "Plus N more": Mihir's own count of projects beyond the rows (more than the
 * site lists). The line draws one tally mark for each.
 */
export const moreCount = 20;

/**
 * The camera roll, newest first. Files sit in public/ under their phone names.
 * `place` is the caption under the open photo; `alt` describes it for screen
 * readers. Photos are 3:4 (portrait) or 4:3 (landscape); an empty `src` renders
 * a blank frame.
 */
export type Photo = { src: string; place: string; alt: string; orientation: 'landscape' | 'portrait' };
export const photos: Photo[] = [
  { src: '/20260613_150453.jpeg', place: 'Mountain lake, Jun 2026', alt: 'A turquoise lake ringed by forest, seen from a rocky ledge high above, with mountains behind.', orientation: 'landscape' },
  { src: '/20260613_150041.jpeg', place: 'Valley view, Jun 2026', alt: 'A wide green valley under a blue sky, with a rocky mountain face on the right.', orientation: 'landscape' },
  { src: '/20260608_203953.jpeg', place: 'Couch cat, Jun 2026', alt: 'A calico cat curled up on a grey couch, looking at the camera.', orientation: 'landscape' },
  { src: '/20260503_153433.jpeg', place: 'Central Park, May 2026', alt: 'People on the grass in Central Park, with the twin towers of the San Remo above the trees.', orientation: 'portrait' },
  { src: '/20260404_192925.jpeg', place: 'Sunset, Apr 2026', alt: 'An orange sun setting under dark clouds.', orientation: 'portrait' },
  { src: '/20260331_162846.jpeg', place: 'Library of Congress, Mar 2026', alt: 'The domed main reading room of the Library of Congress, seen from the gallery above.', orientation: 'landscape' },
  { src: '/20260331_155510.jpeg', place: 'Supreme Court, Mar 2026', alt: 'The marble front of the U.S. Supreme Court under a blue sky, with the flag flying.', orientation: 'portrait' },
  { src: '/20260329_141838.jpeg', place: 'Jefferson Memorial, Mar 2026', alt: 'Cherry blossoms framing the Jefferson Memorial across the Tidal Basin.', orientation: 'portrait' },
  { src: '/20260130_204747.jpeg', place: 'New Orleans, Jan 2026', alt: 'St. Louis Cathedral lit up at night behind the statue in Jackson Square.', orientation: 'portrait' },
  { src: '/20260118_162200.jpeg', place: 'Macaw, Jan 2026', alt: 'A red-and-green macaw perched on a branch.', orientation: 'portrait' },
  { src: '/20240521_170128.jpeg', place: 'Storm clouds, May 2024', alt: 'Storm clouds gathering over a hilltop with a small statue.', orientation: 'portrait' },
];

/** The buttons beside the name: the site's other two pages. */
export const pages = [
  // Kept short: a longer label pushes the buttons under the name on 1366px laptops.
  { label: 'What I build', to: '/work' },
  { label: 'Skills', to: '/skills' },
];

/** The landing page's two ways in. */
export const doors = [
  {
    to: '/me',
    kicker: 'The short version',
    title: 'Who I am',
    teaser: 'What I care about, the books I keep close, and a few photos.',
    time: '2 min read',
  },
  {
    to: '/work',
    kicker: 'The long version',
    title: 'What I build',
    teaser: 'Every project in depth: how it works and what it achieved.',
    time: '10 min read',
  },
];

export const contact = [
  { label: 'Email', href: `mailto:${siteConfig.social.email}`, external: false },
  { label: 'LinkedIn', href: siteConfig.social.linkedin, external: true },
  { label: 'GitHub', href: siteConfig.social.github, external: true },
].filter((link) => link.href && link.href !== 'mailto:');
