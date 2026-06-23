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
  <>
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <p className="mb-1.5 text-xs font-mono uppercase tracking-widest text-[#3B82F6]">Gestion</p>
        <h1 className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
          Projets
        </h1>
        <p className="mt-1 max-w-lg text-sm text-[#A1A1AA]">
          Gere les projets affiches sur le portfolio public.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-[#262626] bg-[#1A1A1A] px-2 py-0.5 text-[11px] font-mono text-[#A1A1AA]">
            {projectCount} projet{projectCount > 1 ? "s" : ""}
          </span>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-mono text-emerald-400">
            {featuredCount} en vitrine
          </span>
          <span className="rounded-full border border-[#262626] bg-[#1A1A1A] px-2 py-0.5 text-[11px] font-mono text-[#A1A1AA]">
            {visibleCount} visible{visibleCount > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <Link
        to="/admin/projects/new"
        className="inline-flex items-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2563EB]"
      >
        <Plus size={15} />
        Nouveau projet
      </Link>
    </div>

    <div className="relative mb-5">
      <Search
        size={15}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B4B4B]"
      />
      <label className="block">
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Rechercher un projet..."
          className="w-full rounded-xl border border-[#262626] bg-[#111111] py-2.5 pl-10 pr-4 text-sm font-mono text-white outline-none transition-colors placeholder:text-[#4B4B4B] focus:border-[#3B82F6]"
          aria-label="Rechercher un projet"
        />
      </label>
    </div>
  </>
);

export default AdminProjectHeader;
