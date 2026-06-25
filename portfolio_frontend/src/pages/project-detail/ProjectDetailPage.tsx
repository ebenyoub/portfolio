import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Github, ExternalLink, ShieldAlert, CheckCircle2, Award, Grid, Layers, Eye, ChevronLeft, ChevronRight, X } from "lucide-react";
import useFetch from "../../hooks/apiFetch";
import type { Project } from "../../types/project";
import { getImageSrc } from "../../utils/images";
import { parseDisplaySettings, parseJsonArray } from "../../utils/project";
import {
  getProjectBulletList,
  getProjectCategory,
  getProjectTechnologies,
} from "../../utils/projectPresentation";
import { getProjectImages, getPreviousIndex, getNextIndex } from "./utils/projectImages";

const ProjectDetailPage = () => {
  const { apiFetch, isLoading } = useFetch();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFetch(`/projects/${id}`);
        setProject(response.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          toast.error(err.message);
        }
      }
    };

    if (id) {
      void fetchData();
    }
  }, [apiFetch, id]);

  // SEO Update
  useEffect(() => {
    if (project) {
      document.title = `${project.title} — Elyas Benyoub`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          project.description || `Étude de cas détaillée pour le projet ${project.title}.`
        );
      }
    }
  }, [project]);

  if (isLoading && !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-6 py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3B82F6] border-t-transparent"></div>
          <p className="text-sm font-mono text-[#A1A1AA] animate-pulse">Chargement de l'étude de cas...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] px-6 py-20 text-center">
        <h2 className="mb-4 text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "Manrope, sans-serif" }}>
          Projet non trouvé
        </h2>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 rounded-lg border border-[#262626] bg-[#111111] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:border-[#3B82F6]/50 hover:text-[#3B82F6]"
        >
          <ArrowLeft size={15} />
          Retour aux projets
        </Link>
      </div>
    );
  }

  const displaySettings = parseDisplaySettings(project.display_settings, project);
  const projectImages = getProjectImages(project, displaySettings);
  const hasCarousel = displaySettings.show_gallery && projectImages.length > 0;
  const activeImage = projectImages[activeImageIndex] ?? projectImages[0];
  const heroImage = activeImage?.src ?? project.image_url ?? null;
  const category = getProjectCategory(project);
  const technologies = getProjectTechnologies(project);
  const objectives = getProjectBulletList(project.objective);
  const challenges = getProjectBulletList(project.challenges);
  const solutions = getProjectBulletList(project.solution);
  const learnedSkills = parseJsonArray(project.learned_skills);

  return (
    <article className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#3B82F6]/30 selection:text-white pb-24">
      {/* Spacious Container */}
      <div className="mx-auto max-w-5xl px-6 pt-24 space-y-8">
        {/* Breadcrumb Back Link */}
        <div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#A1A1AA] hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Retour aux projets
          </Link>
        </div>
        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Content Areas */}
          <div className="lg:col-span-2 space-y-10">
            {/* Title & Metadata */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#3B82F6]/20 bg-[#3B82F6]/5 text-xs font-mono text-[#3B82F6] uppercase tracking-wider">
                {category}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight" style={{ fontFamily: "Manrope, sans-serif" }}>
                {project.title}
              </h1>
              {project.description && (
                <p className="text-base text-[#A1A1AA] leading-relaxed font-light">
                  {project.description}
                </p>
              )}
            </div>

            {/* Premium Interactive Hero Showcase Image */}
            <div className="relative aspect-video rounded-2xl border border-[#262626] bg-[#111111] overflow-hidden group shadow-lg flex items-center justify-center">
              {heroImage && (
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-10 blur-xl scale-110 pointer-events-none select-none"
                  style={{ backgroundImage: `url(${getImageSrc(heroImage)})` }}
                />
              )}
              {heroImage ? (
                <>
                  <img
                    src={getImageSrc(heroImage)}
                    alt={activeImage?.alt ?? project.title}
                    className="relative z-10 max-h-full max-w-full object-contain opacity-90 group-hover:opacity-100 group-hover:scale-[1.01] transition-all duration-500 select-none cursor-zoom-in"
                    onClick={() => setIsZoomed(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/50 via-transparent to-transparent z-10 pointer-events-none" />
                  <button
                    onClick={() => setIsZoomed(true)}
                    className="absolute bottom-4 right-4 z-20 p-2.5 bg-black/60 hover:bg-black/80 rounded-lg text-white/80 hover:text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm border border-[#262626]"
                    title="Agrandir l'image"
                  >
                    <Eye size={16} />
                  </button>
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center font-bold text-white/40">
                  {project.title}
                </div>
              )}

              {/* Carousel Arrows */}
              {hasCarousel && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex((current) => getPreviousIndex(current, projectImages.length))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-xl border border-[#262626] bg-black/60 text-[#A1A1AA] hover:text-white hover:bg-black/80 hover:scale-105 transition-all backdrop-blur-sm"
                    aria-label="Image précédente"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex((current) => getNextIndex(current, projectImages.length))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-xl border border-[#262626] bg-black/60 text-[#A1A1AA] hover:text-white hover:bg-black/80 hover:scale-105 transition-all backdrop-blur-sm"
                    aria-label="Image suivante"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {hasCarousel && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A1A1AA]">
                  <Grid size={12} className="text-[#3B82F6]" />
                  <span>Galerie d'images ({projectImages.length})</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {projectImages.map((image, index) => (
                    <button
                      type="button"
                      key={`${image.src}-${index}`}
                      onClick={() => setActiveImageIndex(index)}
                      className={`aspect-video overflow-hidden rounded-xl border bg-[#111111] transition-all duration-200 ${
                        index === activeImageIndex
                          ? "border-[#3B82F6] ring-2 ring-[#3B82F6]/20 opacity-100 scale-[0.98]"
                          : "border-[#262626] opacity-50 hover:opacity-100"
                      }`}
                      aria-label={`Afficher l'image ${index + 1}`}
                    >
                      <img src={getImageSrc(image.src)} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Presentation, Context, and Features */}
            <div className="space-y-8">
              {project.context && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A1A1AA]">
                    <Layers size={12} className="text-[#3B82F6]" />
                    <span>Contexte & Défi</span>
                  </div>
                  <div className="bg-[#111111] border border-[#262626] rounded-2xl p-6">
                    <p className="text-sm text-[#A1A1AA] leading-relaxed font-light">
                      {project.context}
                    </p>
                  </div>
                </section>
              )}

              {objectives.length > 0 && (
                <section className="space-y-3">
                  <h3 className="text-sm font-mono uppercase tracking-widest text-[#A1A1AA] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"></span>
                    Fonctionnalités & Objectifs
                  </h3>
                  <div className="bg-[#111111] border border-[#262626] rounded-2xl p-6">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {objectives.map((objective, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-[#A1A1AA] leading-relaxed">
                          <CheckCircle2 size={16} className="text-[#3B82F6] mt-0.5 flex-shrink-0" />
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}
            </div>

            {/* Technical Challenges & Solutions */}
            {(challenges.length > 0 || solutions.length > 0) && (
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {challenges.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-mono uppercase tracking-widest text-amber-500 flex items-center gap-2">
                      <ShieldAlert size={14} />
                      Difficultés
                    </h3>
                    <div className="bg-[#111111] border border-amber-900/20 rounded-2xl p-6 h-full">
                      <ul className="space-y-3">
                        {challenges.map((challenge, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm text-[#A1A1AA] leading-relaxed">
                            <span className="text-amber-500 mt-0.5 font-bold">▸</span>
                            <span>{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {solutions.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-mono uppercase tracking-widest text-[#10B981] flex items-center gap-2">
                      <CheckCircle2 size={14} />
                      Solutions techniques
                    </h3>
                    <div className="bg-[#111111] border border-[#10B981]/20 rounded-2xl p-6 h-full">
                      <ul className="space-y-3">
                        {solutions.map((solution, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm text-[#A1A1AA] leading-relaxed">
                            <span className="text-[#10B981] mt-0.5 font-bold">▸</span>
                            <span>{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Learned Skills & Achievements */}
            {learnedSkills.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-sm font-mono uppercase tracking-widest text-[#8B5CF6] flex items-center gap-2">
                  <Award size={14} />
                  Compétences acquises
                </h3>
                <div className="bg-[#111111] border border-[#262626] rounded-2xl p-6">
                  <div className="flex flex-wrap gap-2.5">
                    {learnedSkills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-[#8B5CF6]/20 bg-[#8B5CF6]/5 px-3 py-1.5 text-xs font-mono text-[#C084FC] hover:border-[#8B5CF6]/40 transition-colors"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Details Sidebar (Tech Stack / Metadata) */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            {/* Tech Stack Block */}
            {technologies.length > 0 && (
              <div className="bg-[#111111] border border-[#262626] rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#A1A1AA] border-b border-[#262626] pb-3">
                  Technologies utilisées
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-2.5 py-1 text-xs font-mono text-[#93C5FD]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* External Links Block */}
            <div className="bg-[#111111] border border-[#262626] rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#A1A1AA] border-b border-[#262626] pb-3">
                Ressources du projet
              </h3>
              <div className="flex flex-col gap-3 pt-1">
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] px-4 py-3 text-sm font-bold text-white transition-all shadow-lg shadow-[#3B82F6]/15 hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <span>Lancer la démo</span>
                    <ExternalLink size={15} />
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl border border-[#262626] bg-[#1A1A1A] hover:bg-[#222222] hover:border-[#404040] px-4 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5"
                  >
                    <Github size={15} />
                    <span>Explorer le code</span>
                  </a>
                )}
              </div>
            </div>

            {/* Back button link */}
            <div className="text-center pt-2">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-xs font-mono text-[#A1A1AA] hover:text-white transition-colors"
              >
                <ArrowLeft size={12} />
                Retour au catalogue
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Lightbox Zoom Overlay */}
      {isZoomed && heroImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <img
            src={getImageSrc(heroImage)}
            alt={activeImage?.alt ?? project.title}
            className="max-h-[90vh] max-w-[90vw] object-contain select-none animate-in fade-in zoom-in-95 duration-200"
          />
          <button
            type="button"
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-lg bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(false);
            }}
          >
            <X size={20} />
          </button>
        </div>
      )}
    </article>
  );
};

export default ProjectDetailPage;
