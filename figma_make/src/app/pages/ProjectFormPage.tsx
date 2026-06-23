import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { ArrowLeft, Upload, X, Eye, EyeOff, Save, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "../lib/context";
import type { Project } from "../lib/types";
import {
  Button,
  FormField,
  Input,
  Textarea,
  ListInput,
  SectionDivider,
  Badge,
  Card,
  Toggle,
} from "../components/AdminUI";

const TABS = ["Informations", "Stack", "Étude de cas", "Médias", "Liens"] as const;
type Tab = (typeof TABS)[number];

const CATEGORIES = ["Full-Stack", "Frontend", "Backend", "Bas niveau", "Mobile"];
const STACK_SUGGESTIONS = [
  "React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js", "Express",
  "PHP", "MySQL", "Docker", "Git", "Redux", "JWT", "MiniLibX", "C", "Swagger",
];

const BLANK: Omit<Project, "id" | "updatedAt"> = {
  title: "", slug: "", shortDesc: "", description: "", image: "", gallery: [],
  stack: [], category: "Full-Stack", github: "", demo: "", status: "draft",
  context: "", objectives: [], architecture: "", challenges: [], solutions: [],
  results: "", learnings: [],
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function ProjectFormPage() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { projects, addProject, updateProject } = useApp();

  const existing = !isNew ? projects.find((p) => p.id === id) : null;

  const [form, setForm] = useState<Omit<Project, "id" | "updatedAt">>(
    existing ?? BLANK
  );
  const [activeTab, setActiveTab] = useState<Tab>("Informations");
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Project, string>>>({});

  useEffect(() => {
    if (!isNew && !existing) navigate("/projects", { replace: true });
  }, [isNew, existing, navigate]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleTitleChange = (v: string) => {
    set("title", v);
    if (!existing) set("slug", slugify(v));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = "Le titre est requis.";
    if (!form.shortDesc.trim()) e.shortDesc = "Le résumé est requis.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      setActiveTab("Informations");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    if (isNew) {
      addProject(form);
      toast.success("Projet créé avec succès");
    } else if (existing) {
      updateProject({ ...form, id: existing.id, updatedAt: existing.updatedAt });
      toast.success("Projet mis à jour");
    }
    setSaving(false);
    navigate("/projects");
  };

  const simulateUpload = async (url: string) => {
    setImageUploading(true);
    await new Promise((r) => setTimeout(r, 1200));
    set("image", url);
    setImageUploading(false);
    toast.success("Image chargée");
  };

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/projects"
            className="flex items-center gap-1.5 text-sm text-[#A1A1AA] hover:text-white transition-colors"
          >
            <ArrowLeft size={15} />
            Projets
          </Link>
          <span className="text-[#2E2E2E]">/</span>
          <span className="text-sm text-white font-medium" style={{ fontFamily: "Manrope, sans-serif" }}>
            {isNew ? "Nouveau projet" : (form.title || "Modifier")}
          </span>
          {!isNew && (
            <Badge variant={form.status === "published" ? "published" : "draft"}>
              {form.status === "published" ? "Publié" : "Brouillon"}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPreview(!preview)}
          >
            {preview ? <EyeOff size={13} /> : <Eye size={13} />}
            <span className="hidden sm:inline">{preview ? "Masquer" : "Aperçu"}</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              set("status", form.status === "published" ? "draft" : "published");
            }}
          >
            {form.status === "published" ? "Dépublier" : "Publier"}
          </Button>
          <Button size="sm" loading={saving} onClick={handleSave}>
            <Save size={13} />
            Sauvegarder
          </Button>
        </div>
      </div>

      <div className={`grid gap-6 ${preview ? "lg:grid-cols-[1fr_320px]" : ""}`}>
        {/* Form */}
        <div>
          {/* Tabs */}
          <div className="flex gap-1 mb-6 border-b border-[#1A1A1A] overflow-x-auto pb-0">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                  activeTab === tab
                    ? "border-[#3B82F6] text-white"
                    : "border-transparent text-[#A1A1AA] hover:text-white"
                }`}
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab: Informations */}
          {activeTab === "Informations" && (
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <FormField label="Titre" required error={errors.title}>
                  <Input
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Portfolio Personnel"
                  />
                </FormField>
                <FormField label="Slug" hint="Généré automatiquement">
                  <Input
                    value={form.slug}
                    onChange={(e) => set("slug", e.target.value)}
                    placeholder="portfolio-personnel"
                    className="opacity-70"
                  />
                </FormField>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <FormField label="Catégorie">
                  <select
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2.5 text-sm text-white font-mono outline-none focus:border-[#3B82F6] transition-colors"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Statut">
                  <div className="flex items-center gap-3 h-10">
                    <Toggle
                      checked={form.status === "published"}
                      onChange={(v) => set("status", v ? "published" : "draft")}
                      label={form.status === "published" ? "Publié" : "Brouillon"}
                    />
                  </div>
                </FormField>
              </div>
              <FormField label="Résumé court" required error={errors.shortDesc} hint="Affiché sur la carte projet (max 150 caractères)">
                <Textarea
                  value={form.shortDesc}
                  onChange={(e) => set("shortDesc", e.target.value)}
                  placeholder="Application full-stack avec React, Express et MySQL..."
                  rows={2}
                  maxLength={180}
                />
                <div className="text-right text-[10px] text-[#4B4B4B] font-mono mt-1">
                  {form.shortDesc.length}/180
                </div>
              </FormField>
              <FormField label="Description complète" hint="Description longue pour la page projet">
                <Textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Présentation détaillée du projet..."
                  rows={5}
                />
              </FormField>
            </div>
          )}

          {/* Tab: Stack */}
          {activeTab === "Stack" && (
            <div className="space-y-5">
              <FormField label="Technologies utilisées" hint="Cliquez sur une suggestion ou tapez un nom personnalisé">
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.stack.map((tech) => (
                    <span
                      key={tech}
                      className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#60A5FA] rounded-lg"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => set("stack", form.stack.filter((t) => t !== tech))}
                        className="text-[#60A5FA]/60 hover:text-[#60A5FA]"
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                  {form.stack.length === 0 && (
                    <span className="text-xs text-[#4B4B4B] font-mono">Aucune technologie sélectionnée</span>
                  )}
                </div>
                <SectionDivider label="Suggestions" />
                <div className="flex flex-wrap gap-2">
                  {STACK_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={form.stack.includes(s)}
                      onClick={() => set("stack", [...form.stack, s])}
                      className="text-xs font-mono px-2.5 py-1 border border-[#262626] rounded-lg text-[#A1A1AA] hover:text-white hover:border-[#3B82F6]/40 disabled:opacity-30 disabled:cursor-default transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <Input
                    placeholder="Technologie personnalisée..."
                    id="custom-tech"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const v = (e.target as HTMLInputElement).value.trim();
                        if (v && !form.stack.includes(v)) {
                          set("stack", [...form.stack, v]);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }
                    }}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    type="button"
                    onClick={() => {
                      const input = document.getElementById("custom-tech") as HTMLInputElement;
                      const v = input.value.trim();
                      if (v && !form.stack.includes(v)) {
                        set("stack", [...form.stack, v]);
                        input.value = "";
                      }
                    }}
                  >
                    Ajouter
                  </Button>
                </div>
              </FormField>
            </div>
          )}

          {/* Tab: Étude de cas */}
          {activeTab === "Étude de cas" && (
            <div className="space-y-6">
              <FormField label="Contexte" hint="Présentation du problème ou du besoin">
                <Textarea
                  value={form.context}
                  onChange={(e) => set("context", e.target.value)}
                  placeholder="Projet répondant à un besoin réel..."
                  rows={3}
                />
              </FormField>
              <FormField label="Objectifs">
                <ListInput
                  items={form.objectives}
                  onChange={(v) => set("objectives", v)}
                  placeholder="Objectif du projet..."
                />
              </FormField>
              <FormField label="Architecture" hint="Description de l'architecture technique">
                <Textarea
                  value={form.architecture}
                  onChange={(e) => set("architecture", e.target.value)}
                  placeholder="Frontend React + Backend Express + MySQL..."
                  rows={3}
                />
              </FormField>
              <div className="grid sm:grid-cols-2 gap-5">
                <FormField label="Difficultés rencontrées">
                  <ListInput
                    items={form.challenges}
                    onChange={(v) => set("challenges", v)}
                    placeholder="Difficulté technique..."
                  />
                </FormField>
                <FormField label="Solutions apportées">
                  <ListInput
                    items={form.solutions}
                    onChange={(v) => set("solutions", v)}
                    placeholder="Solution mise en place..."
                  />
                </FormField>
              </div>
              <FormField label="Résultats">
                <Textarea
                  value={form.results}
                  onChange={(e) => set("results", e.target.value)}
                  placeholder="Application en production, score Lighthouse 95+..."
                  rows={2}
                />
              </FormField>
              <FormField label="Ce que j'ai appris">
                <ListInput
                  items={form.learnings}
                  onChange={(v) => set("learnings", v)}
                  placeholder="Apprentissage clé..."
                />
              </FormField>
            </div>
          )}

          {/* Tab: Médias */}
          {activeTab === "Médias" && (
            <div className="space-y-6">
              <FormField label="Image principale" hint="Cloudinary — format recommandé 800×500px">
                {form.image ? (
                  <div className="relative">
                    <img
                      src={form.image}
                      alt="Aperçu"
                      className="w-full h-48 object-cover rounded-xl border border-[#262626]"
                    />
                    <button
                      onClick={() => set("image", "")}
                      className="absolute top-3 right-3 w-7 h-7 bg-[#0A0A0A]/80 border border-[#262626] rounded-lg flex items-center justify-center text-[#A1A1AA] hover:text-red-400 transition-colors"
                    >
                      <X size={13} />
                    </button>
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="info">Image définie</Badge>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      imageUploading
                        ? "border-[#3B82F6]/50 bg-[#3B82F6]/05"
                        : "border-[#262626] hover:border-[#363636]"
                    }`}
                  >
                    {imageUploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-[#A1A1AA] font-mono">Upload en cours...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <Upload size={24} className="text-[#4B4B4B]" />
                        <p className="text-sm text-[#A1A1AA]">Drag & drop ou</p>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            simulateUpload(
                              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop&auto=format"
                            )
                          }
                        >
                          Parcourir Cloudinary
                        </Button>
                        <p className="text-xs text-[#4B4B4B] font-mono">JPG, PNG, WebP · max 5MB</p>
                      </div>
                    )}
                  </div>
                )}
              </FormField>

              <FormField label="URL directe" hint="Ou collez une URL Cloudinary/Unsplash">
                <Input
                  value={form.image}
                  onChange={(e) => set("image", e.target.value)}
                  placeholder="https://res.cloudinary.com/..."
                />
              </FormField>
            </div>
          )}

          {/* Tab: Liens */}
          {activeTab === "Liens" && (
            <div className="space-y-5">
              <FormField label="Repository GitHub" hint="Lien vers le code source">
                <div className="relative">
                  <Input
                    value={form.github}
                    onChange={(e) => set("github", e.target.value)}
                    placeholder="https://github.com/elyas/..."
                    className="pr-10"
                  />
                  {form.github && (
                    <a
                      href={form.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </FormField>
              <FormField label="Démo en ligne" hint="URL de la démo déployée (optionnel)">
                <div className="relative">
                  <Input
                    value={form.demo}
                    onChange={(e) => set("demo", e.target.value)}
                    placeholder="https://..."
                    className="pr-10"
                  />
                  {form.demo && (
                    <a
                      href={form.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </FormField>
            </div>
          )}
        </div>

        {/* Preview panel */}
        {preview && (
          <div className="lg:sticky lg:top-0 self-start">
            <Card>
              <p className="text-[10px] font-mono text-[#4B4B4B] uppercase tracking-widest mb-3">
                Aperçu carte
              </p>
              <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl overflow-hidden">
                <div className="h-36 bg-[#1A1A1A] overflow-hidden relative">
                  {form.image && (
                    <img src={form.image} alt="" className="w-full h-full object-cover opacity-50" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
                  <div className="absolute top-2 right-2">
                    <Badge variant={form.status === "published" ? "published" : "draft"}>
                      {form.status === "published" ? "Publié" : "Brouillon"}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm font-bold text-white mb-1.5" style={{ fontFamily: "Manrope, sans-serif" }}>
                    {form.title || "Titre du projet"}
                  </p>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed mb-3 line-clamp-2">
                    {form.shortDesc || "Résumé du projet..."}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(form.stack.length ? form.stack : ["Stack"]).slice(0, 3).map((t) => (
                      <span key={t} className="text-[10px] font-mono px-2 py-0.5 border border-[#262626] bg-[#0A0A0A] text-[#A1A1AA] rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Save bar */}
      <div className="sticky bottom-0 mt-8 -mx-5 md:-mx-8 px-5 md:px-8 py-4 bg-[#0A0A0A]/90 backdrop-blur-sm border-t border-[#1A1A1A] flex items-center justify-between">
        <p className="text-xs text-[#4B4B4B] font-mono">
          {isNew ? "Nouveau projet" : `Dernière modification: ${existing?.updatedAt ?? "—"}`}
        </p>
        <div className="flex gap-2">
          <Link to="/projects">
            <Button variant="ghost" size="sm">Annuler</Button>
          </Link>
          <Button size="sm" loading={saving} onClick={handleSave}>
            <Save size={13} />
            {isNew ? "Créer le projet" : "Sauvegarder"}
          </Button>
        </div>
      </div>
    </div>
  );
}
