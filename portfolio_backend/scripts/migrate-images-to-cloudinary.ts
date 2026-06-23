import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const FRONTEND_PUBLIC_DIR = path.resolve(__dirname, '../../portfolio_frontend/public');
const APPLY_CHANGES = process.argv.includes('--apply');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

interface Project {
  id: number;
  title: string;
  image_url: string | null;
  gallery_images: string | string[] | null;
}

const stats = {
  found: 0,
  alreadyCloudinary: 0,
  uploaded: 0,
  notFound: 0,
  updated: 0,
  errors: 0,
};

async function uploadToCloudinary(filePath: string, folder: string = 'portfolio'): Promise<string | null> {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      use_filename: true,
      unique_filename: true,
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error);
    stats.errors++;
    return null;
  }
}

function resolveLocalPath(imagePath: string): string | null {
  if (!imagePath || imagePath.startsWith('http') || imagePath.includes('cloudinary.com')) {
    return null;
  }

  // Normalize path: remove leading slash and handle public/
  const normalized = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const fullPath = path.join(FRONTEND_PUBLIC_DIR, normalized);

  if (fs.existsSync(fullPath)) {
    return fullPath;
  }

  return null;
}

async function migrate() {
  console.log(`--- Image Migration to Cloudinary ---`);
  console.log(`Mode: ${APPLY_CHANGES ? 'APPLY' : 'DRY RUN'}`);
  console.log(`Frontend Public Dir: ${FRONTEND_PUBLIC_DIR}\n`);

  try {
    const [projects] = await pool.query<any[]>('SELECT id, title, image_url, gallery_images FROM projects');
    
    for (const project of projects as Project[]) {
      console.log(`Processing project [${project.id}] ${project.title}...`);
      let needsUpdate = false;
      let newImageUrl = project.image_url;
      let newGalleryImages = project.gallery_images;

      if (typeof newGalleryImages === 'string') {
        try {
          newGalleryImages = JSON.parse(newGalleryImages);
        } catch (e) {
          newGalleryImages = [];
        }
      }

      // 1. Handle main image_url
      if (project.image_url) {
        stats.found++;
        if (project.image_url.includes('cloudinary.com')) {
          stats.alreadyCloudinary++;
        } else if (project.image_url.startsWith('http')) {
          console.log(`  - External URL ignored: ${project.image_url}`);
        } else {
          const localPath = resolveLocalPath(project.image_url);
          if (localPath) {
            console.log(`  - Found local image: ${project.image_url}`);
            if (APPLY_CHANGES) {
              const cloudinaryUrl = await uploadToCloudinary(localPath);
              if (cloudinaryUrl) {
                newImageUrl = cloudinaryUrl;
                needsUpdate = true;
                stats.uploaded++;
                console.log(`    Uploaded to: ${cloudinaryUrl}`);
              }
            } else {
              console.log(`    (Would upload ${localPath})`);
              stats.uploaded++;
              needsUpdate = true;
            }
          } else {
            console.log(`  - Local image not found: ${project.image_url}`);
            stats.notFound++;
          }
        }
      }

      // 2. Handle gallery_images
      if (Array.isArray(newGalleryImages) && newGalleryImages.length > 0) {
        const updatedGallery = [];
        let galleryModified = false;

        for (const imgPath of newGalleryImages) {
          stats.found++;
          if (imgPath.includes('cloudinary.com')) {
            stats.alreadyCloudinary++;
            updatedGallery.push(imgPath);
          } else if (imgPath.startsWith('http')) {
            console.log(`  - External gallery URL ignored: ${imgPath}`);
            updatedGallery.push(imgPath);
          } else {
            const localPath = resolveLocalPath(imgPath);
            if (localPath) {
              console.log(`  - Found local gallery image: ${imgPath}`);
              if (APPLY_CHANGES) {
                const cloudinaryUrl = await uploadToCloudinary(localPath);
                if (cloudinaryUrl) {
                  updatedGallery.push(cloudinaryUrl);
                  galleryModified = true;
                  stats.uploaded++;
                  console.log(`    Uploaded to: ${cloudinaryUrl}`);
                } else {
                  updatedGallery.push(imgPath); // Keep old path on error
                }
              } else {
                console.log(`    (Would upload gallery image ${localPath})`);
                stats.uploaded++;
                updatedGallery.push(imgPath);
                galleryModified = true;
              }
            } else {
              console.log(`  - Local gallery image not found: ${imgPath}`);
              stats.notFound++;
              updatedGallery.push(imgPath);
            }
          }
        }

        if (galleryModified) {
          newGalleryImages = updatedGallery;
          needsUpdate = true;
        }
      }

      // 3. Update database
      if (needsUpdate && APPLY_CHANGES) {
        await pool.query(
          'UPDATE projects SET image_url = ?, gallery_images = ? WHERE id = ?',
          [newImageUrl, JSON.stringify(newGalleryImages), project.id]
        );
        stats.updated++;
        console.log(`  ✓ Database updated for ${project.title}`);
      } else if (needsUpdate) {
        console.log(`  (Would update database for ${project.title})`);
        stats.updated++;
      }
    }

    console.log(`\n--- Summary ---`);
    console.log(`Total images found: ${stats.found}`);
    console.log(`Already on Cloudinary: ${stats.alreadyCloudinary}`);
    console.log(`Uploaded (or would be): ${stats.uploaded}`);
    console.log(`Not found locally: ${stats.notFound}`);
    console.log(`Database rows updated (or would be): ${stats.updated}`);
    console.log(`Errors: ${stats.errors}`);

    if (!APPLY_CHANGES) {
      console.log(`\nNote: This was a DRY RUN. No changes were made to the database or Cloudinary.`);
      console.log(`Run with --apply to perform the actual migration.`);
    }

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

migrate();
