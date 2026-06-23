import { useState, useRef } from "react";
import { Upload, Search, Trash2, X, Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "../lib/context";
import type { MediaItem } from "../lib/types";
import { Button, PageHeader, EmptyState, ConfirmDialog } from "../components/AdminUI";

function MediaDetail({
  item,
  onDelete,
  onClose,
}: {
  item: MediaItem;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(item.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("URL copiée");
  };

  return (
    <div className="bg-[#111111] border border-[#262626] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A1A1A]">
        <p className="text-xs font-mono text-[#A1A1AA] truncate max-w-[180px]">{item.filename}</p>
        <button
          onClick={onClose}
          className="text-[#4B4B4B] hover:text-white transition-colors"
          aria-label="Fermer"
        >
          <X size={14} />
        </button>
      </div>
      <div className="bg-[#0A0A0A] h-48 flex items-center justify-center overflow-hidden">
        <img
          src={item.url}
          alt={item.filename}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <div className="p-4 space-y-3">
        <div className="space-y-1.5">
          <p className="text-[10px] font-mono text-[#4B4B4B] uppercase tracking-widest">Nom</p>
          <p className="text-xs text-white font-mono truncate">{item.filename}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-mono text-[#4B4B4B] uppercase tracking-widest mb-1">Taille</p>
            <p className="text-xs text-[#A1A1AA] font-mono">{item.size}</p>
          </div>
          <div>
            <p className="text-[10px] font-mono text-[#4B4B4B] uppercase tracking-widest mb-1">Ajouté</p>
            <p className="text-xs text-[#A1A1AA] font-mono">{item.uploadedAt}</p>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={copy}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-xs bg-[#0A0A0A] border border-[#262626] rounded-lg text-[#A1A1AA] hover:text-white hover:border-[#363636] transition-all font-mono"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            {copied ? "Copié !" : "Copier l'URL"}
          </button>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center border border-[#262626] rounded-lg text-[#4B4B4B] hover:text-white hover:border-[#363636] transition-all"
            aria-label="Ouvrir"
          >
            <ExternalLink size={13} />
          </a>
          <button
            onClick={() => onDelete(item.id)}
            className="w-9 h-9 flex items-center justify-center border border-red-500/20 rounded-lg text-red-400/60 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/08 transition-all"
            aria-label="Supprimer"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MediaPage() {
  const { media, addMedia, deleteMedia } = useApp();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const filtered = media.filter((m) =>
    m.filename.toLowerCase().includes(search.toLowerCase())
  );

  const simulateUpload = async () => {
    setUploading(true);
    await new Promise((r) => setTimeout(r, 1500));
    addMedia({
      url: `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop&auto=format&t=${Date.now()}`,
      filename: `upload-${Date.now()}.jpg`,
      size: `${Math.floor(Math.random() * 300 + 100)} KB`,
      uploadedAt: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
    });
    setUploading(false);
    toast.success("Image uploadée sur Cloudinary");
  };

  const handleDelete = () => {
    if (!deleteId) return;
    if (selected?.id === deleteId) setSelected(null);
    deleteMedia(deleteId);
    setDeleteId(null);
    toast.success("Image supprimée");
  };

  return (
    <div>
      <PageHeader
        eyebrow="Gestion"
        title="Médiathèque"
        description={`${media.length} fichier${media.length > 1 ? "s" : ""} stocké${media.length > 1 ? "s" : ""} sur Cloudinary.`}
        action={
          <Button loading={uploading} onClick={simulateUpload}>
            <Upload size={14} />
            {uploading ? "Upload..." : "Uploader"}
          </Button>
        }
      />

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); simulateUpload(); }}
        className={`border-2 border-dashed rounded-xl p-6 mb-6 text-center transition-all ${
          dragOver
            ? "border-[#3B82F6] bg-[#3B82F6]/05"
            : uploading
            ? "border-[#3B82F6]/40 bg-[#3B82F6]/03"
            : "border-[#1E1E1E] hover:border-[#262626]"
        }`}
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#A1A1AA] font-mono">Upload en cours vers Cloudinary...</p>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <Upload size={16} className="text-[#4B4B4B]" />
            <p className="text-sm text-[#A1A1AA]">
              Glissez des images ici ou{" "}
              <button onClick={simulateUpload} className="text-[#3B82F6] hover:underline">
                parcourez
              </button>
            </p>
            <span className="text-xs text-[#3B3B3B] font-mono">JPG PNG WebP · max 5MB</span>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B4B4B]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une image..."
          className="w-full bg-[#111111] border border-[#262626] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#4B4B4B] font-mono outline-none focus:border-[#3B82F6] transition-colors"
        />
      </div>

      <div className={`grid gap-5 ${selected ? "grid-cols-1 lg:grid-cols-[1fr_240px]" : ""}`}>
        {/* Grid */}
        <div>
          {filtered.length === 0 ? (
            <EmptyState
              title={search ? "Aucun résultat" : "Médiathèque vide"}
              description={search ? `Aucun fichier ne correspond à "${search}".` : "Uploadez vos premières images."}
              action={
                !search ? (
                  <Button size="sm" onClick={simulateUpload}>
                    <Upload size={13} /> Uploader
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelected(selected?.id === item.id ? null : item)}
                  className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    selected?.id === item.id
                      ? "border-[#3B82F6]"
                      : "border-transparent hover:border-[#262626]"
                  }`}
                >
                  <div className="aspect-square bg-[#1A1A1A]">
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                    />
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <p className="text-[10px] text-white font-mono truncate w-full">{item.filename}</p>
                  </div>
                  {/* Delete */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-[#0A0A0A]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[#A1A1AA] hover:text-red-400 transition-all"
                    aria-label="Supprimer"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <MediaDetail
            item={selected}
            onDelete={(id) => setDeleteId(id)}
            onClose={() => setSelected(null)}
          />
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Supprimer cette image ?"
        description="Elle sera supprimée de Cloudinary et ne pourra pas être récupérée."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
