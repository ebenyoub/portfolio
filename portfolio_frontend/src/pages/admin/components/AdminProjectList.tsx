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
  <section className="overflow-hidden rounded-xl border border-[#262626] bg-[#111111]">
    <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 border-b border-[#1A1A1A] px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-[#4B4B4B] max-lg:hidden">
      <span className="w-10" />
      <span>Titre</span>
      <span className="w-20 text-center">Statut</span>
      <span className="w-24 text-center">Mis a jour</span>
      <span className="w-36 text-center">Accueil</span>
      <span className="w-20 text-right">Actions</span>
    </div>

    {isLoading && projects.length === 0 ? (
      <div className="px-6 py-14 text-center text-sm font-mono text-[#A1A1AA] animate-pulse">
        Chargement des projets...
      </div>
    ) : projects.length > 0 ? (
      <div>
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
