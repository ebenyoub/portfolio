import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import useFetch from "../../hooks/apiFetch";
import type { Project } from "../../types/project";
import { ProjectCaseStudyPanel } from "../../components/ProjectCaseStudyModal";

const ProjectDetailPage = () => {
  const { apiFetch, isLoading } = useFetch();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
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

  if (isLoading && !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-6 py-20">
        <p className="animate-pulse text-xl font-medium text-[#A1A1AA]">Chargement du projet...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] px-6 py-20 text-center">
        <h2
          className="mb-4 text-2xl font-bold text-white"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          Projet non trouvé
        </h2>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 rounded-lg border border-[#262626] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#111111]"
        >
          <ArrowLeft size={15} />
          Retour aux projets
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-0 py-0 text-white md:px-6 md:py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-5">
        <div className="px-6 pt-24 md:px-0 md:pt-0">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#A1A1AA] transition-colors hover:text-white"
          >
            <ArrowLeft size={15} />
            Retour aux projets
          </Link>
        </div>

        <ProjectCaseStudyPanel project={project} />
      </div>
    </div>
  );
};

export default ProjectDetailPage;
