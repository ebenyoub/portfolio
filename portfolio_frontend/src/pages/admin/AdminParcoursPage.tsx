import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { GraduationCap, Plus, Trash2, Edit2, X } from "lucide-react";
import useFetch from "../../hooks/apiFetch";

const parcoursSchema = z.object({
  year: z.string().trim().min(1, "L'année est requise"),
  title: z.string().trim().min(2, "Le titre est requis"),
  subtitle: z.string().trim().optional(),
  description: z.string().trim().optional(),
  badge: z.string().trim().optional(),
  current: z.boolean().default(false),
});

interface ParcoursItem {
  id: number;
  year: string;
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  current: boolean | number;
}

export default function AdminParcoursPage() {
  const { apiFetch, isLoading } = useFetch();
  const [items, setItems] = useState<ParcoursItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ParcoursItem | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(parcoursSchema),
    defaultValues: {
      year: "",
      title: "",
      subtitle: "",
      description: "",
      badge: "",
      current: false,
    },
  });

  useEffect(() => {
    const fetchParcours = async () => {
      try {
        const response = await apiFetch("/parcours");
        setItems(response.data || []);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    };
    fetchParcours();
  }, [apiFetch, refreshTrigger]);

  const openAddModal = () => {
    setEditingItem(null);
    reset({
      year: "",
      title: "",
      subtitle: "",
      description: "",
      badge: "",
      current: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: ParcoursItem) => {
    setEditingItem(item);
    reset({
      year: item.year,
      title: item.title,
      subtitle: item.subtitle || "",
      description: item.description || "",
      badge: item.badge || "",
      current: item.current === 1 || item.current === true,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (values: Record<string, unknown>) => {
    try {
      if (editingItem) {
        await apiFetch(`/parcours/${editingItem.id}`, {
          method: "PUT",
          body: JSON.stringify(values),
        });
        toast.success("Étape mise à jour avec succès.");
      } else {
        await apiFetch("/parcours", {
          method: "POST",
          body: JSON.stringify(values),
        });
        toast.success("Étape ajoutée avec succès.");
      }
      setIsModalOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const onDelete = async (item: ParcoursItem) => {
    if (!window.confirm(`Supprimer l'étape "${item.title}" ?`)) return;
    try {
      await apiFetch(`/parcours/${item.id}`, {
        method: "DELETE",
      });
      toast.success("Étape supprimée.");
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
            Gestion du Parcours
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-1.5">
            Gérez la timeline de vos formations et expériences professionnelles.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-[#3B82F6] text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#2563EB] transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          Ajouter une étape
        </button>
      </div>

      {/* Table / List */}
      <div className="bg-[#111111] border border-[#262626] rounded-xl overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="p-12 text-center text-sm text-[#A1A1AA] font-mono animate-pulse">
            Chargement du parcours...
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <GraduationCap size={40} className="mx-auto text-[#4B4B4B] mb-3" />
            <p className="text-sm font-medium text-white mb-1">Aucune étape de parcours</p>
            <p className="text-xs text-[#A1A1AA] font-mono mb-4">Commencez par ajouter votre première formation ou expérience.</p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 text-xs text-[#3B82F6] hover:text-[#60A5FA] font-mono"
            >
              Ajouter une étape maintenant
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#262626] bg-[#0A0A0A] text-xs font-mono text-[#A1A1AA] uppercase tracking-wider">
                  <th className="px-6 py-4">Années</th>
                  <th className="px-6 py-4">Titre / Rôle</th>
                  <th className="px-6 py-4">Structure</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F1F]">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-[#151515] transition-colors text-sm text-[#E5E7EB]">
                    <td className="px-6 py-4 font-mono text-xs">{item.year}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{item.title}</div>
                      {item.description && (
                        <p className="text-xs text-[#A1A1AA] mt-1 line-clamp-1 max-w-sm">{item.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[#A1A1AA]">{item.subtitle || "-"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${
                        item.current === 1 || item.current === true
                          ? "border-[#3B82F6]/40 bg-[#3B82F6]/10 text-[#60A5FA]"
                          : "border-[#262626] bg-[#1A1A1A] text-[#A1A1AA]"
                      }`}>
                        {item.badge || (item.current ? "Actif" : "Terminé")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-md hover:bg-[#262626] text-[#A1A1AA] hover:text-white transition-colors"
                          aria-label="Modifier"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(item)}
                          className="p-1.5 rounded-md hover:bg-[#262626] text-[#A1A1AA] hover:text-red-400 transition-colors"
                          aria-label="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-[#111111] border border-[#262626] rounded-2xl p-6 shadow-2xl z-10 animate-scale-up">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#262626]">
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
                {editingItem ? "Modifier l'étape" : "Ajouter une étape"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#A1A1AA] hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-white uppercase tracking-wider font-mono">
                    Années <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 2025 ou 2023–2024"
                    {...register("year")}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white focus:border-[#3B82F6] outline-none font-mono"
                  />
                  {errors.year && <p className="text-[11px] text-red-400 font-mono mt-1">{errors.year.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-white uppercase tracking-wider font-mono">
                    Badge de statut
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: En cours, Diplôme"
                    {...register("badge")}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white focus:border-[#3B82F6] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-white uppercase tracking-wider font-mono">
                  Titre / Rôle <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: ESGI — Bachelor 3"
                  {...register("title")}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#3B82F6] outline-none font-semibold"
                />
                {errors.title && <p className="text-[11px] text-red-400 font-mono mt-1">{errors.title.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-white uppercase tracking-wider font-mono">
                  Structure / Subtitle
                </label>
                <input
                  type="text"
                  placeholder="Ex: Ingénierie du Web"
                  {...register("subtitle")}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white focus:border-[#3B82F6] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-white uppercase tracking-wider font-mono">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Détaillez le programme ou les tâches..."
                  {...register("description")}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#3B82F6] outline-none font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="current"
                  {...register("current")}
                  className="w-4 h-4 rounded border-[#262626] bg-[#0A0A0A] text-[#3B82F6] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="current" className="text-sm text-[#E5E7EB] select-none cursor-pointer">
                  Étape en cours de réalisation (timeline active)
                </label>
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
