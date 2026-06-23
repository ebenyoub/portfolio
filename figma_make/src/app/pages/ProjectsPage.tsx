import { useState } from "react";
import { Link } from "react-router";
import { Plus, Pencil, Trash2, ExternalLink, Search } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "../lib/context";
import {
  Badge,
  Button,
  PageHeader,
  EmptyState,
  ConfirmDialog,
} from "../components/AdminUI";

export default function ProjectsPage() {
  const { projects, deleteProject } = useApp();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = () => {
    if (!deleteId) return;
    const p = projects.find((x) => x.id === deleteId);
    deleteProject(deleteId);
    setDeleteId(null);
    toast.success(`"${p?.title}" supprimé`);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Gestion"
        title="Projets"
        description="Gérez les projets affichés sur le portfolio public."
        action={
          <Link to="/projects/new">
            <Button>
              <Plus size={14} />
              Nouveau projet
            </Button>
          </Link>
        }
      />

      {/* Search */}
      <div className="relative mb-5">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B4B4B]"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un projet..."
          className="w-full bg-[#111111] border border-[#262626] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#4B4B4B] font-mono outline-none focus:border-[#3B82F6] transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-[#262626] rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-4 py-3 border-b border-[#1A1A1A] text-[10px] font-mono text-[#4B4B4B] uppercase tracking-widest">
          <span className="w-10" />
          <span>Titre</span>
          <span className="hidden sm:block w-20 text-center">Statut</span>
          <span className="hidden md:block w-24 text-center">Mis à jour</span>
          <span className="w-20 text-right">Actions</span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title={search ? "Aucun résultat" : "Aucun projet"}
            description={search ? `Aucun projet ne correspond à "${search}".` : "Créez votre premier projet."}
            action={
              !search ? (
                <Link to="/projects/new">
                  <Button size="sm">
                    <Plus size={13} />
                    Nouveau projet
                  </Button>
                </Link>
              ) : undefined
            }
          />
        ) : (
          filtered.map((project, i) => (
            <div
              key={project.id}
              className={`group grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-4 py-3 hover:bg-[#0F0F0F] transition-colors ${
                i < filtered.length - 1 ? "border-b border-[#111111]" : ""
              }`}
            >
              {/* Thumbnail */}
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#1A1A1A] flex-shrink-0">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-70"
                />
              </div>

              {/* Title */}
              <div className="min-w-0">
                <p
                  className="text-sm font-semibold text-white truncate"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  {project.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[#A1A1AA] font-mono">{project.category}</span>
                  <span className="text-[#2E2E2E]">·</span>
                  <div className="flex gap-1 flex-wrap">
                    {project.stack.slice(0, 3).map((t) => (
                      <span key={t} className="text-[10px] font-mono text-[#4B4B4B]">
                        {t}
                      </span>
                    ))}
                    {project.stack.length > 3 && (
                      <span className="text-[10px] font-mono text-[#4B4B4B]">
                        +{project.stack.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="hidden sm:flex w-20 justify-center">
                <Badge variant={project.status === "published" ? "published" : "draft"}>
                  {project.status === "published" ? "Publié" : "Brouillon"}
                </Badge>
              </div>

              {/* Date */}
              <div className="hidden md:block w-24 text-center">
                <span className="text-xs text-[#A1A1AA] font-mono">{project.updatedAt}</span>
              </div>

              {/* Actions */}
              <div className="w-20 flex items-center justify-end gap-1">
                <a
                  href={`/?preview=${project.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#4B4B4B] hover:text-[#A1A1AA] hover:bg-[#1A1A1A] transition-all"
                  aria-label="Prévisualiser"
                >
                  <ExternalLink size={13} />
                </a>
                <Link
                  to={`/projects/${project.id}/edit`}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#4B4B4B] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 transition-all"
                  aria-label="Modifier"
                >
                  <Pencil size={13} />
                </Link>
                <button
                  onClick={() => setDeleteId(project.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#4B4B4B] hover:text-red-400 hover:bg-red-500/10 transition-all"
                  aria-label="Supprimer"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {projects.length > 0 && (
        <p className="text-xs text-[#4B4B4B] font-mono mt-3">
          {projects.filter((p) => p.status === "published").length} publié
          {projects.filter((p) => p.status === "published").length > 1 ? "s" : ""} ·{" "}
          {projects.filter((p) => p.status === "draft").length} brouillon
          {projects.filter((p) => p.status === "draft").length > 1 ? "s" : ""}
        </p>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Supprimer ce projet ?"
        description="Cette action est irréversible. Le projet sera retiré du portfolio public."
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
