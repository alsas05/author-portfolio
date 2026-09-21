export interface PhilosophyPillar {
  title: string;
  description: string;
}

export interface TimelineMilestone {
  year: string;
  title: string;
  description: string;
}

export interface AboutData {
  portraitImage: string;
  portraitCaption: string;
  tagline: string;
  heading: string;
  bioParagraph1: string;
  bioParagraph2: string;
  bioParagraph3: string;
  philosophy: PhilosophyPillar[];
  timeline: TimelineMilestone[];
  beyondWriting: string;
  ctaHeading: string;
  ctaSubheading: string;
}

export const DEFAULT_ABOUT_DATA: AboutData = {
  portraitImage:
    'https://www.image2url.com/r2/default/images/1790010406447-4c63b69b-fb5c-4472-af6f-e3ae8d1dba30.webp',
  portraitCaption: 'Alsa.S ',
  tagline: 'Author · Poet',
  heading: 'About Alsa.S',
  bioParagraph1:
    'Alsa.S is an author, poet, and storyteller whose work dwells in the quiet thresholds between departure and return, love and silence, mortal grief and luminous wonder.',
  bioParagraph2: '',
  bioParagraph3: '',
  philosophy: [
    {
      title: 'Silence as Cadence',
      description:
        'The spaces between lines hold as much narrative gravity as the phrases themselves. To write well is to know when to let the silence breathe.',
    },
    {
      title: 'Physicality of Language',
      description:
        'Sentences must carry scent, weight, and temperature. Cold sea salt on wool, wet ashes in stone cups, amber lamplight reflecting in dark tea.',
    },
    {
      title: 'Uncompromising Empathy',
      description:
        'Characters are never instruments of convenience; they are sovereign humans wrestling with their own contradictions, longing, and forgiveness.',
    },
  ],
  timeline: [
    {
      year: '2016-Present',
      title: 'The Solitary Notebooks',
      description:
        'Began writing poetic fragments and early drafts of coastal short stories during late nocturnal hours, exploring human memory and sacred distance.',
    },
    {
      year: '2025',
      title: 'Chronicles of Heart Released',
      description:
        "Publication of 'Chronicles of Heart: A Love’s Tapestry' with Notion Press, receiving widespread appreciation for its spare, crystalline verses on devotion.",
    },
    {
      year: '2025-2026',
      title: 'Like the Moon to the Tide',
      description: 'Debut literary romance novel Work-in-Progress',
    },
    {
      year: '2025–2026',
      title: 'Do Not Get Off',
      description:
        "Deepening into worldbuilding for the claustrophobic thriller novel  'Do Not Get Off'.",
    },
  ],
  beyondWriting:
    'When not immersed in manuscripts or binding collector volumes, Alsa.S explores her career as a final year B.Tech student in Computer Science discipline. ',
  ctaHeading: 'Step Into the Stories',
  ctaSubheading: 'Explore the catalog or reach out for inquiries, readings, and correspondence.',
};
