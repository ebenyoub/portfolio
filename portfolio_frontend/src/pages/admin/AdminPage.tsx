import { useEffect, useState } from "react";
import { toast } from "sonner";
import useFetch from "../../hooks/apiFetch";
import type { Project } from "../../types/project";
import AdminProjectHeader from "./components/AdminProjectHeader";
import AdminProjectList from "./components/AdminProjectList";
import { getFeaturedOrder, isProjectFeatured } from "./utils/featuredProjects";

const AdminPage = () => {
  const { apiFetch, isLoading } = useFetch();
  const [projects, setProjects] = useState<Project[]>([]);
  const [savingProjectIds, setSavingProjectIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiFetch("/projects");
        setProjects(response.data);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    };

    fetchProjects();
  }, [apiFetch]);

  const deleteProject = async (project: Project) => {
    const confirmed = window.confirm(`Supprimer le projet "${project.title}" ?`);
    if (!confirmed) return;

    try {
      await apiFetch(`/projects/${project.id}`, {
        method: "DELETE",
      });

      setProjects((currentProjects) => currentProjects.filter((item) => item.id !== project.id));
      toast.success("Projet supprimé.");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const getNextFeaturedOrder = () => (
    Math.max(0, ...projects.filter(isProjectFeatured).map(getFeaturedOrder)) + 1
  );

  const updateProjectHomepageSettings = async (
    project: Project,
    updates: Pick<Project, "is_featured" | "featured_order">
  ) => {
    const previousProjects = projects;
    const nextProject = { ...project, ...updates };

    setProjects((currentProjects) => currentProjects.map((item) => (
      item.id === project.id ? nextProject : item
    )));
    setSavingProjectIds((currentIds) => [...currentIds, project.id]);

    try {
      await apiFetch(`/projects/${project.id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      toast.success("Mise en avant mise à jour.");
    } catch (error) {
      setProjects(previousProjects);

      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setSavingProjectIds((currentIds) => currentIds.filter((id) => id !== project.id));
    }
  };

  const toggleFeaturedProject = async (project: Project, isFeatured: boolean) => {
    await updateProjectHomepageSettings(project, {
      is_featured: isFeatured,
      featured_order: isFeatured
        ? getFeaturedOrder(project) || getNextFeaturedOrder()
        : 0,
    });
  };

  const updateFeaturedOrder = async (project: Project, value: string) => {
    const featuredOrder = Math.max(0, Number.parseInt(value, 10) || 0);

    await updateProjectHomepageSettings(project, {
      is_featured: featuredOrder > 0 ? true : isProjectFeatured(project),
      featured_order: featuredOrder,
    });
  };

  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    return [
      project.title,
      project.description,
      project.tech_stack,
      project.github_url,
      project.demo_url,
    ]
      .filter(Boolean)
      .some((value) => value?.toString().toLowerCase().includes(query));
  });

  return (
    <div className="space-y-6">
      <AdminProjectHeader
        projectCount={projects.length}
        featuredCount={projects.filter(isProjectFeatured).length}
        visibleCount={filteredProjects.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <AdminProjectList
        projects={filteredProjects}
        isLoading={isLoading}
        savingProjectIds={savingProjectIds}
        onDeleteProject={deleteProject}
        onToggleFeatured={toggleFeaturedProject}
        onUpdateFeaturedOrder={updateFeaturedOrder}
        hasFilter={searchQuery.trim().length > 0}
      />
    </div>
  );
};

export default AdminPage;
