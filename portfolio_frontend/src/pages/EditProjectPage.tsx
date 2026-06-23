import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { EmptyState, LoadingState } from "../components/ui/Page";
import Container from "../components/ui/Container";
import useFetch from "../hooks/apiFetch";
import ProjectForm, { type ProjectFormValues, type ProjectPayload } from "../components/ProjectForm";
import type { Project } from "../types/project";
import { cub3dGalleryPaths, isCub3dProject, parseDisplaySettings, parseJsonArray } from "../utils/project";

const arrayToLines = (value: string[] | string | null | undefined) => parseJsonArray(value).join("\n");

const projectToFormValues = (project: Project): ProjectFormValues => {
  const galleryImages = parseJsonArray(project.gallery_images);
  const defaultGalleryImages = galleryImages.length > 0
    ? galleryImages
    : isCub3dProject(project)
      ? cub3dGalleryPaths
      : [];

  return {
    title: project.title,
    description: project.description ?? "",
    tech_stack: project.tech_stack ?? "",
    github_url: project.github_url ?? "",
    demo_url: project.demo_url ?? "",
    image_url: project.image_url ?? "",
    gallery_images: defaultGalleryImages.map((url) => ({ url })),
    context: project.context ?? "",
    objective: project.objective ?? "",
    challenges: project.challenges ?? "",
    solution: project.solution ?? "",
    learned_skills: arrayToLines(project.learned_skills),
    display_settings: parseDisplaySettings(project.display_settings, project),
  };
};

const EditProjectPage = () => {
  const { apiFetch, isLoading } = useFetch();
  const [project, setProject] = useState<Project | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await apiFetch(`/projects/${id}`);
        setProject(response.data);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    };

    if (id) {
      fetchProject();
    }
  }, [apiFetch, id]);

  const onSubmit = async (payload: ProjectPayload) => {
    try {
      await apiFetch(`/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      toast.success("Projet modifié avec succès !");
      navigate("/admin");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  if (isLoading && !project) {
    return (
      <Container className="py-20 justify-center">
        <LoadingState>
          <p className="text-xl animate-pulse">Chargement du projet...</p>
        </LoadingState>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container className="py-20 justify-center">
        <EmptyState className="text-gray-600">Projet introuvable.</EmptyState>
      </Container>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-[#111111] border border-[#262626] rounded-xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-white tracking-tight mb-8" style={{ fontFamily: "Manrope, sans-serif" }}>
          Modifier {project.title}
        </h1>

        <ProjectForm
          defaultValues={projectToFormValues(project)}
          isLoading={isLoading}
          submitLabel="Enregistrer"
          loadingLabel="Enregistrement..."
          onSubmit={onSubmit}
          onCancel={() => navigate("/admin")}
        />
      </div>
    </div>
  );
};

export default EditProjectPage;
