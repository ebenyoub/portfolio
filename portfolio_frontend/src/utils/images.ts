import { env } from "../config/env";

const apiOrigin = (() => {
  try {
    return new URL(env.VITE_API_URL).origin;
  } catch {
    return "";
  }
})();

export const getImageSrc = (src: string | null | undefined) => {
  if (!src) return "";
  if (src.startsWith("/uploads/")) return `${apiOrigin}${src}`;

  return src;
};
