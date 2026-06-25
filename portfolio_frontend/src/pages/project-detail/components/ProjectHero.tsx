import { Github, ExternalLink } from "lucide-react";
import type { Project } from "../../../types/project";
import { getImageSrc } from "../../../utils/images";
import type { ProjectImage } from "../utils/projectImages";

type ProjectHeroProps = {
  project: Project;
  technologies: string[];
  projectImages: ProjectImage[];
  activeImageIndex: number;
  hasCarousel: boolean;
  showMediaSection: boolean;
  onPreviousImage: () => void;
  onNextImage: () => void;
  onSelectImage: (index: number) => void;
  onOpenImage: (index: number) => void;
};

const ProjectHero = ({
  project,
  technologies,
  projectImages,
  activeImageIndex,
  hasCarousel,
  showMediaSection,
  onPreviousImage,
  onNextImage,
  onSelectImage,
  onOpenImage,
}: ProjectHeroProps) => {
  const activeImage = projectImages[activeImageIndex] ?? projectImages[0];
  const imageFitClass = "object-cover";

  return (
    <div className={showMediaSection ? "grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-center bg-[#0A0A0A] text-white p-2" : "max-w-3xl bg-[#0A0A0A] text-white"}>
      <div>
        <span className="text-[10px] font-mono text-[#3B82F6] tracking-widest uppercase mb-1.5 block">
          Détail du projet
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-5" style={{ fontFamily: "Manrope, sans-serif" }}>
          {project.title}
        </h1>

        <div className="flex flex-wrap gap-2 mb-8">
          {technologies.map((tech) => (
            <span key={tech} className="text-xs font-mono px-2.5 py-1 rounded-md border border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#93C5FD]">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm border border-[#262626] text-white px-5 py-2.5 rounded-lg hover:bg-[#1A1A1A] hover:border-[#363636] transition-all font-medium"
            >
              <Github size={16} />
              Code source
            </a>
          )}

          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm bg-[#3B82F6] text-white px-5 py-2.5 rounded-lg hover:bg-[#2563EB] transition-colors font-medium"
            >
              <ExternalLink size={16} />
              Démo Live
            </a>
          )}
        </div>
      </div>

      {showMediaSection && (
        <div className="space-y-3">
          {activeImage ? (
            <>
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-[#262626] bg-[#111111] shadow-2xl">
                <button
                  type="button"
                  onClick={() => onOpenImage(activeImageIndex)}
                  className="group block h-full w-full cursor-zoom-in"
                  aria-label={`Agrandir ${activeImage.alt}`}
                >
                  <img src={getImageSrc(activeImage.src)} alt={activeImage.alt} className={`h-full w-full opacity-80 hover:opacity-95 transition-opacity duration-300 ${imageFitClass}`} />
                  <span className="absolute bottom-3 right-3 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    Agrandir
                  </span>
                </button>

                {hasCarousel && (
                  <>
                    <button
                      type="button"
                      onClick={onPreviousImage}
                      className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg border border-[#262626] bg-[#1A1A1A] text-lg font-bold text-[#A1A1AA] hover:text-white shadow-md transition-colors"
                      aria-label="Image précédente"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={onNextImage}
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg border border-[#262626] bg-[#1A1A1A] text-lg font-bold text-[#A1A1AA] hover:text-white shadow-md transition-colors"
                      aria-label="Image suivante"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {hasCarousel && (
                <div className="grid grid-cols-4 gap-2">
                  {projectImages.map((image, index) => (
                    <button
                      type="button"
                      key={image.src}
                      onClick={() => onSelectImage(index)}
                      className={`aspect-video overflow-hidden rounded-lg border bg-[#111111] transition ${
                        index === activeImageIndex
                          ? "border-[#3B82F6] opacity-100"
                          : "border-[#262626] opacity-40 hover:opacity-100"
                      }`}
                      aria-label={`Afficher l'image ${index + 1}`}
                    >
                      <img src={getImageSrc(image.src)} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-[#262626] bg-gradient-to-br from-blue-900 to-indigo-950 text-2xl font-bold text-white shadow-sm opacity-40">
              {project.title}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectHero;
