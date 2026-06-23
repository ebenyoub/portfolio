import type { CorsOptions } from "cors";

export const parseCorsOrigins = (value = "") => value
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const createCorsOptions = (corsOrigin = process.env.CORS_ORIGIN): CorsOptions => {
  const allowedOrigins = parseCorsOrigins(corsOrigin);

  return {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
  };
};
