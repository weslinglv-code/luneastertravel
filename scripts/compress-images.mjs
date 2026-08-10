/**
 * Batch image compression + WebP conversion.
 * Usage: node scripts/compress-images.mjs
 *
 * - Scans public/images/ for .jpg/.jpeg/.png
 * - Resizes to max 1920px width (keeps aspect ratio)
 * - Compresses in-place (overwrites original)
 * - Generates .webp alongside each image
 * - Skips images already small enough (<100KB and already webp)
 */
import sharp from 'sharp';
import { readdir, stat, rename, access } from 'fs/promises';
import { join, extname, basename } from 'path';

const IMAGES_DIR = join(process.cwd(), 'public', 'images');
const MAX_WIDTH = 1920;
const JPEG_QUALITY = 78;
const WEBP_QUALITY = 78;

// Files that are already tiny — skip
const SKIP_THRESHOLD = 100 * 1024; // 100KB

async function fileExists(path) {
  try { await access(path); return true; } catch { return false; }
}

async function processImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  const baseName = basename(filePath, extname(filePath));
  const webpPath = join(IMAGES_DIR, `${baseName}.webp`);

  const beforeStat = await stat(filePath);
  const beforeKB = (beforeStat.size / 1024).toFixed(0);

  // Skip if already small AND webp already exists
  if (beforeStat.size < SKIP_THRESHOLD && await fileExists(webpPath)) {
    return { file: basename(filePath), before: beforeKB, after: beforeKB, webp: 'skip', skipped: true };
  }

  const metadata = await sharp(filePath).metadata();
  const origWidth = metadata.width || 0;
  const resizeWidth = origWidth > MAX_WIDTH ? MAX_WIDTH : null;

  // 1. Compress original (in-place overwrite)
  let pipeline = sharp(filePath, { failOnError: false });
  if (resizeWidth) {
    pipeline = pipeline.resize({ width: resizeWidth, withoutEnlargement: true });
  }

  if (ext === '.jpg' || ext === '.jpeg') {
    await pipeline
      .jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true })
      .toFile(filePath + '.tmp');
  } else if (ext === '.png') {
    await pipeline
      .png({ quality: WEBP_QUALITY, compressionLevel: 9, palette: true })
      .toFile(filePath + '.tmp');
  }

  // Replace original with compressed version
  const { rename: renameFn } = await import('fs/promises');
  await renameFn(filePath + '.tmp', filePath);

  const afterStat = await stat(filePath);
  const afterKB = (afterStat.size / 1024).toFixed(0);

  // 2. Generate WebP version
  let webpPipeline = sharp(filePath, { failOnError: false });
  if (resizeWidth) {
    webpPipeline = webpPipeline.resize({ width: resizeWidth, withoutEnlargement: true });
  }
  await webpPipeline
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toFile(webpPath);

  const webpStat = await stat(webpPath);
  const webpKB = (webpStat.size / 1024).toFixed(0);

  const saving = ((1 - afterStat.size / beforeStat.size) * 100).toFixed(0);

  return {
    file: basename(filePath),
    before: beforeKB,
    after: afterKB,
    webp: webpKB,
    saving: saving + '%',
    width: origWidth + (resizeWidth ? `→${resizeWidth}` : ''),
  };
}

async function main() {
  console.log('Scanning', IMAGES_DIR, '...\n');
  const files = await readdir(IMAGES_DIR);

  const imageFiles = files.filter(f => {
    const ext = extname(f).toLowerCase();
    return ['.jpg', '.jpeg', '.png'].includes(ext);
  });

  console.log(`Found ${imageFiles.length} images to process\n`);

  const results = [];
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of imageFiles) {
    const filePath = join(IMAGES_DIR, file);
    try {
      const beforeStat = await stat(filePath);
      totalBefore += beforeStat.size;

      const result = await processImage(filePath);
      results.push(result);

      const afterStat = await stat(filePath);
      totalAfter += afterStat.size;

      const icon = result.skipped ? '–' : '✓';
      console.log(`${icon} ${result.file.padEnd(50)} ${result.before}KB → ${result.after}KB (WebP: ${result.webp}KB) ${result.saving ? 'saved ' + result.saving : 'skipped'}`);
    } catch (err) {
      console.error(`✗ ${file}: ${err.message}`);
      results.push({ file, error: err.message });
    }
  }

  const totalBeforeMB = (totalBefore / 1024 / 1024).toFixed(1);
  const totalAfterMB = (totalAfter / 1024 / 1024).toFixed(1);
  const totalSaving = ((1 - totalAfter / totalBefore) * 100).toFixed(0);

  console.log(`\n========================================`);
  console.log(`Total: ${totalBeforeMB}MB → ${totalAfterMB}MB (saved ${totalSaving}%)`);
  console.log(`Processed: ${results.length} images`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
