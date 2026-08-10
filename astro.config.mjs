import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { links as affiliateLinks } from './src/data/affiliate-links.js';
import articleCtaData from './src/data/homepage/article-cta.json';
import sharp from 'sharp';
import { existsSync } from 'fs';
import { join } from 'path';

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
        } else {
          // Link is disabled or missing — render as plain text, remove <a> wrapper
          node.type = 'text';
          node.value = node.children && node.children.length > 0
            ? node.children.map(c => c.value || '').join('')
            : key;
          delete node.properties;
          delete node.tagName;
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

/**
 * Rehype plugin: image optimization for markdown content.
 * 1. Adds loading="lazy" + decoding="async" to all <img> tags
 * 2. Reads actual image dimensions via sharp and adds width/height (prevents CLS)
 * 3. If a .webp version exists, wraps <img> in <picture> with WebP source
 */
function rehypeLazyImages() {
  const dimCache = new Map();
  const webpCache = new Map();

  async function getDimensions(src) {
    if (dimCache.has(src)) return dimCache.get(src);
    let result = null;
    try {
      const filePath = join(process.cwd(), 'public', src.replace(/^\//, ''));
      if (existsSync(filePath)) {
        const metadata = await sharp(filePath).metadata();
        result = { width: metadata.width || 0, height: metadata.height || 0 };
      }
    } catch (e) { /* ignore */ }
    dimCache.set(src, result);
    return result;
  }

  function getWebpSrc(src) {
    if (webpCache.has(src)) return webpCache.get(src);
    let result = null;
    if (typeof src === 'string' && /\.(jpg|jpeg|png)$/i.test(src)) {
      const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      const filePath = join(process.cwd(), 'public', webpSrc.replace(/^\//, ''));
      result = existsSync(filePath) ? webpSrc : null;
    }
    webpCache.set(src, result);
    return result;
  }

  async function walk(node) {
    if (!node.children) return;
    const newChildren = [];
    for (const child of node.children) {
      if (child.type === 'element' && child.tagName === 'img' && child.properties) {
        const src = child.properties.src;
        if (typeof src === 'string' && src.startsWith('/images/')) {
          // 1. Ensure lazy loading + async decoding
          if (!child.properties.loading) child.properties.loading = 'lazy';
          if (!child.properties.decoding) child.properties.decoding = 'async';

          // 2. Add width/height from actual image metadata (CLS fix)
          const dims = await getDimensions(src);
          if (dims && dims.width > 0) {
            child.properties.width = dims.width;
            child.properties.height = dims.height;
          }

          // 3. Wrap in <picture> with WebP source if available
          const webpSrc = getWebpSrc(src);
          if (webpSrc) {
            newChildren.push({
              type: 'element',
              tagName: 'picture',
              properties: {},
              children: [
                {
                  type: 'element',
                  tagName: 'source',
                  properties: { srcset: webpSrc, type: 'image/webp' },
                  children: [],
                },
                child, // original <img> now with width/height
              ],
            });
            continue;
          }
        }
      }
      // Recurse into non-img children
      await walk(child);
      newChildren.push(child);
    }
    node.children = newChildren;
  }

  return async (tree) => {
    await walk(tree);
  };
}

export default defineConfig({
  site: 'https://luneastertravel.com',
  output: 'static',
  trailingSlash: 'never',
  integrations: [mdx()],
  markdown: {
    rehypePlugins: [
      rehypeLazyImages,
      [rehypeAffiliateLinks, { affiliates: affiliateLinks }],
      [rehypeArticleCTAs, { lightCta: articleCtaData.light_cta, midCta: articleCtaData.mid_cta }],
    ],
  },
  build: {
    format: 'file',
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
