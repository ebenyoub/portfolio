import Card from "../../../components/ui/Card";
import { EmptyState, LoadingState } from "../../../components/ui/Page";
import type { Project } from "../../../types/project";
import AdminProjectRow from "./AdminProjectRow";

type AdminProjectListProps = {
  projects: Project[];
  isLoading: boolean;
  savingProjectIds: number[];
  onDeleteProject: (project: Project) => void | Promise<void>;
  onToggleFeatured: (project: Project, isFeatured: boolean) => void | Promise<void>;
  onUpdateFeaturedOrder: (project: Project, value: string) => void | Promise<void>;
};

const AdminProjectList = ({
  projects,
  isLoading,
  savingProjectIds,
  onDeleteProject,
  onToggleFeatured,
  onUpdateFeaturedOrder,
}: AdminProjectListProps) => (
  <Card className="overflow-hidden rounded-xl border border-gray-200 bg-white p-0 shadow-sm">
    <div className="grid grid-cols-[1.35fr_0.85fr_1fr_0.85fr_auto] gap-4 border-b border-gray-200 bg-gray-50 px-5 py-3 text-sm font-bold text-gray-600 max-xl:hidden">
      <span>Projet</span>
      <span>Stack</span>
      <span>Sections</span>
      <span>Accueil</span>
      <span>Actions</span>
    </div>

    {isLoading && projects.length === 0 ? (
      <LoadingState className="p-8 text-gray-500">
        <p>Chargement des projets...</p>
      </LoadingState>
    ) : projects.length > 0 ? (
      <div className="divide-y divide-gray-100">
        {projects.map((project) => (
          <AdminProjectRow
            key={project.id}
            project={project}
            isSaving={savingProjectIds.includes(project.id)}
            onDeleteProject={onDeleteProject}
            onToggleFeatured={onToggleFeatured}
            onUpdateFeaturedOrder={onUpdateFeaturedOrder}
          />
        ))}
      </div>
    ) : (
      <EmptyState className="p-8">Aucun projet pour le moment.</EmptyState>
    )}
  </Card>
);

export default AdminProjectList;
