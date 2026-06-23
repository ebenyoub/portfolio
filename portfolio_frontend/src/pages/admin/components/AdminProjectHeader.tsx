import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";

type AdminProjectHeaderProps = {
  projectCount: number;
  featuredCount: number;
  visibleCount: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
};

const AdminProjectHeader = ({
  projectCount,
  featuredCount,
  visibleCount,
  searchQuery,
  onSearchChange,
}: AdminProjectHeaderProps) => (
  <section className="rounded-[28px] border border-[#262626] bg-[#0E0E0E] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.38)]">
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-2xl">
        <p className="text-xs font-mono tracking-[0.2em] uppercase text-[#3B82F6] mb-2">Gestion</p>
        <h1 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "Manrope, sans-serif" }}>
          Projets
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#A1A1AA]">
          Pilote les réalisations du portfolio, la mise en avant de la home et les accès rapides vers l’édition.
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs font-mono uppercase tracking-[0.16em]">
          <span className="rounded-full border border-[#262626] bg-[#0A0A0A] px-3 py-2 text-[#D4D4D8]">
            {projectCount} projets
          </span>
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-emerald-300">
            {featuredCount} en vitrine
          </span>
          <span className="rounded-full border border-[#262626] bg-[#0A0A0A] px-3 py-2 text-[#A1A1AA]">
            {visibleCount} visibles
          </span>
        </div>
      </div>

      <Link
        to="/admin/projects/new"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2563EB] shadow-[0_12px_28px_rgba(59,130,246,0.22)]"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <Plus size={15} />
        Nouveau projet
      </Link>
    </div>

    <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <label className="flex items-center gap-3 rounded-2xl border border-[#262626] bg-[#0A0A0A] px-4 py-3 text-[#A1A1AA] focus-within:border-[#3B82F6]">
        <Search size={16} className="shrink-0 text-[#4B4B4B]" />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Rechercher un projet, une stack ou une URL"
          className="w-full bg-transparent text-sm text-white placeholder:text-[#4B4B4B] outline-none"
          aria-label="Rechercher un projet"
        />
      </label>

      <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#4B4B4B]">
        {searchQuery ? `Filtre actif : ${visibleCount} résultat${visibleCount > 1 ? "s" : ""}` : "Vue catalogue"}
      </p>
    </div>
  </section>
);

export default AdminProjectHeader;
