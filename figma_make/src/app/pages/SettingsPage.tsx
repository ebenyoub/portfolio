import { useState } from "react";
import { Save, Upload, FileText, Globe, User, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "../lib/context";
import type { SiteSettings } from "../lib/types";
import {
  Button,
  FormField,
  Input,
  Textarea,
  Toggle,
  Card,
  SectionDivider,
} from "../components/AdminUI";

type Tab = "hero" | "contact" | "cv" | "seo";

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "hero", label: "Hero", icon: Globe },
  { key: "contact", label: "Contact", icon: User },
  { key: "cv", label: "CV", icon: FileText },
  { key: "seo", label: "SEO", icon: Globe },
];

export default function SettingsPage() {
  const { settings, updateSettings } = useApp();
  const [form, setForm] = useState<SiteSettings>(settings);
  const [activeTab, setActiveTab] = useState<Tab>("hero");
  const [saving, setSaving] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    updateSettings(form);
    setIsDirty(false);
    setSaving(false);
    toast.success("Paramètres sauvegardés");
  };

  const simulateCvUpload = async () => {
    setCvUploading(true);
    await new Promise((r) => setTimeout(r, 1500));
    set("cvFilename", "elyas-benyoub-cv-2025.pdf");
    setCvUploading(false);
    toast.success("CV mis à jour");
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-mono text-[#3B82F6] tracking-widest uppercase mb-1.5">
            Configuration
          </p>
          <h1
            className="text-2xl font-bold text-white tracking-tight"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            Paramètres du site
          </h1>
        </div>
        {isDirty && (
          <Button loading={saving} onClick={handleSave}>
            <Save size={14} />
            Sauvegarder
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-7 border-b border-[#1A1A1A] overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                activeTab === tab.key
                  ? "border-[#3B82F6] text-white"
                  : "border-transparent text-[#A1A1AA] hover:text-white"
              }`}
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Hero */}
      {activeTab === "hero" && (
        <div className="max-w-2xl space-y-6">
          <div className="flex items-center gap-3 p-4 bg-[#111111] border border-[#262626] rounded-xl">
            <div className="flex-1">
              <p className="text-sm font-medium text-white mb-0.5" style={{ fontFamily: "Manrope, sans-serif" }}>
                Statut de disponibilité
              </p>
              <p className="text-xs text-[#A1A1AA]">Affiché comme badge "Disponible pour une alternance"</p>
            </div>
            <Toggle
              checked={form.heroAvailable}
              onChange={(v) => set("heroAvailable", v)}
            />
          </div>

          {form.heroAvailable && (
            <div className="flex items-center gap-2 bg-emerald-500/06 border border-emerald-500/20 rounded-xl px-4 py-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs text-emerald-400 font-mono">
                Badge vert actif — visible sur le portfolio public
              </p>
            </div>
          )}

          <FormField label="Titre principal">
            <Textarea
              value={form.heroTitle}
              onChange={(e) => set("heroTitle", e.target.value)}
              rows={2}
              placeholder="Je développe des applications web modernes."
            />
            <div className="text-right text-[10px] text-[#4B4B4B] font-mono mt-1">
              {form.heroTitle.length} caractères
            </div>
          </FormField>

          <FormField label="Sous-titre / description" hint="Texte de présentation sous le titre principal">
            <Textarea
              value={form.heroSubtitle}
              onChange={(e) => set("heroSubtitle", e.target.value)}
              rows={3}
              placeholder="Elyas Benyoub — développeur Front-End & Full-Stack basé à Lyon..."
            />
          </FormField>

          <SectionDivider label="Aperçu" />

          <Card className="bg-[#0A0A0A]">
            <p className="text-xs font-mono text-[#4B4B4B] mb-3">Rendu hero section</p>
            <div className="inline-flex items-center gap-2 border border-[#262626] rounded-full px-3 py-1 mb-3">
              {form.heroAvailable && <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />}
              <span className="text-xs text-[#A1A1AA] font-mono">
                {form.heroAvailable ? "Disponible pour une alternance" : "Non disponible"}
              </span>
            </div>
            <p
              className="text-lg font-bold text-white leading-tight mb-2"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              {form.heroTitle || "Titre du hero"}
            </p>
            <p className="text-sm text-[#A1A1AA] leading-relaxed">
              {form.heroSubtitle || "Sous-titre..."}
            </p>
          </Card>
        </div>
      )}

      {/* Contact */}
      {activeTab === "contact" && (
        <div className="max-w-2xl space-y-5">
          <FormField label="Adresse email" required>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="elyas.benyoub@email.com"
            />
          </FormField>
          <FormField label="Localisation">
            <Input
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Lyon, France"
            />
          </FormField>
          <SectionDivider label="Réseaux sociaux" />
          <FormField label="GitHub">
            <div className="relative">
              <Input
                value={form.github}
                onChange={(e) => set("github", e.target.value)}
                placeholder="https://github.com/elyas-benyoub"
                className="pr-10"
              />
              {form.github && (
                <a
                  href={form.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white"
                >
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </FormField>
          <FormField label="LinkedIn">
            <div className="relative">
              <Input
                value={form.linkedin}
                onChange={(e) => set("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/elyas-benyoub"
                className="pr-10"
              />
              {form.linkedin && (
                <a
                  href={form.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white"
                >
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </FormField>
        </div>
      )}

      {/* CV */}
      {activeTab === "cv" && (
        <div className="max-w-2xl space-y-5">
          {form.cvFilename && (
            <div className="flex items-center gap-4 p-4 bg-[#111111] border border-[#262626] rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-[#3B82F6]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white font-mono truncate">{form.cvFilename}</p>
                <p className="text-xs text-[#A1A1AA] mt-0.5">PDF · Actif sur le portfolio</p>
              </div>
              <Button variant="ghost" size="sm" onClick={simulateCvUpload}>
                Remplacer
              </Button>
            </div>
          )}

          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
              cvUploading ? "border-[#3B82F6]/50 bg-[#3B82F6]/04" : "border-[#262626] hover:border-[#363636]"
            }`}
          >
            {cvUploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-[#A1A1AA] font-mono">Envoi en cours...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Upload size={28} className="text-[#4B4B4B]" />
                <div>
                  <p className="text-sm text-white font-medium" style={{ fontFamily: "Manrope, sans-serif" }}>
                    Glissez votre CV ici
                  </p>
                  <p className="text-xs text-[#A1A1AA] mt-1">ou</p>
                </div>
                <Button variant="secondary" size="sm" onClick={simulateCvUpload}>
                  Choisir un fichier PDF
                </Button>
                <p className="text-xs text-[#4B4B4B] font-mono">PDF uniquement · max 10MB</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEO */}
      {activeTab === "seo" && (
        <div className="max-w-2xl space-y-5">
          <FormField label="Title (balise &lt;title&gt;)" hint="Recommandé : 50–60 caractères">
            <Input
              value={form.seoTitle}
              onChange={(e) => set("seoTitle", e.target.value)}
              placeholder="Elyas Benyoub — Développeur Web Full-Stack"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-[#4B4B4B] font-mono">{form.seoTitle.length} / 60</span>
              {form.seoTitle.length > 60 && (
                <span className="text-[10px] text-amber-400 font-mono">Titre trop long</span>
              )}
            </div>
          </FormField>
          <FormField label="Meta description" hint="Recommandé : 150–160 caractères">
            <Textarea
              value={form.seoDescription}
              onChange={(e) => set("seoDescription", e.target.value)}
              rows={3}
              placeholder="Portfolio d'Elyas Benyoub, développeur React/TypeScript..."
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-[#4B4B4B] font-mono">{form.seoDescription.length} / 160</span>
              {form.seoDescription.length > 160 && (
                <span className="text-[10px] text-amber-400 font-mono">Description trop longue</span>
              )}
            </div>
          </FormField>
          <FormField label="Open Graph image" hint="URL de l'image pour les partages réseaux sociaux (1200×630px)">
            <Input
              value={form.ogImage}
              onChange={(e) => set("ogImage", e.target.value)}
              placeholder="https://res.cloudinary.com/..."
            />
          </FormField>

          <SectionDivider label="Aperçu Google" />

          <Card className="bg-[#0A0A0A]">
            <div className="space-y-1">
              <p className="text-xs text-[#4B4B4B] font-mono">elyas-benyoub.fr</p>
              <p className="text-sm text-[#3B82F6]" style={{ fontFamily: "Arial, sans-serif" }}>
                {form.seoTitle || "Titre de la page"}
              </p>
              <p className="text-xs text-[#A1A1AA]" style={{ fontFamily: "Arial, sans-serif" }}>
                {form.seoDescription || "Description de la page..."}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Floating save bar */}
      {isDirty && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#111111] border border-[#3B82F6]/30 rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-4">
          <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
          <p className="text-sm text-white font-mono">Modifications non sauvegardées</p>
          <Button size="sm" loading={saving} onClick={handleSave}>
            <Save size={13} />
            Sauvegarder
          </Button>
        </div>
      )}
    </div>
  );
}
