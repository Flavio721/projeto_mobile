import { mkdirSync } from 'node:fs';
import path from 'node:path';

/**
 * Render persistent disks must be mounted outside the application checkout,
 * for example at /var/data. Set UPLOAD_DIR=/var/data/uploads in production.
 */
export const uploadDirectory = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads'));

// Multer and Express static both use this directory; create it on startup so
// a fresh local checkout or an empty persistent disk works on first run.
mkdirSync(uploadDirectory, { recursive: true });
