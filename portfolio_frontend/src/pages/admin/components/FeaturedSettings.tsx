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
  <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-center">
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#262626] bg-[#0A0A0A] px-2.5 py-1.5 text-[11px] font-mono text-[#A1A1AA]">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-[#262626] bg-[#0A0A0A] text-[#3B82F6] focus:ring-[#3B82F6]/30 focus:ring-offset-[#0A0A0A]"
        checked={isFeatured}
        disabled={isSaving}
        aria-label={`Sélection accueil pour ${project.title}`}
        onChange={(event) => {
          void onToggleFeatured(project, event.target.checked);
        }}
      />
      {isFeatured ? "On" : "Off"}
    </label>

    <label className="inline-flex items-center gap-2 rounded-lg border border-[#262626] bg-[#0A0A0A] px-2.5 py-1.5 text-[11px] font-mono text-[#A1A1AA]">
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
        className="h-7 w-12 rounded-md border border-[#262626] bg-[#111111] px-1.5 text-center text-[11px] text-white outline-none transition-colors focus:border-[#3B82F6] disabled:cursor-not-allowed disabled:opacity-30 font-mono"
        aria-label={`Ordre d'affichage accueil pour ${project.title}`}
      />
    </label>
  </div>
);

export default FeaturedSettings;
