import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const FRONTEND_PUBLIC_DIR = path.resolve(__dirname, '../../portfolio_frontend/public');
const TARGET_DIR = path.join(FRONTEND_PUBLIC_DIR, 'project-images');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles;
}

async function listUnused() {
  console.log(`--- Listing Unused Local Images ---`);
  console.log(`Scanning directory: ${TARGET_DIR}\n`);

  try {
    if (!fs.existsSync(TARGET_DIR)) {
      console.error(`Error: Directory ${TARGET_DIR} does not exist.`);
      return;
    }

    // 1. Get all image paths from DB
    const [projects] = await pool.query<any[]>('SELECT image_url, gallery_images FROM projects');
    const dbPaths = new Set<string>();

    projects.forEach((project) => {
      if (project.image_url && !project.image_url.startsWith('http')) {
        dbPaths.add(path.normalize(project.image_url.startsWith('/') ? project.image_url.slice(1) : project.image_url));
      }
      
      let gallery = project.gallery_images;
      if (typeof gallery === 'string') {
        try { gallery = JSON.parse(gallery); } catch (e) { gallery = []; }
      }
      if (Array.isArray(gallery)) {
        gallery.forEach((img: string) => {
          if (img && !img.startsWith('http')) {
            dbPaths.add(path.normalize(img.startsWith('/') ? img.slice(1) : img));
          }
        });
      }
    });

    // 2. Scan local files
    const localFiles = getAllFiles(TARGET_DIR);
    const unusedFiles: string[] = [];

    localFiles.forEach((fullPath) => {
      const relativeToPublic = path.relative(FRONTEND_PUBLIC_DIR, fullPath);
      if (!dbPaths.has(path.normalize(relativeToPublic))) {
        unusedFiles.push(relativeToPublic);
      }
    });

    // 3. Output results
    if (unusedFiles.length === 0) {
      console.log(`No unused local images found.`);
    } else {
      console.log(`Found ${unusedFiles.length} unused local images:`);
      unusedFiles.sort().forEach((file) => {
        console.log(`  - ${file}`);
      });
      console.log(`\nNote: These files are not referenced in the database.`);
      console.log(`You can delete them manually after confirming they are truly useless.`);
    }

  } catch (error) {
    console.error('Audit failed:', error);
  } finally {
    await pool.end();
  }
}

listUnused();
