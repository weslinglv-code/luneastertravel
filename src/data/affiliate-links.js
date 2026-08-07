// =====================================================
// AFFILIATE LINKS — loads from CMS-managed JSON
// =====================================================
// Data source: src/data/affiliates-data.json (edited via Sveltia CMS)
// Imported by BOTH astro.config.mjs (rehype transform for
// markdown articles) and Astro components.
// Uses process.cwd() for path resolution (works in both Node & Vite).
// =====================================================

import { readFileSync } from 'fs';
import { join } from 'path';

const rawData = readFileSync(join(process.cwd(), 'src/data/affiliates-data.json'), 'utf8');
const affiliatesData = JSON.parse(rawData);

export const links = {};
for (const item of affiliatesData.links) {
  if (item.enabled !== false) {
    links[item.key] = {
      key: item.key,
      label: item.label,
      url: item.url,
      brand: item.brand,
      type: item.type,
      description: item.description,
      icon: item.icon,
    };
  }
}

export const linkCategories = [
  { key: 'transport', label: 'Transport & Passes', icon: 'train' },
  { key: 'hotel', label: 'Hotels & Accommodation', icon: 'bed' },
  { key: 'ticket', label: 'Tickets & Activities', icon: 'ticket' },
  { key: 'tour', label: 'Tours', icon: 'mountain' },
  { key: 'sim', label: 'WiFi & SIM', icon: 'wifi' },
  { key: 'gear', label: 'Travel Essentials', icon: 'plug' },
];
