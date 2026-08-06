// Re-export from the plain-JS source of truth so that both Astro
// components (TS) and astro.config.mjs (JS) share one data file.
import { links as _links, linkCategories as _cats } from './affiliate-links.js';

export interface AffiliateLink {
  key: string;
  label: string;
  url: string;
  brand: string;
  type: 'ticket' | 'hotel' | 'transport' | 'tour' | 'sim' | 'gear';
  description: string;
  icon: string;
}

export const links: Record<string, AffiliateLink> = _links;
export const linkCategories = _cats;
