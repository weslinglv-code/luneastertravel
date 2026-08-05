import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { links as affiliateLinks } from './src/data/affiliate-links.js';

/**
 * Rehype plugin: turns markdown affiliate shortcodes into real links.
 * In an article you write:  [7-Day JR Pass](#aff:klook_jrpass)
 * This plugin rewrites the href to the real affiliate URL (with aid=...),
 * adds rel="sponsored nofollow noopener" and target="_blank".
 * This keeps articles as clean plain Markdown — no MDX/components needed,
 * which makes them editable in the Sveltia CMS rich-text editor.
 */
function rehypeAffiliateLinks(options) {
  const affiliates = options.affiliates || {};
  function walk(node) {
    if (node.type === 'element' && node.tagName === 'a') {
      const href = node.properties && node.properties.href;
      if (typeof href === 'string' && href.startsWith('#aff:')) {
        const key = href.slice(5);
        const aff = affiliates[key];
        if (aff) {
          node.properties.href = aff.url;
          node.properties.target = '_blank';
          node.properties.rel = 'sponsored nofollow noopener';
        }
      }
    }
    if (node.children) {
      for (const child of node.children) walk(child);
    }
  }
  return (tree) => {
    walk(tree);
  };
}

export default defineConfig({
  site: 'https://luneastertravel.com',
  output: 'static',
  integrations: [mdx()],
  markdown: {
    rehypePlugins: [[rehypeAffiliateLinks, { affiliates: affiliateLinks }]],
  },
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
