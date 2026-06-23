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
  <div className="bg-[#111111] border border-[#262626] rounded-xl overflow-hidden shadow-2xl">
    <div className="grid grid-cols-[1.35fr_0.85fr_1fr_0.85fr_auto] gap-4 border-b border-[#1A1A1A] px-5 py-3.5 text-[10px] font-mono text-[#4B4B4B] uppercase tracking-widest max-xl:hidden">
      <span>Projet</span>
      <span>Stack</span>
      <span>Sections</span>
      <span>Mise en avant</span>
      <span className="text-right">Actions</span>
    </div>

    {isLoading && projects.length === 0 ? (
      <div className="p-12 text-center text-[#A1A1AA] font-mono text-sm animate-pulse">
        Chargement des projets...
      </div>
    ) : projects.length > 0 ? (
      <div className="divide-y divide-[#1A1A1A]">
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
      <div className="p-12 text-center text-[#A1A1AA] font-mono text-sm">
        Aucun projet pour le moment.
      </div>
    )}
  </div>
);

export default AdminProjectList;
