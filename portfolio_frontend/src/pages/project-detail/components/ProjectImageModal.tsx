import { getImageSrc } from "../../../utils/images";
import type { ProjectImage } from "../utils/projectImages";

type ProjectImageModalProps = {
  image: ProjectImage | null;
  imageIndex: number | null;
  imageCount: number;
  hasCarousel: boolean;
  onClose: () => void;
  onPreviousImage: () => void;
  onNextImage: () => void;
};

const ProjectImageModal = ({
  image,
  imageIndex,
  imageCount,
  hasCarousel,
  onClose,
  onPreviousImage,
  onNextImage,
}: ProjectImageModalProps) => {
  if (!image) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`Aperçu de ${image.alt}`}
      onClick={onClose}
    >
      <div className="relative w-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl font-bold text-gray-900 shadow-md transition-colors hover:bg-gray-100"
          aria-label="Fermer l'image"
        >
          ×
        </button>

        {hasCarousel && (
          <>
            <button
              type="button"
              onClick={onPreviousImage}
              className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-3xl font-bold text-gray-900 shadow-md transition-colors hover:bg-white"
              aria-label="Image précédente"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={onNextImage}
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-3xl font-bold text-gray-900 shadow-md transition-colors hover:bg-white"
              aria-label="Image suivante"
            >
              ›
            </button>
          </>
        )}

        <img
          src={getImageSrc(image.src)}
          alt={image.alt}
          className="max-h-[82vh] w-full rounded-lg object-contain shadow-2xl"
        />

        {hasCarousel && imageIndex !== null && (
          <p className="mt-3 text-center text-sm font-medium text-white/80">
            {imageIndex + 1} / {imageCount}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectImageModal;
