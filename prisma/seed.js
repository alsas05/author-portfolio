const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ALSA.S Author Platform database...');

  // 1. Seed Admin User
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@alsas.com' },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('AlsaAuthor2026!', 10);
    await prisma.user.create({
      data: {
        email: 'admin@alsas.com',
        name: 'Alsa.S',
        passwordHash,
        role: 'ADMIN',
      },
    });
    console.log('Admin user created: admin@alsas.com');
  }

  // 2. Clear previous content if refreshing
  await prisma.purchaseLink.deleteMany({});
  await prisma.book.deleteMany({});
  await prisma.writing.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.newsletterSubscriber.deleteMany({});
  await prisma.contactMessage.deleteMany({});
  await prisma.siteSetting.deleteMany({});

  // 3. Seed Books
  const book1 = await prisma.book.create({
    data: {
      title: 'Like the Moon to the Tide',
      slug: 'like-the-moon-to-the-tide',
      subtitle: 'A Novel of Unspoken Gravities',
      genre: 'Literary Fiction / Contemporary Romance',
      description: 'An intimate, cinematic novel tracing two souls bound by silent rhythms of departure and return across coastal mist and midnight trains.',
      synopsis: `Set against the tempestuous backdrop of the northern windswept coast, 'Like the Moon to the Tide' tells the story of Calla and Julian—two estranged artists drawn back to the weathered cottage where their childhoods intertwined. 

As unspoken griefs wash ashore with each incoming wave, they must navigate the pull between memory and reinvention, confronting the silent gravity that has quietly governed every choice they have ever made.

With lyrical prose that captures the briny salt of ocean air and the quiet ache of midnight conversations, Alsa.S crafts an unforgettable portrait of devotion, longing, and the courage it takes to surrender to what is inevitable.`,
      authorNote: `I began writing this book in an attic beside the Atlantic during a November of unrelenting storms. Julian and Calla lived in my notebooks for three years before they found their way onto the page. To everyone who has ever loved someone from across an ocean or across a crowded room in silence: this tide belongs to you.`,
      excerpt: `The ocean does not ask permission of the shoreline before it crashes upon it. It simply knows where it is pulled, and how to drown whatever stones are foolish enough to resist.

She watched him from across the damp deck of the ferry. The fog was so thick it smelled of cold salt and iron, clinging to the wool of his coat like hoarfrost. When Julian turned his head, his eyes caught the amber harbor beacon—the same amber light that had illuminated the porch of the boathouse ten winters ago when neither of them had known how to say goodbye.

"You're late, Calla," he said softly, the words barely louder than the hum of the engine beneath their feet.

"The train broke down in Camden," she replied. She did not step closer, though every nerve in her palms pleaded with the distance. "I thought you wouldn't wait."

Julian looked out into the grey horizon where the sea blurred into sky. "I have been waiting since October. Another hour is nothing."`,
      coverImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1000&auto=format&fit=crop',
      publisher: 'Veritas & Quill Press',
      publicationDate: 'October 14, 2024',
      isbn: '978-1-954382-01-4',
      pageCount: 384,
      language: 'English',
      format: 'Hardcover, Paperback, Clothbound Collector',
      status: 'PUBLISHED',
      featured: true,
      order: 1,
      purchaseLinks: {
        create: [
          {
            platform: 'Amazon',
            displayName: 'Buy on Amazon',
            url: 'https://amazon.com',
            region: 'Global',
            clickCount: 142,
          },
          {
            platform: 'Publisher',
            displayName: 'Buy from Veritas & Quill',
            url: 'https://example.com/publisher',
            region: 'Direct / Signed Editions',
            clickCount: 88,
          },
          {
            platform: 'Barnes & Noble',
            displayName: 'Barnes & Noble',
            url: 'https://barnesandnoble.com',
            region: 'North America',
            clickCount: 45,
          },
          {
            platform: 'Bookshop.org',
            displayName: 'Support Indie Bookstores',
            url: 'https://bookshop.org',
            region: 'US / UK',
            clickCount: 63,
          },
        ],
      },
    },
  });

  const book2 = await prisma.book.create({
    data: {
      title: "Chronicles of Heart: A Love's Tapestry",
      slug: 'chronicles-of-heart-a-loves-tapestry',
      subtitle: 'A Collection of Poetry and Fragments',
      genre: 'Poetry',
      description: 'A luminous anthology of poetic meditations on adoration, vulnerability, sacred distance, and the threads that weave fragile human hearts into endurance.',
      synopsis: `'Chronicles of Heart: A Love's Tapestry' is an evocative collection divided into four movements: Dawnlight, The Weave, The Unraveling, and The Gold Leaf. 

Through spare, crystalline verses and haunting lyrical vignettes, Alsa.S explores the quietest sanctuaries of devotion. Here are poems for the sleepless hours, for the letters kept unposted in coat pockets, and for the sudden realization that love is not a harbor we reach, but the vessel we rebuild anew each morning.`,
      authorNote: `These poems were born in notebooks with coffee rings and dog-eared margins. They were written between train rides, airport terminals, and quiet midnight desks. May these pages hold your heart gently, as they held mine.`,
      excerpt: `You asked me once where the light goes
when the lamp is turned low.

I pointed to the hollow beneath your collarbone,
where your breath gathers in quiet cadence
while the city sleeps.

Some lanterns do not illuminate walls.
Some lanterns exist only to remind the dark
that we were here,
and we were not afraid to burn.`,
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop',
      publisher: 'Hesperus Literary Arts',
      publicationDate: 'February 14, 2023',
      isbn: '978-0-998241-18-2',
      pageCount: 192,
      language: 'English',
      format: 'Parchment Hardcover with Gold Foil',
      status: 'PUBLISHED',
      featured: false,
      order: 2,
      purchaseLinks: {
        create: [
          {
            platform: 'Amazon',
            displayName: 'Buy on Amazon',
            url: 'https://amazon.com',
            region: 'Global',
            clickCount: 97,
          },
          {
            platform: 'Publisher',
            displayName: 'Publisher Edition',
            url: 'https://example.com/hesperus',
            region: 'Global',
            clickCount: 39,
          },
          {
            platform: 'Waterstones',
            displayName: 'Waterstones UK',
            url: 'https://waterstones.com',
            region: 'UK & Europe',
            clickCount: 22,
          },
        ],
      },
    },
  });

  const book3 = await prisma.book.create({
    data: {
      title: "The Devourer's Crown",
      slug: 'the-devourers-crown',
      subtitle: 'The Embers of Oakhaven: Book I',
      genre: 'Dark Epic Fantasy',
      description: 'In an empire where monarchs must consume memories of their ancestors to maintain sovereign wards, a disgraced archivist discovers that the oldest crown is devouring the realm from within.',
      synopsis: `The Crown of Vaelen does not rest upon gold and jewel; it feeds on the living reminiscence of the kingdom's martyrs. 

When young archivist Lyra Vane is summoned to transcribe the dying whispers of High King Raymond, she uncovers an ancient parchment that was never meant to survive the Great Purge. The wards holding the Outer Abyss are not failing from external siege—they are being surrendered piece by piece to satisfy the insatiable hunger of the sovereign diadem.

Forced into an uneasy alliance with an exiled shadow-weaver whose very lineage was erased from the annals of time, Lyra must decipher the forbidden cryptograms before the next solar solstice claims what remains of her own humanity.`,
      authorNote: `Fantasy has always been, for me, the grandest canvas to examine truth, power, and historical erasure. 'The Devourer's Crown' was an odyssey of worldbuilding, linguistic reconstruction, and dark majesty. Prepare for shadows with teeth.`,
      excerpt: `The crown smelled of cold copper and wet ashes.

It rested on a plinth of black basalt at the center of the sanctum, pulsing with a rhythm so slow it could have belonged to a mountain. When Lyra stepped across the chalk line of the threshold, the whispers began—not inside the room, but between her ears, scratching at the backs of her eyes like moths against a lantern chimney.

"Touch it," the voice whispered, in the cadence of a brother she had buried seven autumns ago. "Touch it, and we will tell you where he went."`,
      coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?q=80&w=1000&auto=format&fit=crop',
      publisher: 'Blackwood & Thorne',
      publicationDate: 'November 2025',
      isbn: '978-1-849201-92-0',
      pageCount: 512,
      language: 'English',
      format: 'Collector Hardback with Illustrated Endpapers',
      status: 'UPCOMING',
      featured: false,
      order: 3,
      purchaseLinks: {
        create: [
          {
            platform: 'Amazon',
            displayName: 'Pre-order on Amazon',
            url: 'https://amazon.com',
            region: 'Global',
            clickCount: 51,
          },
          {
            platform: 'Publisher',
            displayName: 'Special Edition Pre-order',
            url: 'https://example.com/blackwood',
            region: 'Signed Hardcover',
            clickCount: 67,
          },
        ],
      },
    },
  });

  const book4 = await prisma.book.create({
    data: {
      title: 'Do Not Get Off',
      slug: 'do-not-get-off',
      subtitle: 'A Psychological Noir',
      genre: 'Literary Thriller / Noir',
      description: 'A midnight commuter train that skips every station into an infinite alpine tunnel, carrying seven strangers whose secrets are inextricably entwined.',
      synopsis: `It was the 11:42 PM express from Geneva to Zurich. The weather was torrential. The passenger carriage held seven people: an antiquarian dealer, a violinist with a taped wrist, a retired magistrate, an architect fleeing a burning tower, a young mother traveling without her child, a ticket inspector who hasn't spoken a word, and a woman who refuses to look into the glass window.

When the train plunges into the Gotthard massif and the digital clocks reset to 00:00, the carriage doors lock from the exterior. Over the intercom comes a single quiet instruction:

"Do not get off. Not even if you see your own home on the platform."

A razor-sharp, claustrophobic exploration of complicity, moral debt, and the illusions we cling to in the dark.`,
      authorNote: `Written during long nocturnal sleeper train journeys across Central Europe. The rhythm of steel wheels over rail ties became the metronome of this suspenseful descent.`,
      excerpt: `The neon signage of St. Moritz flashed past the window at eighty miles per hour.

Arthur looked down at his mechanical wristwatch. The second hand was shuddering backwards. Outside, the blizzard was not blowing snow; it was blowing ash.

"Did anyone hear the conductor announce the bypass?" he asked aloud.

No one answered. The violinist at the end of the aisle simply tightened the brass peg on her G string until the wire snapped with the sound of a pistol shot.`,
      coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop',
      publisher: 'Nocturne Books',
      publicationDate: 'Coming Late 2026',
      isbn: '978-0-743289-44-1',
      pageCount: 320,
      language: 'English',
      format: 'Trade Paperback & Audio',
      status: 'UPCOMING',
      featured: false,
      order: 4,
      purchaseLinks: {
        create: [
          {
            platform: 'Goodreads',
            displayName: 'Add to Goodreads',
            url: 'https://goodreads.com',
            region: 'Global',
            clickCount: 34,
          },
        ],
      },
    },
  });

  // 4. Seed Writings (Poetry, Short Stories, Excerpts, Letters, Reflections)
  await prisma.writing.createMany({
    data: [
      {
        title: 'Tonight, Everything Glows',
        slug: 'tonight-everything-glows',
        category: 'Poetry',
        readingTime: '2 min read',
        excerpt: 'A quiet study of amber lamplight reflecting in tea, and how the world softens when the rain begins.',
        content: `Tonight, the rain makes a cathedral of the eaves.
The tea in my porcelain cup is amber,
reflecting the lamp that has kept vigil over my desk
since November began.

There is a way the darkness holds the city
that feels less like an absence
and more like a hand placed over an eyelid,
whispering: *Rest now. You have done enough.*

I think of the words we left unsaid
in the vestibule beneath the cold portico.
They did not vanish into the damp pavement;
they merely waited for an hour quiet enough
to be understood.

Tonight, everything glows
not because the sun has returned,
but because we have learned
how to keep our own fire.`,
        tags: 'Night,Rain,Stillness,Reflection',
        published: true,
        publishedAt: new Date('2025-01-15T22:00:00Z'),
        views: 842,
      },
      {
        title: 'Whispers at Twilight',
        slug: 'whispers-at-twilight',
        category: 'Poetry',
        readingTime: '2 min read',
        excerpt: 'Verses on the threshold where the day surrenders to dusk and memory becomes audible.',
        content: `The swallows dip low over the marsh reeds.
The sky is the color of bruised plums
fading into bruised gold.

Stand here with me on the timber dock.
Listen to how the tide breathes against the pilings,
heavy and slow, like an ancient animal
turning in its sleep.

What we were cannot be undone.
What we will become has not yet taken shape.
In this hour of blue shadow,
let us be nothing more than two silhouettes
holding the seam between sky and earth.`,
        tags: 'Twilight,Seaside,Silence',
        published: true,
        publishedAt: new Date('2025-02-04T18:30:00Z'),
        views: 619,
      },
      {
        title: 'A Taxonomy of Longing',
        slug: 'a-taxonomy-of-longing',
        category: 'Poetry',
        readingTime: '3 min read',
        excerpt: 'Categorizing the seven distinct weights of human absence through botanical metaphors.',
        content: `I. The Fern in the North Window
It grows without direct sun,
thriving on pale northern daylight.
This is the longing that does not wound;
it simply leans toward the pane.

II. The Dry Well in the Orchard
Deep stone. A circle of sky at the bottom.
You drop a pebble and count four seconds
before the echo rises.
This is the longing for a home
that was demolished while you were growing up.

III. The Pressed Lavender
Folded inside the pages of a dictionary
between *Grave* and *Grace*.
Ten years dry, yet if you crush the petal
between two fingertips,
the summer of nineteen-ninety-eight
rushes into your lungs.

IV. The Unanswered Letter
Ink that drys in the drawer.
Addressed to someone who changed cities
without leaving a forwarding address.
This is not grief;
it is an envelope holding your own youth.`,
        tags: 'Memory,Solitude,Love',
        published: true,
        publishedAt: new Date('2025-02-20T14:15:00Z'),
        views: 1120,
      },
      {
        title: "The Clockmaker's Unfinished Hour",
        slug: 'the-clockmakers-unfinished-hour',
        category: 'Short Stories',
        readingTime: '7 min read',
        excerpt: 'In an alpine valley, an artisan crafts a clock that ticks sixty-one seconds to each minute for those who need more time.',
        content: `Master Tobias kept the door to his workshop locked with a key cast in bell-metal.

The villagers of Saint-Luc knew better than to knock after dusk. It was during the violet hours between twilight and midnight that the pendulums in his atelier achieved a peculiar synchrony. If you stood beneath his eaves on a frosty winter evening, you would hear not the erratic chatter of thirty distinct escapements, but a solitary, resonant heartbeat that seemed to slow the falling of the snowflakes.

"Time," Tobias had once told me while adjusting the balance wheel of a carriage clock with bone tweezers, "is not a river. That is the conceit of poets. Time is a woven linen. And like any textile, the thread occasionally catches upon the loom."

In his eighty-fourth year, after the death of his granddaughter Sophie, Tobias began what he called *The Pendule du Pardon*. It was fashioned from unpolished cedar, brass gears harvested from nineteenth-century astronomical instruments, and a hairspring coiled from silver wire.

Its dial was unremarkable, save for one detail: between the numbers twelve and one, there was an unmarked ivory tooth.

Once each hour, when the minute hand ascended to the zenith, it did not immediately strike the hour. It hesitated upon that tooth for precisely sixty seconds. A ghost minute. A sixty-first second in which the world paused its tally of mortal debt.

People came from Zurich and Lyon when rumor spread. A banker whose daughter had stopped speaking to him. A physician whose diagnosis had come twenty-four hours too late. A composer who had lost the cadence of his final movement.

They would sit in Tobias's armchair of worn horsehair, hands clasped, waiting for the hand to reach the top. And in that silent, uncounted minute, they wept—not with sorrow, but with the astonishing relief of being granted an instant outside of consequence.

When Tobias was found asleep forever at his workbench on the first frost of November, the clock was still running. It is running still. Come to Saint-Luc if your heart is heavy. Sit in the chair. Listen for the sixty-first second.`,
        tags: 'Story,Time,Memory,Alpine',
        published: true,
        publishedAt: new Date('2025-01-28T10:00:00Z'),
        views: 1450,
      },
      {
        title: 'Letters to the Constellations: Ursa Major',
        slug: 'letters-to-the-constellations-ursa-major',
        category: 'Letters',
        readingTime: '4 min read',
        excerpt: 'An epistolary reflection addressed to the northern sky on navigation, grief, and eternal bearings.',
        content: `Dear Bear of the Northern Pole,

Tonight I walked to the edge of the breakwater where the harbor lantern stops. You were hanging low over the mastheads, seven cold studs of diamond pressed into black wool.

When I was seven, my father pointed his thumb toward your pointer stars and showed me how to draw a straight line to Polaris. "No matter how lost the skiff gets," he said, his coat smelling of pipe tobacco and cedar sawdust, "that one does not wander. Everything turns around her."

I wonder if you grow weary of being our landmark. For five thousand years, sailors, wanderers, refugees, and poets have looked up at your silver shoulders, begging for bearings. We ask so much of things that are millions of light-years away, simply because they do not change their minds.

Tonight, I do not ask for a direction. I only ask to be reminded that distance does not mean absence. You burn in the ancient silence, and down here, beside the cold tide, a pen scratches across paper, answering your light.

With quiet reverence,
Alsa`,
        tags: 'Letters,Astronomy,Philosophy',
        published: true,
        publishedAt: new Date('2025-02-10T21:00:00Z'),
        views: 730,
      },
      {
        title: 'The Architecture of Silence',
        slug: 'the-architecture-of-silence',
        category: 'Reflections',
        readingTime: '4 min read',
        excerpt: 'Why the spaces between sentences in literature carry more emotional truth than the words themselves.',
        content: `Music exists in the decay of sound into quiet. A chord struck upon a grand piano is beautiful not only at the instant the hammer kisses the felt string, but in the shimmering resonance that follows—the long, trembling trail that dissolves into the wooden floorboards.

Writing operates on identical physics.

The sentences that stay with us for decades are rarely the loudest or the most ornate. They are the sentences flanked by vast, intentional silence. When Virginia Woolf writes: *"Time passes,"* or when Gabriel García Márquez recalls the afternoon his father took him to discover ice, the words are merely lanterns hanging in an immense room of unspoken history.

In our modern world, silence is treated as a void to be filled immediately by notifications, commentary, and algorithmic noise. But for the writer, silence is the mortar. Without it, the bricks of our vocabulary crumble under the first gust of wind.

Guard your quiet. Protect the hours before dawn. The page requires not your cleverness, but your stillness.`,
        tags: 'Craft,Writing,Silence,Philosophy',
        published: true,
        publishedAt: new Date('2025-03-01T08:00:00Z'),
        views: 980,
      },
    ],
  });

  // 5. Seed Blog Posts (Editorial Magazine)
  await prisma.blogPost.createMany({
    data: [
      {
        title: 'The Sacred Hour: Why I Write Before the City Wakes',
        slug: 'the-sacred-hour-why-i-write-before-the-city-wakes',
        category: 'Writing Journey',
        readingTime: '5 min read',
        featuredImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop',
        excerpt: 'At 4:45 AM, the world is devoid of expectations. In that blue threshold between dreams and dawn, the rawest words find their way to paper.',
        content: `At 4:45 AM, the streetlights outside my window still cast long amber pools across the pavement. The milk truck hasn't rattled down the corner; the neighbor's kettle has not yet whistled; the inbox is entirely asleep.

In this threshold between dreaming and consciousness, the analytical editor who lives in the frontal lobe is still drowsy. She hasn't yet put on her spectacles to tell me that my metaphors are too extravagant or that my syntax is overly nostalgic. 

And so, the ink flows without interrogation.

### The Anatomy of the Morning Desk

My morning ritual is monastic and deliberate:
1. **The Match:** Striking a cedar match to light a beeswax candle. The faint honey aroma marks the boundary between everyday life and the writing room.
2. **The Kettle:** Pouring hot water over loose Lapsang Souchong tea. That smoky aroma has accompanied every book I have ever written.
3. **The Blank Notebook:** I write my first drafts by hand, using a fountain pen with midnight-black ink. The physical drag of the nib against fibrous paper grounds the cadence of the sentence in a way a glass screen never could.

When the sun finally breaks above the rooflines, staining the brick chimneypots in rose and apricot, two hours have evaporated. A scene has unfolded. A poem has found its cadence.

To anyone struggling with creative inertia: try setting your alarm ninety minutes before your obligations begin. Meet the morning before it has been tainted by the world's demands. You will be astonished by who meets you at the desk.`,
        tags: 'Writing,Rituals,Morning,Creative Process',
        published: true,
        publishedAt: new Date('2025-01-20T06:00:00Z'),
        views: 2130,
      },
      {
        title: 'Behind Like the Moon to the Tide: Mapping the Emotional Archipelago',
        slug: 'behind-like-the-moon-to-the-tide',
        category: 'Behind the Stories',
        readingTime: '6 min read',
        featuredImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
        excerpt: 'The real-life coastal cottages, ferry crossings, and personal griefs that converged to birth Julian and Calla’s story.',
        content: `Readers frequently ask me if 'Pelican Cove'—the storm-battered harbor where Julian and Calla reunite in *Like the Moon to the Tide*—is a real place.

The literal answer is no on the nautical charts; but the emotional answer is that it is pieced together from three actual coastlines that have haunted my life.

The rusted boathouse with the green copper roof belongs to a tiny fishing hamlet in northern Maine, where I spent a solitary autumn recovering from pneumonia. The ferry whose engines hum beneath the dialogue is the 6:00 PM crossing to the Isle of Mull in Scotland. And the steep stone stairway where Calla drops her sketchpad in Chapter Fourteen is outside an old chapel in Cornwall.

### The Physics of Longing

When conceiving this novel, I wanted to explore an equation: *Can two people love each other with absolute sincerity and still be wrong for each other's peace?*

Julian represents the tide—constant, rhythmic, predictable in his pull, but ultimately unable to remain still. Calla represents the shoreline—weathered, anchored, yet continually altered by every wave that breaks against her.

Writing their final confrontation in Chapter Twenty-Two took nineteen revisions. Every time I softened the blow, the story felt dishonest. In love, as in nature, erosive forces are not evil; they simply do what water has always done to stone.`,
        tags: 'Behind the Scenes,Novels,Like the Moon,Inspiration',
        published: true,
        publishedAt: new Date('2025-02-12T11:00:00Z'),
        views: 1840,
      },
      {
        title: 'On Drafts and Discarded Notebooks',
        slug: 'on-drafts-and-discarded-notebooks',
        category: "Author's Journal",
        readingTime: '4 min read',
        featuredImage: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=1200&auto=format&fit=crop',
        excerpt: 'Why throwing away fifty pages of an unfinished novel is not an act of failure, but the truest form of editorial respect.',
        content: `In the bottom drawer of my oak filing cabinet lie seven black moleskine notebooks bound with red rubber bands. 

They contain approximately three hundred thousand words that will never be printed, never be read by an editor, and never see the inside of a bookstore.

For years, I looked upon that drawer with a cold knot of guilt. *Think of the months spent,* a scolding voice would whisper. *Think of the mornings waking at four, only to end up in a drawer.*

It took me finishing three complete books to understand the truth: those discarded words were not waste. They were the scaffolding.

When a cathedral is built, timber beams and rope pulleys surround the stone pillars for years. Once the vaulted ceiling is keyed in with stone, the builders strike down the scaffolding and burn the timber. You do not look at the finished cathedral and mourn the wooden planks. The planks taught the stone how to stand against the sky.

If you have cut a chapter this week, or filed away a story that refused to breathe: do not despair. The work wasn't wasted. It was teaching you how to write the sentence that is coming tomorrow.`,
        tags: 'Craft,Journal,Editing,Perspective',
        published: true,
        publishedAt: new Date('2025-02-28T16:00:00Z'),
        views: 1540,
      },
      {
        title: 'Notes from the Road: Autumn Readings & Quiet Encounters',
        slug: 'notes-from-the-road-autumn-readings',
        category: 'Reading Corner',
        readingTime: '5 min read',
        featuredImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop',
        excerpt: 'Memories from five independent bookstores across three states, and the readers who brought their own dog-eared pages.',
        content: `The life of a writer is ninety-five percent solitary confinement and five percent intense, public vulnerability.

During October, I traveled through small towns to read from *Chronicles of Heart*. In independent bookshops whose floors creaked and whose cats slept atop the philosophy section, I met people who had carried my words into hospital waiting rooms, marriage ceremonies, and long train journeys through bereavement.

One young woman in Providence asked me to sign a copy of *Like the Moon to the Tide* that had been soaked in seawater. The pages were swollen and rippled like accordion bellows. 

"I read this on the cliffs during my divorce," she told me with a calm smile. "The salt water is part of the book now."

I signed my name across the rippled title page with a silver pen. There is no literary prize or bestseller ranking that compares to knowing your words became a shelter during someone's hardest season.`,
        tags: 'Events,Bookstores,Readers,Tour',
        published: true,
        publishedAt: new Date('2025-03-08T13:30:00Z'),
        views: 1290,
      },
      {
        title: 'Building a Mythos: The Lore Behind The Devourer’s Crown',
        slug: 'building-a-mythos-the-devourers-crown',
        category: 'Book Updates',
        readingTime: '6 min read',
        featuredImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
        excerpt: 'An early sneak peek into the linguistic systems, memory-magic, and archival architecture of my forthcoming dark fantasy.',
        content: `For two years, my study has been covered in butcher paper maps, genealogy trees traced in sepia ink, and lexicon indexes in a constructed dialect called *Vaelic*.

In *The Devourer's Crown*, magic is not elemental fire or incantations whispered into the breeze. Magic is **memory**.

To cast a ward that holds back the abyssal horrors beyond the perimeter mountains, the sovereign must surrender an intimate remembrance: the face of their first child, the taste of clean water after battle, the music heard on their wedding night. The Crown takes these memories and turns them into stone.

Over three centuries, the reigning dynasty has become emotionally desiccated—rulers without empathy or personal history, surviving only as hollow vessels for sovereign duty.

Enter Lyra Vane: a low-caste archivist whose job is to record what the kings forget.

I cannot wait to share this dark, opulent world with you when the book releases this November. Here is the first teaser quote:

> *"A kingdom that forgets its scars will gladly bleed again for anyone who promises a song."*`,
        tags: 'Fantasy,Worldbuilding,Sneak Peek,Devourers Crown',
        published: true,
        publishedAt: new Date('2025-03-12T19:00:00Z'),
        views: 2450,
      },
    ],
  });

  // 6. Seed Site Settings
  await prisma.siteSetting.createMany({
    data: [
      { key: 'author_name', value: 'Alsa.S' },
      { key: 'author_tagline', value: 'Author · Poet · Storyteller' },
      { key: 'hero_quote', value: 'Some stories are meant to be read. Others are meant to be felt.' },
      { key: 'social_instagram', value: 'https://instagram.com/alsas.author' },
      { key: 'social_twitter', value: 'https://x.com/alsas_writes' },
      { key: 'social_goodreads', value: 'https://goodreads.com/author/alsas' },
      { key: 'social_email', value: 'correspondence@alsas.com' },
    ],
  });

  // 7. Seed sample subscribers and contact messages
  await prisma.newsletterSubscriber.createMany({
    data: [
      { email: 'elena.vance@literaryjournal.org' },
      { email: 'reader.marcus@gmail.com' },
      { email: 'sophia.books@outlook.com' },
    ],
  });

  await prisma.contactMessage.createMany({
    data: [
      {
        name: 'Clara Oswald',
        email: 'clara@oxfordlitfest.org',
        subject: 'Keynote Invitation: Autumn Literary Colloquium 2026',
        message: 'Dear Alsa.S, We would be deeply honored to host you as our evening keynote speaker on the art of literary fiction and poetry...',
        isRead: false,
      },
      {
        name: 'Julian Thorne',
        email: 'jthorne@blackwoodbooks.co.uk',
        subject: 'Proof copies for The Devourer’s Crown',
        message: 'The collector edition foil proofs have arrived from the Italian bindery. The typography on the spine came out breathtakingly sharp.',
        isRead: true,
      },
    ],
  });

  console.log('Database seeded successfully with rich literary data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
