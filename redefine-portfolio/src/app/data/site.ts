// Every visible string and project lives here, so real material can replace it without touching markup.
// Source of facts: Manoj's previous portfolio (manoj-portfolio-swart.vercel.app), his GitHub
// (ManojSreekumarK) and the three live project sites.
//
// Assumptions to confirm (mirrored in README.md):
// - url: the existing Vercel address is used as the production URL (canonical, OG, sitemap).
// - Case study copy (context, idea, craft, outcome) is written from what the live sites show; Manoj
//   should check it reads the way he would tell it.
// - The three working principles on the About page are written in his voice, not quoted.
// - The current employer from the old site is left out on purpose (it may be out of date).

export type Project = {
  slug: string;
  title: string;
  kind: string; // what it is, honestly: these are concept sites
  year: number;
  role: string[];
  stack: string[];
  discipline: string; // one short label for the index row
  summary: string; // one sentence
  live: string;
  distance: string; // where the project sits on the focus scale
  image: {
    desktop: string;
    small: string;
    mobile: string;
    scroll: string;
    alt: string;
    mobileAlt: string;
    scrollAlt: string;
  };
  context: string;
  idea: string;
  craft: { title: string; text: string }[];
  outcome: string;
};

export const site = {
  name: 'Manoj Sreekumar',
  first: 'Manoj',
  last: 'Sreekumar',
  role: 'Web designer and front-end developer',
  location: 'Kerala, India',
  url: 'https://manoj-portfolio-swart.vercel.app',
  email: 'manojsreekumar2000@gmail.com',
  socials: [
    { label: 'GitHub', href: 'https://github.com/ManojSreekumarK' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/manoj-sreekumar' },
    { label: 'Freelancer', href: 'https://www.freelancer.in/u/manojsreekumar20' },
  ],
  description:
    'Manoj Sreekumar is a web designer and front-end developer in Kerala, India. He designs websites in Figma and builds them as fast, responsive code.',
  hero: 'I design websites and write the code that ships them.',
  statementTitle: ['Most websites', 'start blurry.'],
  statement:
    'A rough sketch, a brief in a chat thread, a client who knows how the site should feel but not how it should look. My work is bringing that into definition: the layout, the type, every state, and the responsive code that makes it real.',
  stages: [
    {
      name: 'Listen',
      text: 'A call, a look at what exists, the messy version of the idea. I write down who the site is for and what it has to do.',
    },
    {
      name: 'Sketch',
      text: 'Rough layouts and flows in Figma. Cheap to throw away, quick to argue about, and nothing gets polished too early.',
    },
    {
      name: 'Design',
      text: 'Type, colour, spacing and every state of every section, drawn as one small system rather than a stack of pages.',
    },
    {
      name: 'Build',
      text: 'Responsive front-end code in HTML, CSS and JavaScript, or in Angular, React, Vue or Svelte, checked on real phones.',
    },
  ],
  services: [
    'Website and landing page design in Figma',
    'Responsive front-end development',
    'Angular, React, Vue and Svelte builds',
    'Webflow and low-code builds (Bubble, Mendix)',
  ],
  bio: [
    'I am Manoj Sreekumar, a web designer and front-end developer based in Kerala, India. I design layouts in Figma and build them from scratch as responsive websites, so nothing gets lost between the design file and the browser.',
    'I have helped clients set up their presence online, and I keep picking up new tools as I go, from Angular and Svelte to Webflow and low-code platforms. I am open to freelance work.',
  ],
  pair: 'The layout I draw in Figma is the layout that ships. Designing and building in the same hands means the details survive the handoff, down to the last breakpoint.',
  quote: { text: 'On the other side of the screen, it all looks so easy.', source: 'Tron (1982)' },
  principles: [
    {
      title: 'Start from the blur',
      text: 'Send the messy version of the idea first. A rough conversation tells me more than a polished brief.',
    },
    {
      title: 'Design in the browser too',
      text: 'A layout is only finished once it works at every width, so I move into code early.',
    },
    {
      title: 'Sharp at the edges',
      text: 'Empty states, long names, slow networks and small phones get the same care as the hero.',
    },
  ],
  skills: [
    { group: 'Languages', items: ['JavaScript', 'TypeScript', 'Python', 'C', 'C++', 'Java'] },
    { group: 'Frameworks', items: ['Angular', 'React', 'Vue', 'Svelte'] },
    { group: 'Web', items: ['HTML', 'CSS', 'SCSS', 'REST'] },
    { group: 'Databases', items: ['SQLite', 'PostgreSQL', 'MongoDB'] },
    { group: 'Design', items: ['Figma', 'Photoshop', 'Illustrator', 'After Effects'] },
    { group: 'Platforms', items: ['Git', 'Linux', 'Webflow', 'Bubble', 'Mendix'] },
  ],
};

const img = (k: string, alt: string, mobileAlt: string, scrollAlt: string) => ({
  desktop: `/work/${k}-desktop.webp`,
  small: `/work/${k}-desktop-800.webp`,
  mobile: `/work/${k}-mobile.webp`,
  scroll: `/work/${k}-scroll.webp`,
  alt,
  mobileAlt,
  scrollAlt,
});

export const projects: Project[] = [
  {
    slug: 'brands-io',
    title: 'Brands.io',
    kind: 'Concept site',
    year: 2023,
    role: ['Design', 'Front end'],
    stack: ['HTML', 'CSS', 'JavaScript'],
    discipline: 'Landing page, brand analytics',
    summary:
      'A landing page for an invented brand analytics product, built to explore a bright, gradient brand identity.',
    live: 'https://manojsreekumark.github.io/Brands/',
    distance: '0.8 m',
    image: img(
      'brands',
      'Brands.io hero: the headline “Tell a better brand story” in a violet to peach gradient beside floating dashboard cards.',
      'Brands.io on a phone, with the gradient headline stacked above the call to action.',
      'Brands.io sections below the hero: features, how it works and the analytics cards.',
    ),
    context:
      'Brands.io is not a real company. It is a brief I set myself: a marketing analytics product that needs to look trustworthy and lively at the same time, on one long page.',
    idea: 'Let the product speak through its own interface. The hero shows the dashboard itself, as floating cards with a growth chart, a media donut and follower counts, so the page sells the tool by showing it.',
    craft: [
      {
        title: 'One gradient, used with care',
        text: 'Violet to peach carries the headline, the buttons and the charts, and nothing else.',
      },
      {
        title: 'The product as hero art',
        text: 'A growth chart, a media donut and follower counts float around the headline.',
      },
      {
        title: 'A long page with a rhythm',
        text: 'Offer, how it works, plans and contact each get their own layout.',
      },
    ],
    outcome: 'Live on GitHub Pages as a single responsive page in plain HTML, CSS and JavaScript.',
  },
  {
    slug: 'taste-now',
    title: 'Taste Now',
    kind: 'Concept site',
    year: 2023,
    role: ['Design', 'Front end'],
    stack: ['HTML', 'CSS', 'JavaScript'],
    discipline: 'Multipage site, food delivery',
    summary:
      'A multipage website for an invented food delivery service, from the home page to blog, contact and sign up.',
    live: 'https://manojsreekumark.github.io/taste-now/',
    distance: '1.5 m',
    image: img(
      'tastenow',
      'Taste Now home page: “Experience food delivery like no other” beside a salad bowl, with category buttons for pizzas, burgers, salads and combos.',
      'Taste Now on a phone, with the headline above the salad photograph.',
      'Taste Now sections: popular categories, the 45 minute delivery promise and the call to join the team.',
    ),
    context:
      'A food delivery brand needs to work for two audiences at once: hungry customers and the riders it wants to hire. Taste Now is a concept site that tries to serve both without feeling like two sites.',
    idea: 'Lead with appetite, then the promise. One red, one big photograph and plain categories get people ordering; the delivery promise and the hiring pitch follow in the same voice further down.',
    craft: [
      {
        title: 'Five real pages',
        text: 'Home, about, blog, contact and sign up share one header, footer and type scale.',
      },
      {
        title: 'Categories as buttons',
        text: 'Pizzas, burgers, salads and combos are large, outlined tap targets.',
      },
      {
        title: 'One accent colour',
        text: 'A single red marks every action, so the next step is always obvious.',
      },
    ],
    outcome:
      'Live on GitHub Pages as five linked, responsive pages in plain HTML, CSS and JavaScript.',
  },
  {
    slug: 'dentics',
    title: 'Dentics',
    kind: 'Concept site',
    year: 2023,
    role: ['Design', 'Front end'],
    stack: ['HTML', 'CSS', 'JavaScript'],
    discipline: 'Landing page, dental clinic',
    summary:
      'A landing page for an invented dental clinic that walks a nervous patient from first look to booked appointment.',
    live: 'https://manojsreekumark.github.io/Dentics/',
    distance: '3 m',
    image: img(
      'dentics',
      'Dentics hero: “We provide high quality dental services” with a portrait framed by yellow stat badges and a calendar card.',
      'Dentics on a phone, with the headline and the appointment button.',
      'Dentics sections: the three steps to book, the list of treatments and the key features.',
    ),
    context:
      'People rarely look forward to the dentist. A clinic site has to calm people down and get them to book, and most of them read it on a phone, often in a hurry.',
    idea: 'Make booking feel like three small steps. Call for an appointment, get a date, see your dentist: the page explains the visit before it lists a single treatment.',
    craft: [
      {
        title: 'Three steps first',
        text: 'How the visit works comes before any treatment names or prices.',
      },
      {
        title: 'Calm colours',
        text: 'A clinical blue with sunny yellow badges keeps it friendly rather than sterile.',
      },
      {
        title: 'Eight services, scannable',
        text: 'Check ups to implants as a simple list, then six features in cards.',
      },
    ],
    outcome: 'Live on GitHub Pages as a single responsive page in plain HTML, CSS and JavaScript.',
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
