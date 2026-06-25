import { useEffect, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Github, X } from "lucide-react";
import type { Project } from "../types/project";
import { getImageSrc } from "../utils/images";
import { parseDisplaySettings, parseJsonArray } from "../utils/project";
import {
  getProjectBulletList,
  getProjectCategory,
  getProjectTechnologies,
} from "../utils/projectPresentation";
import {
  getNextIndex,
  getPreviousIndex,
  getProjectImages,
} from "../pages/project-detail/utils/projectImages";

type ProjectCaseStudyModalProps = {
  project: Project | null;
  onClose: () => void;
};

function CaseStudyBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-[#1E1E1E] bg-[#0F0F0F] p-4">
      <h4 className="mb-3 text-xs font-mono uppercase tracking-widest text-[#A1A1AA]">{title}</h4>
      {children}
    </div>
  );
}

function ProjectCaseStudyContent({
  project,
  onClose,
}: {
  project: Project;
  onClose?: () => void;
}) {
  const displaySettings = parseDisplaySettings(project.display_settings, project);
  const projectImages = getProjectImages(project, displaySettings);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const hasCarousel = displaySettings.show_gallery && projectImages.length > 1;
  const activeImage = projectImages[activeImageIndex] ?? projectImages[0];
  const heroImage = activeImage?.src ?? project.image_url ?? null;
  const category = getProjectCategory(project);
  const technologies = getProjectTechnologies(project);
  const objectives = getProjectBulletList(project.objective);
  const challenges = getProjectBulletList(project.challenges);
  const solutions = getProjectBulletList(project.solution);
  const learnedSkills = parseJsonArray(project.learned_skills);

  return (
    <>
      <div className="relative h-52 flex-shrink-0 overflow-hidden bg-[#1A1A1A]">
        {heroImage ? (
          <img
            src={getImageSrc(heroImage)}
            alt={activeImage?.alt ?? project.title}
            className="h-full w-full object-cover opacity-75"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#111111] px-6 text-center text-lg font-bold text-white opacity-50">
            {project.title}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/35 to-transparent" />

        {hasCarousel && (
          <>
            <button
              type="button"
              onClick={() => setActiveImageIndex((current) => getPreviousIndex(current, projectImages.length))}
              className="absolute left-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg border border-[#262626] bg-[#1A1A1A]/90 text-[#A1A1AA] transition-colors hover:text-white"
              aria-label="Image précédente"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => setActiveImageIndex((current) => getNextIndex(current, projectImages.length))}
              className="absolute right-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg border border-[#262626] bg-[#1A1A1A]/90 text-[#A1A1AA] transition-colors hover:text-white"
              aria-label="Image suivante"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-4 right-4 rounded-md border border-[#262626] bg-[#0A0A0A]/80 px-2.5 py-1 text-[11px] font-mono text-[#D4D4D8]">
              {activeImageIndex + 1} / {projectImages.length}
            </div>
          </>
        )}

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg border border-[#262626] bg-[#1A1A1A] text-[#A1A1AA] transition-all hover:border-[#404040] hover:text-white"
            aria-label="Fermer le projet"
          >
            <X size={15} />
          </button>
        )}

        <div className="absolute bottom-5 left-6 right-16">
          <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-widest text-[#3B82F6]">
            {category}
          </span>
          <h2
            className="text-xl font-bold tracking-tight text-white"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            {project.title}
          </h2>
        </div>
      </div>

      <div className="flex-1 space-y-7 overflow-y-auto p-6">
        {technologies.length > 0 && (
          <div>
            <h4 className="mb-3 text-xs font-mono uppercase tracking-widest text-[#A1A1AA]">
              Stack technique
            </h4>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-2.5 py-1 text-xs font-mono text-[#93C5FD]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {hasCarousel && (
          <div>
            <h4 className="mb-3 text-xs font-mono uppercase tracking-widest text-[#A1A1AA]">
              Carousel projet
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {projectImages.map((image, index) => (
                <button
                  type="button"
                  key={`${image.src}-${index}`}
                  onClick={() => setActiveImageIndex(index)}
                  className={`aspect-video overflow-hidden rounded-lg border bg-[#111111] transition ${
                    index === activeImageIndex
                      ? "border-[#3B82F6] opacity-100"
                      : "border-[#262626] opacity-45 hover:opacity-100"
                  }`}
                  aria-label={`Afficher l'image ${index + 1}`}
                >
                  <img src={getImageSrc(image.src)} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {project.description && (
          <CaseStudyBlock title="Presentation">
            <p className="text-sm leading-relaxed text-[#A1A1AA]">{project.description}</p>
          </CaseStudyBlock>
        )}

        {project.context && (
          <CaseStudyBlock title="Contexte">
            <p className="text-sm leading-relaxed text-[#A1A1AA]">{project.context}</p>
          </CaseStudyBlock>
        )}

        {objectives.length > 0 && (
          <CaseStudyBlock title="Objectifs">
            <ul className="space-y-2">
              {objectives.map((objective) => (
                <li key={objective} className="flex items-start gap-2.5 text-sm text-[#A1A1AA]">
                  <span className="mt-0.5 flex-shrink-0 text-[#3B82F6]">▸</span>
                  {objective}
                </li>
              ))}
            </ul>
          </CaseStudyBlock>
        )}

        {(challenges.length > 0 || solutions.length > 0) && (
          <div className="grid gap-4 md:grid-cols-2">
            {challenges.length > 0 && (
              <CaseStudyBlock title="Difficultes">
                <ul className="space-y-2">
                  {challenges.map((challenge) => (
                    <li key={challenge} className="flex items-start gap-2.5 text-sm text-[#A1A1AA]">
                      <span className="mt-0.5 flex-shrink-0 text-[#F59E0B]">▸</span>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </CaseStudyBlock>
            )}

            {solutions.length > 0 && (
              <CaseStudyBlock title="Solutions">
                <ul className="space-y-2">
                  {solutions.map((solution) => (
                    <li key={solution} className="flex items-start gap-2.5 text-sm text-[#A1A1AA]">
                      <span className="mt-0.5 flex-shrink-0 text-[#10B981]">▸</span>
                      {solution}
                    </li>
                  ))}
                </ul>
              </CaseStudyBlock>
            )}
          </div>
        )}

        {learnedSkills.length > 0 && (
          <CaseStudyBlock title="Appris">
            <ul className="space-y-2">
              {learnedSkills.map((skill) => (
                <li key={skill} className="flex items-start gap-2.5 text-sm text-[#A1A1AA]">
                  <span className="mt-0.5 flex-shrink-0 text-[#8B5CF6]">▸</span>
                  {skill}
                </li>
              ))}
            </ul>
          </CaseStudyBlock>
        )}

        <div className="flex gap-3 pb-1 pt-2">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-[#262626] px-4 py-2.5 text-sm font-medium text-white transition-all hover:border-[#363636] hover:bg-[#1A1A1A]"
            >
              <Github size={15} />
              Code source
            </a>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="ml-auto px-4 py-2.5 text-sm text-[#A1A1AA] transition-colors hover:text-white"
            >
              Fermer
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export function ProjectCaseStudyPanel({ project, onClose }: { project: Project; onClose?: () => void }) {
  return (
    <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#262626] bg-[#111111] shadow-2xl">
      <ProjectCaseStudyContent key={project.id} project={project} onClose={onClose} />
    </div>
  );
}

export default function ProjectCaseStudyModal({
  project,
  onClose,
}: ProjectCaseStudyModalProps) {
  useEffect(() => {
    if (!project) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [project]);

  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Fermer la modale du projet"
      />
      <div
        className="relative flex min-h-full items-center justify-center p-4 pointer-events-none md:p-6"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Apercu du projet ${project.title}`}
          className="pointer-events-auto"
        >
          <ProjectCaseStudyPanel project={project} onClose={onClose} />
        </div>
      </div>
    </div>
  );
}
