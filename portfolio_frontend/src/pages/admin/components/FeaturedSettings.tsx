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
    <label className="inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#0A0A0A] px-3 py-2 text-xs font-mono text-[#A1A1AA] cursor-pointer">
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
      {isFeatured ? "En vitrine" : "Accueil"}
    </label>

    <label className="inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#0A0A0A] px-3 py-2 text-xs font-mono text-[#A1A1AA]">
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
        className="h-8 w-16 rounded-md border border-[#262626] bg-[#111111] px-2 text-center text-xs text-white outline-none transition-colors focus:border-[#3B82F6] disabled:cursor-not-allowed disabled:opacity-30 font-mono"
        aria-label={`Ordre d'affichage accueil pour ${project.title}`}
      />
    </label>
  </div>
);

export default FeaturedSettings;
