import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Image as ImageIcon, Trash2, X, Search, Loader2, UploadCloud, CheckCircle2 } from "lucide-react";
import useFetch from "../hooks/apiFetch";
import { uploadImageToCloudinary } from "../services/cloudinary";

interface MediaItem {
  id: number;
  name: string;
  url: string;
  public_id?: string;
  created_at: string;
}

type MediaPickerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
};

export default function MediaPickerModal({ isOpen, onClose, onSelect }: MediaPickerModalProps) {
  const { apiFetch, isLoading } = useFetch();
  const [medias, setMedias] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  
  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch medias list
  useEffect(() => {
    if (!isOpen) return;

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
  }, [apiFetch, refreshTrigger, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
      const response = await apiFetch("/medias", {
        method: "POST",
        body: JSON.stringify({
          name: file.name,
          url: result.secure_url,
          public_id: result.public_id,
        }),
      });

      toast.success("Image importée et enregistrée avec succès !", { id: toastId });
      setRefreshTrigger((prev) => prev + 1);
      
      // Automatically switch to library tab to show the new media
      setActiveTab("library");
      
      // Select the newly uploaded item
      if (response.data) {
        setSelectedItem(response.data);
      }
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

  const handleDelete = async (media: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Supprimer le média "${media.name}" ?`)) return;
    try {
      await apiFetch(`/medias/${media.id}`, {
        method: "DELETE",
      });
      toast.success("Média supprimé.");
      if (selectedItem?.id === media.id) {
        setSelectedItem(null);
      }
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const filteredMedias = medias.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Dialog Content Container */}
      <div className="relative bg-[#111111] border border-[#262626] rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626]">
          <h2 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: "Manrope, sans-serif" }}>
            Sélectionner un média
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#A1A1AA] hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-[#262626] bg-[#0d0d0d] px-6">
          <button
            type="button"
            onClick={() => setActiveTab("library")}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "library"
                ? "border-[#3B82F6] text-white"
                : "border-transparent text-[#A1A1AA] hover:text-white"
            }`}
          >
            Médiathèque
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "upload"
                ? "border-[#3B82F6] text-white"
                : "border-transparent text-[#A1A1AA] hover:text-white"
            }`}
          >
            Uploader un fichier
          </button>
        </div>

        {/* Workspace Body Area */}
        <div className="flex-1 flex overflow-hidden">
          {activeTab === "library" ? (
            <div className="flex-1 flex overflow-hidden">
              {/* Left Column: Grid list & Search */}
              <div className="flex-1 flex flex-col p-6 overflow-hidden">
                <div className="relative mb-4 shrink-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B4B4B]" size={16} />
                  <input
                    type="text"
                    placeholder="Rechercher par nom..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#4B4B4B] font-mono outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>

                {isLoading ? (
                  <div className="flex-1 flex items-center justify-center text-sm text-[#A1A1AA] font-mono">
                    <Loader2 className="animate-spin text-[#3B82F6] mr-2" size={16} />
                    Chargement des médias...
                  </div>
                ) : filteredMedias.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <ImageIcon size={36} className="text-[#4B4B4B] mb-2" />
                    <p className="text-sm font-semibold text-white">Aucun média trouvé</p>
                    <p className="text-xs text-[#A1A1AA] mt-1 font-mono">Téléversez des images ou affinez votre recherche.</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto pr-1">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {filteredMedias.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className={`group relative aspect-video bg-[#0A0A0A] border rounded-xl overflow-hidden cursor-pointer transition-all select-none ${
                            selectedItem?.id === item.id
                              ? "border-[#3B82F6] ring-2 ring-[#3B82F6]/20 scale-[0.98]"
                              : "border-[#262626] hover:border-[#363636]"
                          }`}
                        >
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                          <button
                            type="button"
                            onClick={(e) => handleDelete(item, e)}
                            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Preview & details panel */}
              <div className="w-80 border-l border-[#262626] bg-[#0d0d0d] flex flex-col p-6 overflow-y-auto select-none shrink-0">
                {selectedItem ? (
                  <div className="space-y-6 flex-1 flex flex-col">
                    <div className="space-y-3">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-[#3B82F6]">Aperçu du média</p>
                      <div className="aspect-video rounded-xl overflow-hidden border border-[#262626] bg-[#0A0A0A]">
                        <img src={selectedItem.url} alt={selectedItem.name} className="w-full h-full object-contain" />
                      </div>
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <p className="text-xs font-semibold text-white truncate" title={selectedItem.name}>{selectedItem.name}</p>
                      <p className="text-[10px] font-mono text-[#6B7280]">Importé le {new Date(selectedItem.created_at).toLocaleDateString()}</p>
                    </div>

                    <div className="mt-auto space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          onSelect(selectedItem.url);
                          onClose();
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer"
                      >
                        <CheckCircle2 size={15} />
                        Utiliser cette image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-xs text-[#A1A1AA] font-mono">
                    Sélectionnez une image à gauche pour voir les détails et l'utiliser.
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Upload view content */
            <div className="flex-1 p-6 flex flex-col overflow-hidden">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`flex-1 border-2 border-dashed rounded-2xl text-center p-12 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer ${
                  isDragging
                    ? "border-[#3B82F6] bg-[#3B82F6]/5"
                    : "border-[#262626] bg-[#0d0d0d] hover:border-[#3B82F6]/50 hover:bg-[#111111]"
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
                    <Loader2 size={36} className="animate-spin text-[#3B82F6] mx-auto" />
                    <p className="text-sm font-semibold text-white">Téléversement vers Cloudinary...</p>
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
                    <div className="p-4 bg-[#262626] rounded-full text-[#A1A1AA]">
                      <UploadCloud size={28} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Glissez-déposez une image ici</p>
                      <p className="text-xs text-[#A1A1AA] mt-1.5">Ou cliquez pour parcourir vos fichiers (max 5 Mo)</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
