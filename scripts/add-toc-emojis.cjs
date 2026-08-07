const fs = require('fs');
const path = require('path');
const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');

// H2 title -> emoji mapping for each article
const emojiMap = {
  'tokyo-48-hour-itinerary-weekend-guide.md': {
    'Quick Overview': '📍',
    'Day 1: West Tokyo — Shinjuku, Shibuya & Harajuku': '🗼',
    'Day 2: East Tokyo — Asakusa, Akihabara & Ueno': '🏯',
    'Getting Around Tokyo in 48 Hours': '🚃',
    'Where to Stay for a 48-Hour Tokyo Trip': '🏨',
    'Want More Than 48 Hours?': '💡',
    '48-Hour Tokyo Itinerary Summary': '✅',
  },
  'osaka-travel-guide-48-hours.md': {
    'Quick Overview': '📍',
    'Day 1: South Osaka — Street Food Paradise': '🍜',
    'Day 2: North Osaka — Castles & Skylines': '🏯',
    'Osaka Food: The Must-Eat List': '🍱',
    'Getting Around Osaka': '🚃',
    'Where to Stay in Osaka': '🏨',
    'Osaka vs. Tokyo vs. Kyoto': '⚖️',
    'FAQ': '❓',
  },
  'kyoto-day-trip-from-tokyo.md': {
    'The Math: Tokyo to Kyoto Day Trip': '🧮',
    'The One-Day Kyoto Itinerary': '🗺️',
    "When a Day Trip Makes Sense (and When It Doesn't)": '🤔',
    'Getting a JR Pass': '🚄',
    'Kyoto Beyond a Day Trip': '⛩️',
    'Day Trip Packing List': '🎒',
  },
  'japan-travel-budget-2026.md': {
    'The Quick Answer: Three Budget Tiers': '💰',
    '1. Flights: $400–$1,200 Round Trip': '✈️',
    '2. Accommodation: ¥3,000–¥25,000/night': '🏨',
    '3. Food: ¥1,000–¥8,000/day': '🍜',
    '4. Transportation: ¥1,000–¥5,000/day': '🚃',
    '5. Activities & Attractions: ¥500–¥3,000 each': '🎫',
    'Sample 7-Day Budget Breakdown': '📊',
    '5 Ways to Save Money in Japan': '💡',
    'Get the Full Budget Planner': '📋',
    'FAQ': '❓',
  },
  'japan-train-travel-guide.md': {
    'The 30-Second Summary': '⏱️',
    'The JR Pass: Is It Worth It in 2026?': '🚄',
    'The Shinkansen: Everything You Need to Know': '🔅',
    'IC Cards: Tap-and-Pay for Local Transit': '💳',
    'Navigating Japanese Train Stations': '🧭',
    'Day Trips by Train': '🗺️',
    'Common Mistakes to Avoid': '⚠️',
    'FAQ': '❓',
  },
  'japan-packing-list-2026.md': {
    'The 10-Second Summary': '⏱️',
    'Electronics: The Non-Negotiables': '🔌',
    'Clothing: Pack for Walking, Not for Photos': '👕',
    'Documents & Money': '📑',
    'Toiletries: What to Bring vs. What to Buy': '🧴',
    'The Daypack: What to Carry Daily': '🎒',
    'Packing Checklist (Printable)': '📋',
    'What Not to Bring': '❌',
    'FAQ': '❓',
  },
  'best-time-to-visit-japan.md': {
    'The 30-Second Answer': '⏱️',
    'Spring (March–May): Cherry Blossom Season': '🌸',
    'Summer (June–August): Festivals & Fireworks': '🎆',
    'Autumn (September–November): Fall Foliage': '🍁',
    'Winter (December–February): Snow & Hot Springs': '⛄',
    'Month-by-Month Summary Table': '📅',
    'When to Book Flights': '✈️',
    'JR Pass: Does Timing Matter?': '🚄',
    'FAQ': '❓',
  },
  '7-day-japan-itinerary-first-timers.md': {
    'Quick Overview: The Golden Route': '📍',
    'Day 1-3: Tokyo — The Sensory Overload': '🗼',
    'Transport: The JR Pass Question': '🚄',
    'Day 4: Mount Fuji & Hakone': '🗻',
    'Day 5-6: Kyoto — The Spiritual Heart': '⛩️',
    'Day 7: Osaka — Eat Your Way Out': '🍜',
    'Budget Breakdown': '💰',
    'Want the Full Version?': '📋',
  },
};

let totalReplaced = 0;
for (const [filename, headings] of Object.entries(emojiMap)) {
  const filePath = path.join(blogDir, filename);
  if (!fs.existsSync(filePath)) {
    console.log('SKIP (not found):', filename);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;
  for (const [title, emoji] of Object.entries(headings)) {
    const oldLine = '## ' + title;
    const newLine = '## ' + emoji + ' ' + title;
    if (content.includes(oldLine) && !content.includes(newLine)) {
      content = content.replace(oldLine, newLine);
      count++;
    }
  }
  if (count > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(filename + ': ' + count + ' H2 headings updated');
    totalReplaced += count;
  }
}
console.log('---');
console.log('Total: ' + totalReplaced + ' H2 headings updated across all articles');
