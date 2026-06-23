import { useEffect, useState } from 'react';
import useFetch from '../hooks/apiFetch';
import { toast } from 'sonner';
import ProjectCard from '../components/ProjectCard';
import type { Project } from '../types/project';

const ProjectsPage = () => {
  const { apiFetch, isLoading } = useFetch();
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFetch('/projects');
        // Sort and prioritize based on specified order:
        // 1. La Loge
        // 2. Application Rétrospective Agile
        // 3. ArgentBank
        // 4. Médiathèque PHP MVC
        // 5. Cub3D
        // 6. Kasa
        // 7. SportSee
        // 8. OhMyFood
        // 9. Petits Plats
        const priorityTitles = [
          "la loge",
          "retrospective backend",
          "retrospective frontend",
          "argentbank",
          "atelier dein",
          "cub3d",
          "kasa",
          "sportsee",
          "ohmyfood",
          "petits plats"
        ];

        const sorted = (response.data as Project[]).filter((p) => {
          return p.title.toLowerCase() !== "portfolio personnel";
        }).sort((a, b) => {
          const idxA = priorityTitles.findIndex(t => a.title.toLowerCase().includes(t));
          const idxB = priorityTitles.findIndex(t => b.title.toLowerCase().includes(t));
          
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
          
          return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
        });

        setProjects(sorted);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          toast.error(err.message);
        }
      }
    };

    fetchData();
  }, [apiFetch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex justify-center items-center py-20">
        <p className="text-xl animate-pulse text-[#A1A1AA] font-mono">Chargement de la galerie...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4" style={{ fontFamily: "Manrope, sans-serif" }}>Erreur</h2>
        <p className="text-[#A1A1AA] font-mono">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <p className="text-xs font-mono tracking-[0.2em] uppercase text-[#3B82F6] mb-3">Mes réalisations</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4" style={{ fontFamily: "Manrope, sans-serif" }}>
            Projets &amp; Travaux
          </h1>
          <p className="max-w-2xl text-base text-[#A1A1AA] leading-relaxed">
            Une sélection de projets orientés React, intégration d'API, interfaces responsives et logique métier. Chaque réalisation démontre une compétence ciblée.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                description={project.description ?? ""}
                image_url={project.image_url ?? undefined}
                tech_stack={project.tech_stack ?? undefined}
                github_url={project.github_url ?? undefined}
              />
            ))
          ) : (
            <p className="col-span-full py-20 text-[#A1A1AA] font-mono">Aucun projet trouvé.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
