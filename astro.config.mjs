import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { links as affiliateLinks } from './src/data/affiliate-links.js';
import articleCtaData from './src/data/homepage/article-cta.json';

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

/**
 * Rehype plugin: replaces CTA placeholder divs with styled CTA HTML.
 * In markdown you write:  <div data-cta="light"></div>  or  <div data-cta="button"></div>
 * The plugin replaces these with CMS-configured CTA content from article-cta.json.
 * This lets article authors insert CTAs at any position without touching code,
 * and all CTA text/URLs are editable via Sveltia CMS.
 */
function rehypeArticleCTAs(options) {
  const lightCta = options.lightCta || {};
  const midCta = options.midCta || {};

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function createLightCtaHtml() {
    const text = escapeHtml(lightCta.text);
    const linkText = escapeHtml(lightCta.link_text);
    const url = escapeHtml(lightCta.url);
    return `<div class="cta-light-hint"><p>${text}</p><a href="${url}" class="cta-light-link" target="_blank" rel="noopener">${linkText}</a></div>`;
  }

  function createButtonCtaHtml() {
    const text = escapeHtml(midCta.text);
    const buttonText = escapeHtml(midCta.button_text);
    const url = escapeHtml(midCta.url);
    return `<div class="cta-button-block"><p>${text}</p><a href="${url}" class="cta-orange-btn" target="_blank" rel="noopener">${buttonText}</a></div>`;
  }

  function walk(node) {
    if (node.children) {
      const newChildren = [];
      for (const child of node.children) {
        // Case 1: CTA placeholder is an element node (if rehype-raw processed it)
        if (child.type === 'element' && child.tagName === 'div') {
          const ctaType = (child.properties && (child.properties.dataCta || child.properties['data-cta'])) || '';
          if (ctaType === 'light') {
            newChildren.push({ type: 'raw', value: createLightCtaHtml() });
            continue;
          }
          if (ctaType === 'button') {
            newChildren.push({ type: 'raw', value: createButtonCtaHtml() });
            continue;
          }
        }
        // Case 2: CTA placeholder is a raw HTML node (Astro passes raw HTML as 'raw' type)
        if (child.type === 'raw' && typeof child.value === 'string') {
          if (child.value.includes('data-cta="light"') || child.value.includes("data-cta='light'")) {
            newChildren.push({ type: 'raw', value: createLightCtaHtml() });
            continue;
          }
          if (child.value.includes('data-cta="button"') || child.value.includes("data-cta='button'")) {
            newChildren.push({ type: 'raw', value: createButtonCtaHtml() });
            continue;
          }
        }
        walk(child);
        newChildren.push(child);
      }
      node.children = newChildren;
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
    rehypePlugins: [
      [rehypeAffiliateLinks, { affiliates: affiliateLinks }],
      [rehypeArticleCTAs, { lightCta: articleCtaData.light_cta, midCta: articleCtaData.mid_cta }],
    ],
  },
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
