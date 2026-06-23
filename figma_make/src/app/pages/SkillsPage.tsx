import { useState } from "react";
import { Plus, Trash2, Code2, Server, Database, Layers, Wrench } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "../lib/context";
import type { Skill, SkillCategory } from "../lib/types";
import {
  Button,
  FormField,
  Input,
  PageHeader,
  EmptyState,
  ConfirmDialog,
} from "../components/AdminUI";

const CATEGORIES: { key: SkillCategory; label: string; icon: React.ElementType; color: string; bg: string }[] = [
  { key: "frontend", label: "Frontend", icon: Code2, color: "#3B82F6", bg: "rgba(59,130,246,0.08)" },
  { key: "backend", label: "Backend", icon: Server, color: "#8B5CF6", bg: "rgba(139,92,246,0.08)" },
  { key: "database", label: "Database", icon: Database, color: "#10B981", bg: "rgba(16,185,129,0.08)" },
  { key: "devops", label: "DevOps", icon: Layers, color: "#F59E0B", bg: "rgba(245,158,11,0.08)" },
  { key: "tools", label: "Outils", icon: Wrench, color: "#EC4899", bg: "rgba(236,72,153,0.08)" },
];

function AddSkillModal({
  onSave,
  onClose,
}: {
  onSave: (skill: Omit<Skill, "id">) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<SkillCategory>("frontend");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#111111] border border-[#262626] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h2
          className="text-base font-bold text-white mb-5"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          Nouvelle compétence
        </h2>
        <div className="space-y-4">
          <FormField label="Nom" required>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="React, Docker, MySQL..."
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && name.trim()) {
                  onSave({ name: name.trim(), category, order: 0 });
                }
              }}
            />
          </FormField>
          <FormField label="Catégorie">
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategory(cat.key)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all ${
                      category === cat.key
                        ? "border-[#3B82F6]/40 bg-[#3B82F6]/08 text-white"
                        : "border-[#262626] text-[#A1A1AA] hover:border-[#363636] hover:text-white"
                    }`}
                  >
                    <Icon size={14} style={{ color: category === cat.key ? cat.color : undefined }} />
                    <span className="text-xs" style={{ fontFamily: "Manrope, sans-serif" }}>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </FormField>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button
            size="sm"
            disabled={!name.trim()}
            onClick={() => onSave({ name: name.trim(), category, order: 0 })}
          >
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SkillsPage() {
  const { skills, addSkill, deleteSkill } = useApp();
  const [activeTab, setActiveTab] = useState<SkillCategory | "all">("all");
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = activeTab === "all" ? skills : skills.filter((s) => s.category === activeTab);

  const grouped = CATEGORIES.reduce<Record<SkillCategory, Skill[]>>(
    (acc, cat) => ({
      ...acc,
      [cat.key]: filtered.filter((s) => s.category === cat.key),
    }),
    {} as Record<SkillCategory, Skill[]>
  );

  const handleSave = (s: Omit<Skill, "id">) => {
    addSkill({ ...s, order: skills.filter((x) => x.category === s.category).length + 1 });
    toast.success(`${s.name} ajouté`);
    setShowModal(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    const s = skills.find((x) => x.id === deleteId);
    deleteSkill(deleteId);
    setDeleteId(null);
    toast.success(`${s?.name} supprimé`);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Gestion"
        title="Compétences"
        description={`${skills.length} compétences réparties en ${CATEGORIES.length} catégories.`}
        action={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={14} />
            Nouvelle compétence
          </Button>
        }
      />

      {/* Category filter tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#1A1A1A] overflow-x-auto pb-0">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
            activeTab === "all"
              ? "border-[#3B82F6] text-white"
              : "border-transparent text-[#A1A1AA] hover:text-white"
          }`}
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          Toutes ({skills.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = skills.filter((s) => s.category === cat.key).length;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                activeTab === cat.key
                  ? "border-[#3B82F6] text-white"
                  : "border-transparent text-[#A1A1AA] hover:text-white"
              }`}
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Aucune compétence"
          description="Ajoutez vos premières compétences."
          action={
            <Button size="sm" onClick={() => setShowModal(true)}>
              <Plus size={13} /> Ajouter
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          {(activeTab === "all" ? CATEGORIES : CATEGORIES.filter((c) => c.key === activeTab)).map(
            (cat) => {
              const catSkills = grouped[cat.key];
              if (!catSkills || catSkills.length === 0) return null;
              const Icon = cat.icon;
              return (
                <div key={cat.key}>
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: cat.bg, border: `1px solid ${cat.color}20` }}
                    >
                      <Icon size={14} style={{ color: cat.color }} />
                    </div>
                    <span
                      className="text-sm font-semibold text-white"
                      style={{ fontFamily: "Manrope, sans-serif" }}
                    >
                      {cat.label}
                    </span>
                    <span className="text-xs text-[#4B4B4B] font-mono">
                      {catSkills.length} skill{catSkills.length > 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Skills grid */}
                  <div className="flex flex-wrap gap-2">
                    {catSkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="group flex items-center gap-2 bg-[#111111] border border-[#262626] rounded-xl px-3.5 py-2.5 hover:border-[#2E2E2E] transition-all"
                      >
                        <span
                          className="text-sm font-medium text-white"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {skill.name}
                        </span>
                        <button
                          onClick={() => setDeleteId(skill.id)}
                          className="opacity-0 group-hover:opacity-100 text-[#4B4B4B] hover:text-red-400 transition-all ml-1"
                          aria-label={`Supprimer ${skill.name}`}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setShowModal(true);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2.5 border border-dashed border-[#262626] rounded-xl text-xs text-[#4B4B4B] hover:text-[#3B82F6] hover:border-[#3B82F6]/30 transition-all font-mono"
                    >
                      <Plus size={12} />
                      Ajouter
                    </button>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}

      {showModal && (
        <AddSkillModal onSave={handleSave} onClose={() => setShowModal(false)} />
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Supprimer cette compétence ?"
        description="Elle sera retirée du portfolio public."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
