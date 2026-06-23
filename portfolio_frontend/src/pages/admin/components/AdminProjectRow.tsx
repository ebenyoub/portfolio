import type { Project } from "../../../types/project";
import { getImageSrc } from "../../../utils/images";
import { getFeaturedOrder, isProjectFeatured } from "../utils/featuredProjects";
import AdminProjectActions from "./AdminProjectActions";
import FeaturedSettings from "./FeaturedSettings";

type AdminProjectRowProps = {
  project: Project;
  isSaving: boolean;
  onDeleteProject: (project: Project) => void | Promise<void>;
  onToggleFeatured: (project: Project, isFeatured: boolean) => void | Promise<void>;
  onUpdateFeaturedOrder: (project: Project, value: string) => void | Promise<void>;
};

const AdminProjectRow = ({
  project,
  isSaving,
  onDeleteProject,
  onToggleFeatured,
  onUpdateFeaturedOrder,
}: AdminProjectRowProps) => {
  const projectIsFeatured = isProjectFeatured(project);
  const featuredOrder = getFeaturedOrder(project);
  const stack = project.tech_stack
    ? project.tech_stack.split(",").map((tech) => tech.trim()).filter(Boolean)
    : [];
  const projectDate = project.updated_at ?? project.created_at;
  const formattedDate = projectDate
    ? new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(projectDate))
    : "Date non fournie";

  const statusLabel = projectIsFeatured ? "En vitrine" : "Standard";
  const statusTone = projectIsFeatured
    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
    : "border-[#262626] bg-[#111111] text-[#A1A1AA]";

  return (
    <div className="px-6 py-4 transition-colors duration-150 hover:bg-[#111111]">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(180px,0.9fr)_140px_140px_180px_auto] xl:items-center">
        <div className="flex items-start gap-4">
          <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-[#262626] bg-[#0A0A0A]">
          {project.image_url ? (
              <img src={getImageSrc(project.image_url)} alt="" className="h-full w-full object-cover opacity-85" />
          ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#111111] text-xs font-bold text-[#A1A1AA] font-mono">
                {project.title.slice(0, 2).toUpperCase()}
              </div>
          )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-sm font-bold tracking-tight text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
                {project.title}
              </h2>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] ${statusTone}`}>
                {statusLabel}
              </span>
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-[#A1A1AA]">
              {project.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-[#4B4B4B] xl:hidden">
              <span className="rounded-full border border-[#262626] bg-[#0A0A0A] px-2.5 py-1">Date: {formattedDate}</span>
              <span className="rounded-full border border-[#262626] bg-[#0A0A0A] px-2.5 py-1">
                {projectIsFeatured ? `Ordre ${featuredOrder}` : "Non sélectionné"}
              </span>
            </div>
          </div>
        </div>

        <div>
          {stack.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {stack.slice(0, 4).map((t) => (
                <span key={t} className="rounded-full border border-[#262626] bg-[#0A0A0A] px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-[#A1A1AA]">
                  {t}
                </span>
              ))}
              {stack.length > 4 && (
                <span className="rounded-full border border-[#262626] bg-[#0A0A0A] px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-[#A1A1AA]">
                  +{stack.length - 4}
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs font-mono text-[#4B4B4B]">Aucune stack</span>
          )}
        </div>

        <div className="hidden xl:block">
          <span className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-mono uppercase tracking-[0.18em] ${statusTone}`}>
            {statusLabel}
          </span>
        </div>

        <div className="hidden xl:block text-sm font-mono text-[#A1A1AA]">{formattedDate}</div>

        <FeaturedSettings
          project={project}
          isFeatured={projectIsFeatured}
          featuredOrder={featuredOrder}
          isSaving={isSaving}
          onToggleFeatured={onToggleFeatured}
          onUpdateFeaturedOrder={onUpdateFeaturedOrder}
        />

        <AdminProjectActions project={project} onDeleteProject={onDeleteProject} />
      </div>
    </div>
  );
};

export default AdminProjectRow;
