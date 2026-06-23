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
  const stack = project.tech_stack
    ? project.tech_stack.split(",").map((tech) => tech.trim()).filter(Boolean)
    : [];
  const isFeatured = isProjectFeatured(project);
  const featuredOrder = getFeaturedOrder(project);
  const updatedAt = project.updated_at ?? project.created_at;
  const formattedDate = updatedAt
    ? new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(updatedAt))
    : "N/A";

  return (
    <div className="group grid items-center gap-4 px-4 py-3 transition-colors hover:bg-[#0F0F0F] lg:grid-cols-[auto_1fr_auto_auto_auto_auto]">
      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-[#1A1A1A]">
        {project.image_url ? (
          <img
            src={getImageSrc(project.image_url)}
            alt=""
            className="h-full w-full object-cover opacity-70"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#1A1A1A] text-[10px] font-bold text-[#A1A1AA]">
            {project.title.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p
          className="truncate text-sm font-semibold text-white"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          {project.title}
        </p>
        <div className="mt-0.5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-[#A1A1AA]">
            {stack.slice(0, 3).join(" · ") || "Sans stack"}
          </span>
          {stack.length > 3 && (
            <>
              <span className="text-[#2E2E2E]">·</span>
              <span className="text-[10px] font-mono text-[#4B4B4B]">+{stack.length - 3}</span>
            </>
          )}
        </div>
      </div>

      <div className="hidden w-20 justify-center lg:flex">
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-mono ${
            isFeatured
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-[#262626] bg-[#1A1A1A] text-[#A1A1AA]"
          }`}
        >
          {isFeatured ? "Publie" : "Standard"}
        </span>
      </div>

      <div className="hidden w-24 text-center lg:block">
        <span className="text-xs font-mono text-[#A1A1AA]">{formattedDate}</span>
      </div>

      <div className="lg:w-36">
        <FeaturedSettings
          project={project}
          isFeatured={isFeatured}
          featuredOrder={featuredOrder}
          isSaving={isSaving}
          onToggleFeatured={onToggleFeatured}
          onUpdateFeaturedOrder={onUpdateFeaturedOrder}
        />
      </div>

      <div className="lg:w-20">
        <AdminProjectActions project={project} onDeleteProject={onDeleteProject} />
      </div>
    </div>
  );
};

export default AdminProjectRow;
