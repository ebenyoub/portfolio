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

  return (
    <div className="grid grid-cols-1 gap-4 px-5 py-4 xl:grid-cols-[1.35fr_0.85fr_1fr_0.85fr_auto] xl:items-center">
      <div className="flex items-center gap-4">
        <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
          {project.image_url ? (
            <img src={getImageSrc(project.image_url)} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-900 text-sm font-bold text-white">
              {project.title.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h2 className="font-bold text-gray-900">{project.title}</h2>
          <p className="line-clamp-2 text-sm text-gray-500">{project.description}</p>
        </div>
      </div>

      <p className="text-sm text-gray-600">{project.tech_stack || "Non renseignée"}</p>

      <p className="text-sm font-medium text-gray-700">
        {visibleSections} / {Object.keys(settings).length} sections actives
      </p>

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
