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
  <div className="flex flex-wrap items-center gap-4">
    <label className="flex items-center gap-2 text-xs font-mono text-[#A1A1AA] cursor-pointer">
      <input
        type="checkbox"
        className="h-4 w-4 bg-[#0A0A0A] border-[#262626] rounded text-[#3B82F6] focus:ring-[#3B82F6]/30 focus:ring-offset-[#0A0A0A]"
        checked={isFeatured}
        disabled={isSaving}
        aria-label={`Sélection accueil pour ${project.title}`}
        onChange={(event) => {
          void onToggleFeatured(project, event.target.checked);
        }}
      />
      Accueil
    </label>

    <label className="flex items-center gap-2 text-xs font-mono text-[#A1A1AA]">
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
        className="h-8 w-16 bg-[#0A0A0A] border border-[#262626] rounded-lg px-2 text-center text-xs text-white focus:outline-none focus:border-[#3B82F6] disabled:opacity-30 disabled:cursor-not-allowed font-mono"
        aria-label={`Ordre d'affichage accueil pour ${project.title}`}
      />
    </label>
  </div>
);

export default FeaturedSettings;
