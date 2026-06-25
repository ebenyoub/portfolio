import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Cpu, Plus, Trash2, Edit2, X } from "lucide-react";
import useFetch from "../../hooks/apiFetch";

const competencesSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis"),
  category: z.string().trim().min(1, "La catégorie est requise"),
  level: z.coerce.number().min(0, "Niveau min 0").max(100, "Niveau max 100"),
  display_order: z.coerce.number().default(0),
});

interface CompetenceItem {
  id: number;
  name: string;
  category: string;
  level: number;
  display_order: number;
}

const CATEGORIES = ["Frontend", "Backend", "Base de données", "DevOps", "Outils"];

export default function AdminCompetencesPage() {
  const { apiFetch, isLoading } = useFetch();
  const [items, setItems] = useState<CompetenceItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CompetenceItem | null>(null);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(competencesSchema),
    defaultValues: {
      name: "",
      category: "Frontend",
      level: 80,
      display_order: 0,
    },
  });

  useEffect(() => {
    const fetchCompetences = async () => {
      try {
        const response = await apiFetch("/competences");
        setItems(response.data || []);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    };
    fetchCompetences();
  }, [apiFetch, refreshTrigger]);

  const openAddModal = () => {
    setEditingItem(null);
    reset({
      name: "",
      category: "Frontend",
      level: 80,
      display_order: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: CompetenceItem) => {
    setEditingItem(item);
    reset({
      name: item.name,
      category: item.category,
      level: item.level,
      display_order: item.display_order,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (values: Record<string, unknown>) => {
    try {
      if (editingItem) {
        await apiFetch(`/competences/${editingItem.id}`, {
          method: "PUT",
          body: JSON.stringify(values),
        });
        toast.success("Compétence mise à jour.");
      } else {
        await apiFetch("/competences", {
          method: "POST",
          body: JSON.stringify(values),
        });
        toast.success("Compétence ajoutée.");
      }
      setIsModalOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const onDelete = async (item: CompetenceItem) => {
    if (!window.confirm(`Supprimer la compétence "${item.name}" ?`)) return;
    try {
      await apiFetch(`/competences/${item.id}`, {
        method: "DELETE",
      });
      toast.success("Compétence supprimée.");
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-[#3B82F6] tracking-widest uppercase mb-1.5">Administration</p>
          <h1 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "Manrope, sans-serif" }}>
            Gestion des Compétences
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-1.5">
            Gérez la grille de compétences techniques affichée sur la page d'accueil.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-[#3B82F6] text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#2563EB] transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          Ajouter une compétence
        </button>
      </div>

      {/* Grid by category */}
      {isLoading ? (
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-12 text-center text-sm text-[#A1A1AA] font-mono animate-pulse">
          Chargement des compétences...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-12 text-center">
          <Cpu size={40} className="mx-auto text-[#4B4B4B] mb-3" />
          <p className="text-sm font-medium text-white mb-1">Aucune compétence enregistrée</p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 text-xs text-[#3B82F6] hover:text-[#60A5FA] font-mono mt-2"
          >
            Créer une compétence maintenant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORIES.map((category) => {
            const catItems = items.filter((item) => item.category === category);
            if (catItems.length === 0) return null;
            return (
              <div key={category} className="bg-[#111111] border border-[#262626] rounded-xl overflow-hidden shadow-xl flex flex-col h-full">
                <div className="px-5 py-3 border-b border-[#262626] bg-[#0A0A0A] flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">{category}</h3>
                  <span className="text-[10px] font-mono text-[#6B7280]">{catItems.length} skills</span>
                </div>
                <div className="p-4 flex-1 space-y-3">
                  {catItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg border border-[#1C1C1C] hover:border-[#2C2C2C] transition-colors group">
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-white truncate">{item.name}</span>
                          <span className="text-[10px] font-mono text-[#6B7280]">Ordre: {item.display_order}</span>
                        </div>
                        <div className="w-full bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#3B82F6] h-full rounded-full transition-all duration-500" style={{ width: `${item.level}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1 rounded-md text-[#6B7280] hover:text-white hover:bg-[#1A1A1A] transition-colors"
                          aria-label="Modifier"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => onDelete(item)}
                          className="p-1 rounded-md text-[#6B7280] hover:text-red-400 hover:bg-[#1A1A1A] transition-colors"
                          aria-label="Supprimer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#111111] border border-[#262626] rounded-2xl p-6 shadow-2xl z-10 animate-scale-up">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#262626]">
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
                {editingItem ? "Modifier la compétence" : "Ajouter une compétence"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#A1A1AA] hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-white uppercase tracking-wider font-mono">
                  Nom de la technologie <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: React, Docker, PHP"
                  {...register("name")}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white focus:border-[#3B82F6] outline-none"
                />
                {errors.name && <p className="text-[11px] text-red-400 font-mono mt-1">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-white uppercase tracking-wider font-mono">
                    Catégorie <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("category")}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white focus:border-[#3B82F6] outline-none cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-white uppercase tracking-wider font-mono">
                    Ordre d'affichage
                  </label>
                  <input
                    type="number"
                    {...register("display_order")}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white focus:border-[#3B82F6] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-white uppercase tracking-wider font-mono">
                    Niveau de maîtrise (0-100) <span className="text-red-500">*</span>
                  </label>
                </div>
                <input
                  type="number"
                  placeholder="Ex: 85"
                  {...register("level")}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white focus:border-[#3B82F6] outline-none font-mono"
                />
                {errors.level && <p className="text-[11px] text-red-400 font-mono mt-1">{errors.level.message}</p>}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#262626] mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-[#A1A1AA] hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#3B82F6] text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-[#2563EB] transition-colors disabled:opacity-60"
                >
                  {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
