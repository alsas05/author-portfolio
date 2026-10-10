export interface PhilosophyPillar {
  title: string;
  description: string;
}

export interface TimelineMilestone {
  year: string;
  title: string;
  description: string;
  bookSlug?: string;
  bookCover?: string;
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
      bookSlug: 'chronicles-of-heart-a-loves-tapestry',
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
    {
      year: '2026',
      title: 'Petrichor Anthology Published',
      description:
        "Publication of 'Petrichor: An International Anthology of Contemporary Poetry' with Jollie Publication, featuring personal poetic contribution alongside contemporary voices worldwide.",
      bookSlug: 'petrichor',
    },
  ],
  beyondWriting:
    'When not immersed in manuscripts or binding collector volumes, Alsa.S explores her career as a final year B.Tech student in Computer Science discipline. ',
  ctaHeading: 'Step Into the Stories',
  ctaSubheading: 'Explore the catalog or reach out for inquiries, readings, and correspondence.',
};

export function extractSortYear(yearStr: string): number {
  if (!yearStr) return 9999;
  const match = yearStr.match(/\b(19\d{2}|20\d{2})\b/);
  if (match) return parseInt(match[1], 10);
  if (yearStr.toLowerCase().includes('present')) return 9998;
  return 9999;
}

export function extractYearDisplay(
  dateStr?: string | null,
  fallbackYear: number = new Date().getFullYear()
): string {
  if (!dateStr || !dateStr.trim()) return String(fallbackYear);
  const match = dateStr.match(/\b(19\d{2}|20\d{2})\b/);
  return match ? match[1] : dateStr.trim();
}

export function milestoneMatchesBook(
  milestone: TimelineMilestone,
  book: { title: string; slug: string }
): boolean {
  if (milestone.bookSlug && milestone.bookSlug === book.slug) return true;
  const mTitle = milestone.title.toLowerCase().replace(/[^a-z0-9]/g, '');
  const bTitle = book.title.toLowerCase().replace(/[^a-z0-9]/g, '');
  const bMainTitle = book.title.split(':')[0].trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const slugClean = book.slug.replace(/[^a-z0-9]/g, '');

  return (
    mTitle.includes(bMainTitle) ||
    bTitle.includes(mTitle) ||
    mTitle.includes(slugClean)
  );
}

export function generateBookMilestone(book: {
  title: string;
  slug: string;
  subtitle?: string | null;
  genre?: string | null;
  description?: string | null;
  publisher?: string | null;
  publicationDate?: string | null;
  coverImage?: string | null;
}): TimelineMilestone {
  const year = extractYearDisplay(book.publicationDate);
  const subLower = (book.subtitle || '').toLowerCase();
  const genreLower = (book.genre || '').toLowerCase();
  const isAnthology = subLower.includes('anthology') || genreLower.includes('anthology');

  let title = book.title;
  if (!title.toLowerCase().includes('released') && !title.toLowerCase().includes('published')) {
    title = isAnthology ? `${book.title} Anthology Published` : `${book.title} Released`;
  }

  let desc = '';
  if (book.publisher) {
    desc += `Published with ${book.publisher}. `;
  }
  if (book.description) {
    desc += book.description;
  } else if (book.subtitle) {
    desc += book.subtitle;
  } else {
    desc += `Official publication of ${book.title}.`;
  }

  if (desc.length > 260) {
    desc = desc.slice(0, 257).trim() + '...';
  }

  return {
    year,
    title,
    description: desc,
    bookSlug: book.slug,
    bookCover: book.coverImage || undefined,
  };
}

export function mergeTimelineWithBooks(
  existingTimeline: TimelineMilestone[],
  books: Array<{
    title: string;
    slug: string;
    subtitle?: string | null;
    genre?: string | null;
    description?: string | null;
    publisher?: string | null;
    publicationDate?: string | null;
    coverImage?: string | null;
    status?: string | null;
  }>
): TimelineMilestone[] {
  const result: TimelineMilestone[] = (existingTimeline || []).map((item) => ({ ...item }));

  // Link existing milestones with matching books
  for (const item of result) {
    const matchedBook = books.find((b) => milestoneMatchesBook(item, b));
    if (matchedBook) {
      if (!item.bookSlug) item.bookSlug = matchedBook.slug;
      if (!item.bookCover && matchedBook.coverImage) item.bookCover = matchedBook.coverImage;
    }
  }

  // Add books that don't yet have a milestone
  for (const book of books) {
    if (book.status === 'ARCHIVED') continue;
    const exists = result.some((item) => milestoneMatchesBook(item, book));
    if (!exists) {
      result.push(generateBookMilestone(book));
    }
  }

  // Sort chronologically
  return result.sort((a, b) => {
    const yearA = extractSortYear(a.year);
    const yearB = extractSortYear(b.year);
    return yearA - yearB;
  });
}

export async function syncAboutSettingsWithBooksInDb(
  prismaClient: any,
  options?: { deletedSlug?: string }
) {
  try {
    const [setting, allBooks] = await Promise.all([
      prismaClient.siteSetting.findUnique({ where: { key: 'about_page_data' } }),
      prismaClient.book.findMany({
        where: { status: { not: 'ARCHIVED' } },
        orderBy: { order: 'asc' },
      }),
    ]);

    let aboutData: AboutData = DEFAULT_ABOUT_DATA;
    if (setting?.value) {
      try {
        aboutData = { ...DEFAULT_ABOUT_DATA, ...JSON.parse(setting.value) };
      } catch {
        aboutData = DEFAULT_ABOUT_DATA;
      }
    }

    let timeline = aboutData.timeline || [];
    if (options?.deletedSlug) {
      timeline = timeline.filter((item) => item.bookSlug !== options.deletedSlug);
    }

    const updatedTimeline = mergeTimelineWithBooks(timeline, allBooks);
    aboutData.timeline = updatedTimeline;

    await prismaClient.siteSetting.upsert({
      where: { key: 'about_page_data' },
      update: { value: JSON.stringify(aboutData) },
      create: { key: 'about_page_data', value: JSON.stringify(aboutData) },
    });

    return aboutData;
  } catch (err) {
    console.error('Failed to sync about settings with books:', err);
    return null;
  }
}
