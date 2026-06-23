import { useRef } from "react";
import Button from "./ui/Button";
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
          {label} {required && <span className="text-red-600">*</span>}
        </Label>
        <p className="text-xs text-gray-500">Ajoute des images par sélection ou URL. L'ordre affiché ici est celui du carousel.</p>
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

        <Button
          type="button"
          className="bg-gray-900 hover:bg-gray-800"
          onClick={() => inputRef.current?.click()}
        >
          Choisir des images
        </Button>

        <Button
          type="button"
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          onClick={onAddUrl}
        >
          Ajouter une URL
        </Button>
      </div>

      {globalError && <p className="text-red-500 text-xs">{globalError}</p>}

      {images.length > 0 && (
        <div className="space-y-3">
          {images.map((image, index) => (
            <div key={image.id} className="grid grid-cols-1 gap-3 rounded-lg border border-gray-200 p-3 md:grid-cols-[120px_1fr_auto]">
              <div className="aspect-video overflow-hidden rounded-md bg-gray-100">
                <GalleryPreview image={image} />
              </div>

              <div className="flex flex-col gap-1">
                <Input
                  name={`gallery_images.${index}.url`}
                  value={image.url}
                  onChange={(event) => onChangeImage(index, event.target.value)}
                  placeholder="https://res.cloudinary.com/... ou /project-images/..."
                  className={errors[index] ? "border-red-500" : ""}
                />
                {errors[index] && <p className="text-red-500 text-xs">{errors[index]}</p>}
              </div>

              <div className="flex flex-wrap gap-2 md:flex-col">
                <Button
                  type="button"
                  className="bg-gray-100 px-3 py-2 text-gray-700 hover:bg-gray-200"
                  disabled={index === 0}
                  onClick={() => onMoveImage(index, index - 1)}
                >
                  Monter
                </Button>
                <Button
                  type="button"
                  className="bg-gray-100 px-3 py-2 text-gray-700 hover:bg-gray-200"
                  disabled={index === images.length - 1}
                  onClick={() => onMoveImage(index, index + 1)}
                >
                  Descendre
                </Button>
                <Button
                  type="button"
                  className="bg-red-50 px-3 py-2 text-red-700 hover:bg-red-100"
                  onClick={() => onRemoveImage(index)}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryImagesField;
