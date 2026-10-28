// Blog taxonomy: controlled topics + cities, slug helpers, and page intros.
// Used by /topics/[topic].astro, /cities/[city].astro, /topics/index.astro,
// BlogSection.astro, and the tag links in blog index / article pages.

export const TOPICS = [
  'Transport',
  'Stay',
  'Food',
  'Sights',
  'Etiquette',
  'SIM',
  'Seasons',
] as const;

export const CITIES = [
  'Tokyo',
  'Kyoto',
  'Osaka',
  'Fukuoka',
  'Japan',
] as const;

export type Topic = (typeof TOPICS)[number];
export type City = (typeof CITIES)[number];

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const TOPIC_SLUGS = TOPICS.map(slugify);
export const CITY_SLUGS = CITIES.map(slugify);

// City -> matching product slugs (for the "PDF guides for this city" block).
// 'japan' resolves to all products at render time.
export const CITY_PRODUCTS: Record<string, string[]> = {
  tokyo: ['tokyo-5-day-route'],
  kyoto: ['kyoto-3-day-autumn', 'kyoto-takao-three-temples'],
  osaka: [],
  fukuoka: [],
  japan: [],
};

// Real, written intros (not lorem) for topic pages.
export const TOPIC_INTROS: Record<string, string> = {
  Transport:
    'Getting around Japan is half the adventure. From the JR Pass maths to local trains, ferries, and airport express runs, these guides focus on the routes real travelers actually take — with timings, costs, and the mistakes to avoid.',
  Stay:
    'Where you sleep shapes the trip. Ryokan, business hotels, capsule pods, or an Airbnb outside the centre — we break down what each stay type costs, who it suits, and how to book without surprises.',
  Food:
    'Japanese food is a reason to travel on its own. Find the ramen counters, conveyor-belt sushi, and department-store basements worth your yen — plus etiquette and budget realities so you can eat well without overspending.',
  Sights:
    'Temples, gardens, viewpoints, and neighbourhoods worth the detour. These guides prioritise the experiences that actually land, with the practical details — opening hours, last entry, and how to dodge the worst crowds.',
  Etiquette:
    'A little cultural homework goes a long way. From tipping (don’t) to train manners and onsen rules, these notes help you move through Japan confidently and avoid the faux pas that mark you as unprepared.',
  SIM:
    'Stay connected from the moment you land. eSIM vs physical SIM, where to buy, what data you actually need, and how to tether when the hotel Wi-Fi disappoints.',
  Seasons:
    'Japan transforms with the calendar. Cherry blossoms, humid summers, fiery autumn leaves, and snow — each season changes costs, crowds, and what to pack. Plan the timing around the trip you want.',
};

// Real intros for city pages.
export const CITY_INTROS: Record<string, string> = {
  Tokyo:
    'A city that never quite repeats itself. From Shinjuku’s towers to old-school Asakusa, Tokyo rewards planning — these guides cluster neighbourhoods so you waste less time on trains and more on the actual experience.',
  Kyoto:
    'Japan’s cultural heart, best approached by season. Temples, bamboo groves, and geisha districts sit alongside incredible autumn colour — our Kyoto guides focus on routing and timing so the highlights don’t blur together.',
  Osaka:
    'Friendlier, louder, and more food-obsessed than its neighbour. Osaka is the easy city — great street eats, a castle, and day-trip launch points. These notes help you use it as a base, not just a stop.',
  Fukuoka:
    'The gateway to Kyushu and one of Japan’s best food cities. Fukuoka pairs a compact centre with easy island and beach day trips — ideal when you want Japan at a slower pace.',
  Japan:
    'First time, or everywhere at once? These country-level guides cover the arc most travelers follow — what to see, how long, and how to string regions together without backtracking across the map.',
};

export function topicIntro(slug: string): string {
  const label = TOPICS.find((t) => slugify(t) === slug);
  return label ? TOPIC_INTROS[label] : '';
}

export function cityIntro(slug: string): string {
  const label = CITIES.find((c) => slugify(c) === slug);
  return label ? CITY_INTROS[label] : '';
}
