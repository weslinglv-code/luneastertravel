// =====================================================
// AFFILIATE LINKS — single source of truth (plain JS)
// =====================================================
// Imported by BOTH astro.config.mjs (rehype transform for
// markdown articles) and Astro components. Update IDs here
// and every link across the site updates automatically.
// =====================================================

export const links = {
  // --- Klook (tickets, activities, transport) ---
  klook_jrpass: {
    key: 'klook_jrpass',
    label: 'JR Pass (7-day)',
    url: 'https://www.klook.com/activity/1706-jr-pass-japan/?aid=129901',
    brand: 'Klook',
    type: 'transport',
    description: 'Unlimited Shinkansen travel for 7 days. Must buy before arriving in Japan.',
    icon: 'train',
  },
  klook_pocket_wifi: {
    key: 'klook_pocket_wifi',
    label: 'Pocket WiFi (Japan)',
    url: 'https://www.klook.com/activity/2118-japan-wifi-router/?aid=129901',
    brand: 'Klook',
    type: 'sim',
    description: 'Unlimited 4G WiFi for your entire trip. Pick up at airport.',
    icon: 'wifi',
  },
  klook_tokyo_disney: {
    key: 'klook_tokyo_disney',
    label: 'Tokyo DisneySea Tickets',
    url: 'https://www.klook.com/activity/1758-tokyo-disneysea/?aid=129901',
    brand: 'Klook',
    type: 'ticket',
    description: 'Skip the line — book in advance and save time.',
    icon: 'ticket',
  },
  klook_mt_fuji: {
    key: 'klook_mt_fuji',
    label: 'Mt. Fuji Day Trip from Tokyo',
    url: 'https://www.klook.com/activity/1708-mount-fuji-day-trip/?aid=129901',
    brand: 'Klook',
    type: 'tour',
    description: 'Bus tour from Shinjuku. Includes Lake Ashi cruise.',
    icon: 'mountain',
  },

  // --- Booking.com (hotels) ---
  booking_tokyo_shinjuku: {
    key: 'booking_tokyo_shinjuku',
    label: 'Hotels in Shinjuku',
    url: 'https://www.booking.com/region/jp/tokyo.html?aid=YOUR_AFFILIATE_ID&district=shinjuku',
    brand: 'Booking.com',
    type: 'hotel',
    description: 'Best area for first-timers. Walking distance to Shinjuku Station.',
    icon: 'bed',
  },
  booking_kyoto: {
    key: 'booking_kyoto',
    label: 'Hotels in Kyoto',
    url: 'https://www.booking.com/city/jp/kyoto.html?aid=YOUR_AFFILIATE_ID',
    brand: 'Booking.com',
    type: 'hotel',
    description: 'Stay near Kyoto Station or Gion for easy access.',
    icon: 'bed',
  },
  booking_osaka: {
    key: 'booking_osaka',
    label: 'Hotels in Osaka',
    url: 'https://www.booking.com/city/jp/osaka.html?aid=YOUR_AFFILIATE_ID',
    brand: 'Booking.com',
    type: 'hotel',
    description: 'Namba and Umeda are the best areas for tourists.',
    icon: 'bed',
  },

  // --- Travelpayouts (flights, multi-platform) ---
  tp_flights: {
    key: 'tp_flights',
    label: 'Find Cheap Flights to Japan',
    url: 'https://tp.media/r?marker=YOUR_AFFILIATE_ID&trs=200916&p=4114&u=',
    brand: 'Aviasales',
    type: 'transport',
    description: 'Compare flight prices across all airlines. Set price alerts.',
    icon: 'plane',
  },

  // --- Amazon Associates (gear) ---
  amazon_travel_adapter: {
    key: 'amazon_travel_adapter',
    label: 'Japan Travel Adapter (Type A/B)',
    url: 'https://www.amazon.com/dp/B0XXXXXX?tag=YOUR_AFFILIATE_ID',
    brand: 'Amazon',
    type: 'insurance',
    description: 'Japan uses Type A plugs. Make sure your devices work.',
    icon: 'plug',
  },
};

export const linkCategories = [
  { key: 'transport', label: 'Transport & Passes', icon: 'train' },
  { key: 'hotel', label: 'Hotels & Accommodation', icon: 'bed' },
  { key: 'ticket', label: 'Tickets & Activities', icon: 'ticket' },
  { key: 'tour', label: 'Tours', icon: 'mountain' },
  { key: 'sim', label: 'WiFi & SIM', icon: 'wifi' },
  { key: 'insurance', label: 'Travel Essentials', icon: 'plug' },
];
