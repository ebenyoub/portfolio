import { useRef } from "react";
import Input, { Label } from "./ui/Input";
import { getImageSrc } from "../utils/images";
import type { GalleryImageFormValue } from "../types/project";

type GalleryField = GalleryImageFormValue & {
  id: string;
};

type GalleryImagesFieldProps = {
  label: string;
  required?: boolean;
  images: GalleryField[];
  errors?: (string | undefined)[];
  globalError?: string;
  onAddUrl: () => void;
  onAppendFiles: (files: File[]) => void;
  onChangeImage: (index: number, value: string) => void;
  onRemoveImage: (index: number) => void;
  onMoveImage: (from: number, to: number) => void;
};

const GalleryPreview = ({ image }: { image: GalleryField }) => {
  const previewSrc = image.previewUrl || getImageSrc(image.url);

  if (!previewSrc) {
    return (
      <div className="flex h-full w-full items-center justify-center text-xs font-medium text-gray-400">
        Image
      </div>
    );
  }

  return <img src={previewSrc} alt="" className="h-full w-full object-cover" />;
};

const GalleryImagesField = ({
  label,
  required = false,
  images,
  errors = [],
  globalError,
  onAddUrl,
  onAppendFiles,
  onChangeImage,
  onRemoveImage,
  onMoveImage,
}: GalleryImagesFieldProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selectFiles = (files: FileList) => {
    onAppendFiles(Array.from(files));

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <Label>
          {label} {required && <span className="text-red-400">*</span>}
        </Label>
        <p className="text-xs font-mono text-[#4B4B4B]">Ajoute des images par sélection ou URL. L'ordre affiché ici est celui du carousel.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          ref={inputRef}
          type="file"
          multiple
          aria-label="Sélectionner les images du carousel"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => {
            const files = event.target.files;
            if (files && files.length > 0) {
              selectFiles(files);
            }
          }}
        />

        <button
          type="button"
          className="bg-[#262626] border border-[#363636] hover:bg-[#363636] text-white rounded-lg px-4 py-2 text-xs font-mono font-semibold transition-colors cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          Choisir des images
        </button>

        <button
          type="button"
          className="bg-[#111111] border border-[#262626] hover:bg-[#1A1A1A] text-white rounded-lg px-4 py-2 text-xs font-mono font-semibold transition-colors cursor-pointer"
          onClick={onAddUrl}
        >
          Ajouter une URL
        </button>
      </div>

      {globalError && <p className="text-red-400 text-xs font-mono">{globalError}</p>}

      {images.length > 0 && (
        <div className="space-y-3">
          {images.map((image, index) => (
            <div key={image.id} className="grid grid-cols-1 gap-3 rounded-lg border border-[#262626] p-3 md:grid-cols-[120px_1fr_auto] items-center bg-[#111111]">
              <div className="aspect-video overflow-hidden rounded-md bg-[#0A0A0A] border border-[#262626]">
                <GalleryPreview image={image} />
              </div>

              <div className="flex flex-col gap-1">
                <Input
                  name={`gallery_images.${index}.url`}
                  value={image.url}
                  onChange={(event) => onChangeImage(index, event.target.value)}
                  placeholder="https://res.cloudinary.com/... ou /project-images/..."
                  className={errors[index] ? "border-red-500/50" : ""}
                />
                {errors[index] && <p className="text-red-400 text-xs font-mono">{errors[index]}</p>}
              </div>

              <div className="flex flex-wrap gap-2 md:flex-row items-center">
                <button
                  type="button"
                  className="bg-[#262626] border border-[#363636] hover:bg-[#363636] text-white text-xs font-mono px-3 py-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  disabled={index === 0}
                  onClick={() => onMoveImage(index, index - 1)}
                >
                  Monter
                </button>
                <button
                  type="button"
                  className="bg-[#262626] border border-[#363636] hover:bg-[#363636] text-white text-xs font-mono px-3 py-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  disabled={index === images.length - 1}
                  onClick={() => onMoveImage(index, index + 1)}
                >
                  Descendre
                </button>
                <button
                  type="button"
                  className="bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-mono px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  onClick={() => onRemoveImage(index)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryImagesField;
