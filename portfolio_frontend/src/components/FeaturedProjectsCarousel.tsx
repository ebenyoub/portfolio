import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../hooks/apiFetch";
import type { Project } from "../types/project";
import { getImageSrc } from "../utils/images";

const isFeaturedProject = (project: Project) => (
  project.is_featured === true || project.is_featured === 1
);

const getFeaturedOrder = (project: Project) => (
  typeof project.featured_order === "number" ? project.featured_order : 0
);

const getTechnologies = (project: Project) => (
  project.tech_stack
    ?.split(",")
    .map((technology) => technology.trim())
    .filter(Boolean)
    .slice(0, 4) ?? []
);

const getNextIndex = (current: number, total: number) => (current + 1) % total;
const getPreviousIndex = (current: number, total: number) => (current === 0 ? total - 1 : current - 1);

const FeaturedProjectsCarousel = () => {
  const { apiFetch } = useFetch();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImageIds, setFailedImageIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await apiFetch("/projects");
      const featuredProjects = (response.data as Project[])
        .filter(isFeaturedProject)
        .sort((firstProject, secondProject) => {
          const orderDifference = getFeaturedOrder(firstProject) - getFeaturedOrder(secondProject);
          return orderDifference === 0
            ? firstProject.title.localeCompare(secondProject.title)
            : orderDifference;
        });

      setProjects(featuredProjects);
    };

    fetchProjects().catch(() => {
      setProjects([]);
    });
  }, [apiFetch]);

  useEffect(() => {
    if (projects.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => getNextIndex(current, projects.length));
    }, 7000);

    return () => window.clearInterval(interval);
  }, [projects.length]);

  if (projects.length === 0) return null;

  const activeProjectIndex = projects[activeIndex] ? activeIndex : 0;
  const activeProject = projects[activeProjectIndex];
  const technologies = getTechnologies(activeProject);
  const hasImage = Boolean(activeProject.image_url) && !failedImageIds.includes(activeProject.id);
  const hasMultipleProjects = projects.length > 1;

  const showPreviousProject = () => {
    setActiveIndex((current) => getPreviousIndex(current, projects.length));
  };

  const showNextProject = () => {
    setActiveIndex((current) => getNextIndex(current, projects.length));
  };

  return (
    <section className="bg-white py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-950">Projets sélectionnés</h2>
            <p className="mt-2 max-w-2xl text-gray-600">
              Une sélection courte de réalisations mises en avant depuis le dashboard.
            </p>
          </div>

          <Link
            to="/projects"
            className="inline-flex w-fit items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-gray-800"
          >
            Voir tous les projets
          </Link>
        </div>

        <div className="grid min-h-[420px] grid-cols-1 overflow-hidden rounded-lg border border-gray-200 bg-gray-950 shadow-sm lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[260px] bg-gray-900 lg:min-h-[420px]">
            {hasImage ? (
              <img
                src={getImageSrc(activeProject.image_url)}
                alt={activeProject.title}
                className="h-full w-full object-cover"
                onError={() => setFailedImageIds((current) => [...current, activeProject.id])}
              />
            ) : (
              <div className="flex h-full min-h-[260px] w-full items-center justify-center bg-linear-to-br from-gray-900 via-blue-950 to-gray-800 p-8 text-center text-3xl font-bold text-white">
                {activeProject.title}
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/45 to-transparent" />
          </div>

          <div className="flex flex-col justify-between gap-8 bg-white p-6 md:p-8">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                {technologies.map((technology) => (
                  <span
                    key={technology}
                    className="rounded bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700"
                  >
                    {technology}
                  </span>
                ))}
              </div>

              <h3 className="text-3xl font-extrabold text-gray-950">{activeProject.title}</h3>
              <p className="mt-4 line-clamp-5 text-base leading-relaxed text-gray-600">
                {activeProject.description}
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/projects/${activeProject.id}`}
                  className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                >
                  Détails
                </Link>

                {activeProject.github_url && (
                  <a
                    href={activeProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-md bg-gray-100 px-4 py-2 text-sm font-bold text-gray-800 transition-colors hover:bg-gray-200"
                  >
                    GitHub
                  </a>
                )}
              </div>

              {hasMultipleProjects && (
                <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-5">
                  <div className="flex gap-2">
                    {projects.map((project, index) => (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={`h-2.5 w-8 rounded-full transition-colors ${
                          index === activeProjectIndex ? "bg-blue-600" : "bg-gray-200 hover:bg-gray-300"
                        }`}
                        aria-label={`Afficher ${project.title}`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={showPreviousProject}
                      className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-2xl font-bold text-gray-700 transition-colors hover:bg-gray-50"
                      aria-label="Projet précédent"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={showNextProject}
                      className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-2xl font-bold text-gray-700 transition-colors hover:bg-gray-50"
                      aria-label="Projet suivant"
                    >
                      ›
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjectsCarousel;
