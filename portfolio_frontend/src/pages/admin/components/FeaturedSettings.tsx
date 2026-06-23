import type { Project } from "../../../types/project";

type FeaturedSettingsProps = {
  project: Project;
  isFeatured: boolean;
  featuredOrder: number;
  isSaving: boolean;
  onToggleFeatured: (project: Project, isFeatured: boolean) => void | Promise<void>;
  onUpdateFeaturedOrder: (project: Project, value: string) => void | Promise<void>;
};

const FeaturedSettings = ({
  project,
  isFeatured,
  featuredOrder,
  isSaving,
  onToggleFeatured,
  onUpdateFeaturedOrder,
}: FeaturedSettingsProps) => (
  <div className="flex flex-wrap items-center gap-3">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        checked={isFeatured}
        disabled={isSaving}
        aria-label={`Sélection accueil pour ${project.title}`}
        onChange={(event) => {
          void onToggleFeatured(project, event.target.checked);
        }}
      />
      Accueil
    </label>

    <label className="flex items-center gap-2 text-sm text-gray-600">
      Ordre
      <input
        type="number"
        min={0}
        max={999}
        value={featuredOrder}
        disabled={isSaving || !isFeatured}
        onChange={(event) => {
          void onUpdateFeaturedOrder(project, event.target.value);
        }}
        className="h-9 w-20 rounded-md border border-gray-300 px-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
        aria-label={`Ordre d'affichage accueil pour ${project.title}`}
      />
    </label>
  </div>
);

export default FeaturedSettings;
