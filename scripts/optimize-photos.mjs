import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import path from 'path';

const INPUT_DIR = path.resolve('../Photos-3-001');
const OUTPUT_DIR = path.resolve('./public/photos');
const MAX_DIMENSION = 1024;
const JPEG_QUALITY = 80;

async function optimize() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const files = await readdir(INPUT_DIR);
  const images = files.filter(f =>
    /\.(jpg|jpeg|png)$/i.test(f) && !f.includes('Zone.Identifier')
  );

  for (let i = 0; i < images.length; i++) {
    const inputPath = path.join(INPUT_DIR, images[i]);
    const outputPath = path.join(OUTPUT_DIR, `photo-${i + 1}.jpg`);

    await sharp(inputPath)
      .rotate()
      .resize(MAX_DIMENSION, MAX_DIMENSION, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: JPEG_QUALITY, progressive: true })
      .toFile(outputPath);

    const metadata = await sharp(outputPath).metadata();
    console.log(`${images[i]} -> photo-${i + 1}.jpg (${metadata.width}x${metadata.height})`);
  }
  console.log(`\nDone! ${images.length} photos optimized.`);
}

optimize();
