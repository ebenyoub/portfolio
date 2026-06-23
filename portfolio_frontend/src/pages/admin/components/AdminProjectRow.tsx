import type { Project } from "../../../types/project";
import { getImageSrc } from "../../../utils/images";
import { parseDisplaySettings } from "../../../utils/project";
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
  const settings = parseDisplaySettings(project.display_settings, project);
  const visibleSections = Object.values(settings).filter(Boolean).length;
  const projectIsFeatured = isProjectFeatured(project);
  const featuredOrder = getFeaturedOrder(project);
  const stack = project.tech_stack
    ? project.tech_stack.split(",").map((tech) => tech.trim()).filter(Boolean)
    : [];

  return (
    <div className="grid grid-cols-1 gap-4 px-5 py-4 xl:grid-cols-[1.35fr_0.85fr_1fr_0.85fr_auto] xl:items-center hover:bg-[#0F0F0F] transition-colors duration-150">
      <div className="flex items-center gap-4">
        <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-[#1A1A1A] border border-[#262626]">
          {project.image_url ? (
            <img src={getImageSrc(project.image_url)} alt="" className="h-full w-full object-cover opacity-70" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-900 text-xs font-bold text-[#A1A1AA] font-mono">
              {project.title.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h2 className="font-bold text-white text-sm tracking-tight truncate" style={{ fontFamily: "Manrope, sans-serif" }}>
            {project.title}
          </h2>
          <p className="line-clamp-1 text-xs text-[#A1A1AA] mt-0.5">{project.description}</p>
        </div>
      </div>

      <div>
        {stack.length > 0 ? (
          <div className="flex gap-1 flex-wrap">
            {stack.slice(0, 3).map((t) => (
              <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#262626] bg-[#0A0A0A] text-[#A1A1AA]">
                {t}
              </span>
            ))}
            {stack.length > 3 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#262626] bg-[#0A0A0A] text-[#A1A1AA]">
                +{stack.length - 3}
              </span>
            )}
          </div>
        ) : (
          <span className="text-xs text-[#4B4B4B] font-mono">Aucune</span>
        )}
      </div>

      <div className="text-xs font-mono text-[#A1A1AA]">
        {visibleSections} <span className="text-[#4B4B4B]">/ {Object.keys(settings).length} sections</span>
      </div>

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
  );
};

export default AdminProjectRow;
