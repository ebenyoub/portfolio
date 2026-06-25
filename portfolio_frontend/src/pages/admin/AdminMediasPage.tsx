import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Image as ImageIcon, Trash2, Copy, ExternalLink, Loader2, UploadCloud } from "lucide-react";
import useFetch from "../../hooks/apiFetch";
import { uploadImageToCloudinary } from "../../services/cloudinary";

interface MediaItem {
  id: number;
  name: string;
  url: string;
  public_id?: string;
  created_at: string;
}

export default function AdminMediasPage() {
  const { apiFetch, isLoading } = useFetch();
  const [medias, setMedias] = useState<MediaItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchMedias = async () => {
      try {
        const response = await apiFetch("/medias");
        setMedias(response.data || []);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    };
    fetchMedias();
  }, [apiFetch, refreshTrigger]);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    const toastId = toast.loading(`Upload en cours (${0}%)...`);
    try {
      // 1. Upload to Cloudinary with real progress updates
      const result = await uploadImageToCloudinary(file, (percent) => {
        setUploadProgress(percent);
        toast.loading(`Upload en cours (${percent}%)...`, { id: toastId });
      });
      
      // 2. Save metadata to MySQL backend
      await apiFetch("/medias", {
        method: "POST",
        body: JSON.stringify({
          name: file.name,
          url: result.secure_url,
          public_id: result.public_id,
        }),
      });

      toast.success("Image importée et enregistrée avec succès !", { id: toastId });
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erreur lors de l'importation.";
      toast.error(msg, { id: toastId });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      uploadFile(file);
    } else {
      toast.error("Veuillez déposer un fichier image valide.");
    }
  };

  const handleDelete = async (media: MediaItem) => {
    if (!window.confirm(`Supprimer le média "${media.name}" ?`)) return;
    try {
      await apiFetch(`/medias/${media.id}`, {
        method: "DELETE",
      });
      toast.success("Média supprimé.");
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Lien copié dans le presse-papiers !");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-[#3B82F6] tracking-widest uppercase mb-1.5">Administration</p>
          <h1 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "Manrope, sans-serif" }}>
            Médiathèque
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-1.5">
            Téléversez et gérez les captures d'écran et ressources graphiques de vos projets.
          </p>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-3 ${
          isDragging
            ? "border-[#3B82F6] bg-[#3B82F6]/5"
            : "border-[#262626] bg-[#111111] hover:border-[#3B82F6]/50 hover:bg-[#161616]"
        } ${isUploading ? "opacity-60 pointer-events-none" : ""}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="w-full max-w-xs space-y-3">
            <Loader2 size={32} className="animate-spin text-[#3B82F6] mx-auto" />
            <p className="text-sm font-semibold text-white">Téléversement en cours...</p>
            <div className="w-full bg-[#262626] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#3B82F6] h-full transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-[#A1A1AA] font-mono">{uploadProgress}%</p>
          </div>
        ) : (
          <>
            <div className="p-3 bg-[#262626] rounded-full text-[#A1A1AA] group-hover:text-[#3B82F6] transition-colors">
              <UploadCloud size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Glissez-déposez une image ici</p>
              <p className="text-xs text-[#A1A1AA] mt-1">Ou cliquez pour parcourir vos fichiers (max 5 Mo)</p>
            </div>
          </>
        )}
      </div>

      {/* Grid of images */}
      {isLoading ? (
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-12 text-center text-sm text-[#A1A1AA] font-mono animate-pulse">
          Chargement des médias...
        </div>
      ) : medias.length === 0 ? (
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-12 text-center">
          <ImageIcon size={40} className="mx-auto text-[#4B4B4B] mb-3" />
          <p className="text-sm font-medium text-white mb-1">Médiathèque vide</p>
          <p className="text-xs text-[#A1A1AA] font-mono">
            Vos images apparaîtront ici une fois téléversées.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {medias.map((media) => (
            <div key={media.id} className="group bg-[#111111] border border-[#262626] rounded-xl overflow-hidden shadow-md flex flex-col hover:border-[#363636] transition-all">
              <div className="relative aspect-video bg-[#0A0A0A] overflow-hidden flex items-center justify-center">
                <img
                  src={media.url}
                  alt={media.name}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 select-none"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => copyToClipboard(media.url)}
                    className="p-2 bg-[#262626] hover:bg-[#3B82F6] hover:text-white rounded-lg text-white transition-colors"
                    title="Copier le lien"
                  >
                    <Copy size={14} />
                  </button>
                  <a
                    href={media.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#262626] hover:bg-[#3B82F6] hover:text-white rounded-lg text-white transition-colors"
                    title="Ouvrir l'image"
                  >
                    <ExternalLink size={14} />
                  </a>
                  <button
                    onClick={() => handleDelete(media)}
                    className="p-2 bg-[#262626] hover:bg-red-600 hover:text-white rounded-lg text-white transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-3 min-w-0">
                <p className="text-xs font-semibold text-white truncate" title={media.name}>
                  {media.name}
                </p>
                <p className="text-[10px] font-mono text-[#6B7280] mt-0.5">
                  {new Date(media.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
