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

export const uploadImageToCloudinary = async (
  file: File,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> => {
  validateImageFile(file);

  const { cloudName, uploadPreset } = getCloudinaryConfig();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`, true);

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      let payload: CloudinaryUploadResponse;
      try {
        payload = JSON.parse(xhr.responseText) as CloudinaryUploadResponse;
      } catch {
        return reject(new Error("Réponse Cloudinary illisible."));
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        if (payload.secure_url && payload.public_id) {
          resolve({
            secure_url: payload.secure_url,
            public_id: payload.public_id,
          });
        } else {
          reject(new Error("Réponse Cloudinary invalide."));
        }
      } else {
        reject(new Error(payload?.error?.message || `Upload Cloudinary impossible (Status ${xhr.status}).`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Erreur réseau lors de l'upload Cloudinary."));
    };

    xhr.send(formData);
  });
};
