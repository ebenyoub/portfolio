import type { Project } from "../../../types/project";
import AdminProjectRow from "./AdminProjectRow";

type AdminProjectListProps = {
  projects: Project[];
  isLoading: boolean;
  savingProjectIds: number[];
  onDeleteProject: (project: Project) => void | Promise<void>;
  onToggleFeatured: (project: Project, isFeatured: boolean) => void | Promise<void>;
  onUpdateFeaturedOrder: (project: Project, value: string) => void | Promise<void>;
  hasFilter: boolean;
};

const AdminProjectList = ({
  projects,
  isLoading,
  savingProjectIds,
  onDeleteProject,
  onToggleFeatured,
  onUpdateFeaturedOrder,
  hasFilter,
}: AdminProjectListProps) => (
  <section className="overflow-hidden rounded-[28px] border border-[#262626] bg-[#0E0E0E] shadow-[0_24px_60px_rgba(0,0,0,0.32)]">
    <div className="flex items-center justify-between border-b border-[#1A1A1A] px-6 py-4">
      <div>
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#4B4B4B]">Catalogue</p>
        <p className="mt-1 text-sm text-[#A1A1AA]">
          {projects.length > 0
            ? `${projects.length} projet${projects.length > 1 ? "s" : ""} affiché${projects.length > 1 ? "s" : ""}`
            : "Aucun projet affiché"}
        </p>
      </div>
      <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-[#4B4B4B]">
        <span className="rounded-full border border-[#262626] bg-[#0A0A0A] px-3 py-2">Miniature</span>
        <span className="rounded-full border border-[#262626] bg-[#0A0A0A] px-3 py-2">Stack</span>
        <span className="rounded-full border border-[#262626] bg-[#0A0A0A] px-3 py-2">Statut</span>
        <span className="rounded-full border border-[#262626] bg-[#0A0A0A] px-3 py-2">Date</span>
      </div>
    </div>

    <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(180px,0.9fr)_140px_140px_180px_auto] gap-4 border-b border-[#1A1A1A] px-6 py-3 text-[10px] font-mono uppercase tracking-[0.22em] text-[#4B4B4B] max-xl:hidden">
      <span>Projet</span>
      <span>Stack</span>
      <span>Statut</span>
      <span>Date</span>
      <span>Mise en avant</span>
      <span className="text-right">Actions</span>
    </div>

    {isLoading && projects.length === 0 ? (
      <div className="px-6 py-14 text-center text-[#A1A1AA] font-mono text-sm animate-pulse">
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
      <div className="px-6 py-14 text-center">
        <p className="text-sm text-white font-medium">
          {hasFilter ? "Aucun projet ne correspond à cette recherche." : "Aucun projet pour le moment."}
        </p>
        <p className="mt-2 text-sm text-[#A1A1AA]">
          {hasFilter ? "Essaie un autre mot-clé ou supprime le filtre." : "Crée le premier projet pour remplir la liste."}
        </p>
      </div>
    )}
  </section>
);

export default AdminProjectList;
