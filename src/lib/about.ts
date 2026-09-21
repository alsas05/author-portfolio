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
  portraitImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1000&auto=format&fit=crop',
  portraitCaption: 'Alsa.S at her desk',
  tagline: 'Author · Poet · Storyteller',
  heading: 'About Alsa.S',
  bioParagraph1:
    'Alsa.S is an author, poet, and storyteller whose work dwells in the quiet thresholds between departure and return, love and silence, mortal grief and luminous wonder.',
  bioParagraph2:
    'Writing from a sunlit study lined with weathered cedar bookshelves and stacks of linen-bound notebooks, she crafts novels and poetry collections that seek not to hurry the reader, but to give them permission to feel deeply.',
  bioParagraph3:
    'Her words have been read at weddings, whispered across hospital bedsides, and carried aboard night trains across the world.',
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
      year: '2020',
      title: 'The Solitary Notebooks',
      description:
        'Began writing poetic fragments and early drafts of coastal short stories during late nocturnal hours, exploring human memory and sacred distance.',
    },
    {
      year: '2023',
      title: 'Chronicles of Heart Released',
      description:
        "Publication of 'Chronicles of Heart: A Love’s Tapestry' with Notion Press, receiving widespread appreciation for its spare, crystalline verses on devotion.",
    },
    {
      year: '2025-2026',
      title: 'Like the Moon to the Tide',
      description:
        'Debut literary romance novel Work-in-Progress',
    },
    {
      year: '2025–2026',
      title: 'Do Not Get Off',
      description:
        "Deepening into worldbuilding for the claustrophobic alpine noir 'Do Not Get Off'.",
    },
  ],
  beyondWriting:
    'When not immersed in manuscripts or binding collector volumes, Alsa.S explores architectural history, botanical archives, and computational linguistics. She believes that scientific precision and literary romance are twin lenses trained on the same mystery: how conscious beings make sense of the universe',
  ctaHeading: 'Step Into the Stories',
  ctaSubheading: 'Explore the catalog or reach out for inquiries, readings, and correspondence.',
};
