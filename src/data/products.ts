export interface Product {
  order: number;
  slug: string;
  title: string;
  subtitle: string;
  price: number;
  priceLabel: string;
  pages: number;
  description: string;
  features: string[];
  gumroadUrl: string;
  coverImage: string;
  badge?: string;
  accentColor: string;
  // New CMS-managed fields (all optional for backward compatibility)
  destination?: string;
  tripDays?: number;
  transportType?: string;
  photographySpots?: string;
  foodGuideNotes?: string;
  longDescription?: string;
  galleryImages?: string[];
  status?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

// Products are stored as individual JSON files in src/data/products/.
// The Sveltia CMS edits these files directly. To add/remove a product,
// just add/remove a JSON file here — no code changes needed.
const modules = import.meta.glob('./products/*.json', { eager: true }) as Record<
  string,
  { default: Product }
>;

export const products: Product[] = Object.values(modules)
  .map((mod) => mod.default)
  .filter((p) => p.status !== 'draft')
  .sort((a, b) => a.order - b.order);
