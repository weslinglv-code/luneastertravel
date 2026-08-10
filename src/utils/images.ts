/**
 * Image optimization utilities for Astro components.
 * Provides WebP path detection + dimension reading via sharp.
 * Usage in .astro frontmatter:
 *   import { getImgInfo } from '../utils/images';
 *   const info = await getImgInfo(coverImage);
 */
import sharp from 'sharp';
import { existsSync } from 'fs';
import { join } from 'path';

const dimCache = new Map<string, { width: number | null; height: number | null; webp: string | null }>();

export async function getImgInfo(src: string | undefined): Promise<{ width: number | null; height: number | null; webp: string | null }> {
  if (!src) return { width: null, height: null, webp: null };
  if (dimCache.has(src)) return dimCache.get(src)!;

  let width: number | null = null;
  let height: number | null = null;
  let webp: string | null = null;

  try {
    const filePath = join(process.cwd(), 'public', src.replace(/^\//, ''));
    if (existsSync(filePath)) {
      const meta = await sharp(filePath).metadata();
      width = meta.width || null;
      height = meta.height || null;
    }
  } catch { /* ignore */ }

  // Check for WebP version
  if (/\.(jpg|jpeg|png)$/i.test(src)) {
    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const webpPath = join(process.cwd(), 'public', webpSrc.replace(/^\//, ''));
    if (existsSync(webpPath)) webp = webpSrc;
  }

  const result = { width, height, webp };
  dimCache.set(src, result);
  return result;
}

/**
 * Batch get image info for an array of src paths.
 */
export async function getImgInfoBatch(srcs: (string | undefined)[]): Promise<{ width: number | null; height: number | null; webp: string | null }[]> {
  return Promise.all(srcs.map(s => getImgInfo(s)));
}
