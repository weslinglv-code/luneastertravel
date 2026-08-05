// Homepage section data loader
// Each section's content is stored as a JSON file edited via Sveltia CMS.
// The frontend reads these files at build time — zero hardcoded text/images/URLs.

import heroData from './hero.json';
import advantagesData from './advantages.json';
import blogSectionData from './blog-section.json';
import premiumSectionData from './premium-section.json';
import ctaData from './cta.json';
import footerData from './footer.json';
import navigationData from './navigation.json';
import sectionsData from './sections.json';

export const hero = heroData;
export const advantages = advantagesData;
export const blogSection = blogSectionData;
export const premiumSection = premiumSectionData;
export const cta = ctaData;
export const footer = footerData;
export const navigation = navigationData;

// Module ordering & visibility
export interface SectionConfig {
  id: string;
  label: string;
  visible: boolean;
  order: number;
}

export const sections: SectionConfig[] = (sectionsData.modules as SectionConfig[])
  .sort((a, b) => a.order - b.order);

export function isSectionVisible(id: string): boolean {
  const s = sections.find((m) => m.id === id);
  return s ? s.visible : true;
}
