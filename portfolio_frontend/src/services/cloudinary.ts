import { env } from "../config/env";

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxFileSizeBytes = 5 * 1024 * 1024;

export type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
};

type CloudinaryUploadResponse = {
  secure_url?: string;
  public_id?: string;
  error?: {
    message?: string;
  };
};

const getCloudinaryConfig = () => {
  const cloudName = env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
  const uploadPreset = env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();

  if (!cloudName || !uploadPreset) {
    throw new Error("Configuration Cloudinary manquante. Renseignez VITE_CLOUDINARY_CLOUD_NAME et VITE_CLOUDINARY_UPLOAD_PRESET.");
  }

  return { cloudName, uploadPreset };
};

const validateImageFile = (file: File) => {
  if (!allowedImageTypes.has(file.type)) {
    throw new Error("Format invalide. Formats acceptés : jpg, jpeg, png, webp.");
  }

  if (file.size > maxFileSizeBytes) {
    throw new Error("Image trop lourde. Taille maximale : 5 Mo.");
  }
};

export const uploadImageToCloudinary = async (file: File): Promise<CloudinaryUploadResult> => {
  validateImageFile(file);

  const { cloudName, uploadPreset } = getCloudinaryConfig();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`, {
    method: "POST",
    body: formData
  });

  let payload: CloudinaryUploadResponse;

  try {
    payload = await response.json() as CloudinaryUploadResponse;
  } catch {
    throw new Error("Réponse Cloudinary illisible.");
  }

  if (!response.ok) {
    throw new Error(payload?.error?.message || "Upload Cloudinary impossible.");
  }

  if (!payload.secure_url || !payload.public_id) {
    throw new Error("Réponse Cloudinary invalide.");
  }

  return {
    secure_url: payload.secure_url,
    public_id: payload.public_id,
  };
};
