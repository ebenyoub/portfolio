import { useState } from "react";
import { Plus, Pencil, Trash2, GripVertical, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "../lib/context";
import type { CareerItem } from "../lib/types";
import {
  Button,
  FormField,
  Input,
  Textarea,
  PageHeader,
  Badge,
  EmptyState,
  ConfirmDialog,
  Toggle,
} from "../components/AdminUI";

const BADGES = ["Formation", "Diplôme", "En cours", "Stage", "Expérience"];

const BLANK: Omit<CareerItem, "id"> = {
  title: "",
  institution: "",
  period: "",
  description: "",
  badge: "Formation",
  order: 0,
  current: false,
};

function CareerModal({
  item,
  onSave,
  onClose,
}: {
  item: Omit<CareerItem, "id"> | null;
  onSave: (data: Omit<CareerItem, "id">) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<CareerItem, "id">>(item ?? BLANK);
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#111111] border border-[#262626] rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2
          className="text-base font-bold text-white mb-5"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          {item ? "Modifier l'étape" : "Nouvelle étape"}
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Titre" required>
              <Input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="École 42"
              />
            </FormField>
            <FormField label="Établissement">
              <Input
                value={form.institution}
                onChange={(e) => set("institution", e.target.value)}
                placeholder="42 Paris"
              />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Période">
              <Input
                value={form.period}
                onChange={(e) => set("period", e.target.value)}
                placeholder="2021 – 2022"
              />
            </FormField>
            <FormField label="Badge">
              <select
                value={form.badge}
                onChange={(e) => set("badge", e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2.5 text-sm text-white font-mono outline-none focus:border-[#3B82F6] transition-colors"
              >
                {BADGES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </FormField>
          </div>
          <FormField label="Description">
            <Textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Description de cette étape de formation..."
              rows={3}
            />
          </FormField>
          <Toggle
            checked={form.current}
            onChange={(v) => set("current", v)}
            label="Étape en cours"
          />
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (!form.title.trim()) return;
              onSave(form);
            }}
          >
            {item ? "Mettre à jour" : "Ajouter"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CareerPage() {
  const { career, addCareer, updateCareer, deleteCareer } = useApp();
  const [modalData, setModalData] = useState<{ item: Omit<CareerItem, "id"> | null; id?: string } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sorted = [...career].sort((a, b) => a.order - b.order);

  const handleSave = (data: Omit<CareerItem, "id">) => {
    if (modalData?.id) {
      updateCareer({ ...data, id: modalData.id });
      toast.success("Étape mise à jour");
    } else {
      addCareer({ ...data, order: career.length + 1 });
      toast.success("Étape ajoutée au parcours");
    }
    setModalData(null);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    const item = career.find((c) => c.id === deleteId);
    deleteCareer(deleteId);
    setDeleteId(null);
    toast.success(`"${item?.title}" supprimé`);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Gestion"
        title="Parcours"
        description="Gérez les étapes de votre formation et expérience."
        action={
          <Button onClick={() => setModalData({ item: null })}>
            <Plus size={14} />
            Nouvelle étape
          </Button>
        }
      />

      {sorted.length === 0 ? (
        <EmptyState
          title="Aucune étape"
          description="Ajoutez vos formations et expériences pour les afficher sur le portfolio."
          action={
            <Button size="sm" onClick={() => setModalData({ item: null })}>
              <Plus size={13} /> Ajouter
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {sorted.map((item) => (
            <div
              key={item.id}
              className="group bg-[#111111] border border-[#262626] rounded-xl p-5 hover:border-[#2E2E2E] transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Order handle */}
                <div className="flex-shrink-0 mt-0.5 text-[#3B3B3B] group-hover:text-[#4B4B4B] transition-colors cursor-grab">
                  <GripVertical size={16} />
                </div>

                {/* Year badge */}
                <div className="flex-shrink-0 w-14 text-right">
                  <span className="text-xs font-mono text-[#A1A1AA]">{item.period}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap mb-1">
                    <h3
                      className="text-sm font-bold text-white"
                      style={{ fontFamily: "Manrope, sans-serif" }}
                    >
                      {item.title}
                    </h3>
                    <Badge variant={item.current ? "info" : "neutral"}>
                      {item.badge}
                    </Badge>
                    {item.current && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-[#10B981]">
                        <CheckCircle size={11} />
                        En cours
                      </span>
                    )}
                  </div>
                  {item.institution && (
                    <p className="text-xs text-[#3B82F6] font-medium mb-1.5">{item.institution}</p>
                  )}
                  <p className="text-sm text-[#A1A1AA] leading-relaxed">{item.description}</p>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() =>
                      setModalData({
                        item: { title: item.title, institution: item.institution, period: item.period, description: item.description, badge: item.badge, order: item.order, current: item.current },
                        id: item.id,
                      })
                    }
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4B4B4B] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 transition-all"
                    aria-label="Modifier"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4B4B4B] hover:text-red-400 hover:bg-red-500/10 transition-all"
                    aria-label="Supprimer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalData !== null && (
        <CareerModal
          item={modalData.item}
          onSave={handleSave}
          onClose={() => setModalData(null)}
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Supprimer cette étape ?"
        description="Cette étape sera retirée du parcours affiché sur le portfolio."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
