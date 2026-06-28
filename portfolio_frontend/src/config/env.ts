import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().min(1),
  VITE_CLOUDINARY_CLOUD_NAME: z.string().optional(),
  VITE_CLOUDINARY_UPLOAD_PRESET: z.string().optional(),
});

const envParsed = envSchema.safeParse(import.meta.env);

if (!envParsed.success) {
  console.error('❌ Invalid environment variables:', envParsed.error.flatten().fieldErrors);
}

export const env = envParsed.data || {
  VITE_API_URL: '/api',
  VITE_CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  VITE_CLOUDINARY_UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
};
