import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import useFetch from "../../hooks/apiFetch";

const parametresSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis"),
  title: z.string().trim().min(1, "Le titre est requis"),
  location: z.string().trim().min(1, "La localisation est requise"),
  email: z.string().trim().email("E-mail invalide"),
  github_url: z.string().trim().url("URL GitHub invalide").or(z.string().length(0)),
  linkedin_url: z.string().trim().url("URL LinkedIn invalide").or(z.string().length(0)),
  bio_recruiter: z.string().trim().min(10, "La bio doit faire au moins 10 caractères"),
});

type ParametresFormValues = z.infer<typeof parametresSchema>;

export default function AdminParametresPage() {
  const { apiFetch, isLoading } = useFetch();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ParametresFormValues>({
    resolver: zodResolver(parametresSchema),
    defaultValues: {
      name: "",
      title: "",
      location: "",
      email: "",
      github_url: "",
      linkedin_url: "",
      bio_recruiter: "",
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiFetch("/parametres");
        const data = response.data || {};
        
        // Map keys to form fields
        if (data.name) setValue("name", data.name);
        if (data.title) setValue("title", data.title);
        if (data.location) setValue("location", data.location);
        if (data.email) setValue("email", data.email);
        if (data.github_url) setValue("github_url", data.github_url);
        if (data.linkedin_url) setValue("linkedin_url", data.linkedin_url);
        if (data.bio_recruiter) setValue("bio_recruiter", data.bio_recruiter);
      } catch (error) {
        if (error instanceof Error) {
          toast.error("Impossible de récupérer les paramètres.");
        }
      }
    };

    fetchSettings();
  }, [apiFetch, setValue]);

  const onSubmit = async (values: ParametresFormValues) => {
    setIsSaving(true);
    try {
      await apiFetch("/parametres", {
        method: "PUT",
        body: JSON.stringify(values),
      });
      toast.success("Paramètres enregistrés avec succès !");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* Header */}
      <div>
        <p className="text-xs font-mono text-[#3B82F6] tracking-widest uppercase mb-1.5">Administration</p>
        <h1 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "Manrope, sans-serif" }}>
          Paramètres du site
        </h1>
        <p className="text-sm text-[#A1A1AA] mt-1.5">
          Configurez les informations d'identité, de contact et les liens sociaux affichés sur le portfolio.
        </p>
      </div>

      {isLoading ? (
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-12 text-center text-sm text-[#A1A1AA] font-mono animate-pulse">
          Chargement des configurations...
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-[#111111] border border-[#262626] rounded-xl p-6 shadow-2xl space-y-5">
          {/* Identity Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-white uppercase tracking-wider font-mono">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("name")}
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white focus:border-[#3B82F6] outline-none"
              />
              {errors.name && <p className="text-[11px] text-red-400 font-mono mt-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-white uppercase tracking-wider font-mono">
                Titre professionnel <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("title")}
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white focus:border-[#3B82F6] outline-none"
              />
              {errors.title && <p className="text-[11px] text-red-400 font-mono mt-1">{errors.title.message}</p>}
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-white uppercase tracking-wider font-mono">
                Localisation (Ville, Pays) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("location")}
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white focus:border-[#3B82F6] outline-none"
              />
              {errors.location && <p className="text-[11px] text-red-400 font-mono mt-1">{errors.location.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-white uppercase tracking-wider font-mono">
                E-mail public <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white focus:border-[#3B82F6] outline-none font-mono"
              />
              {errors.email && <p className="text-[11px] text-red-400 font-mono mt-1">{errors.email.message}</p>}
            </div>
          </div>

          {/* Social Profiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-white uppercase tracking-wider font-mono">
                Lien GitHub
              </label>
              <input
                type="text"
                placeholder="https://github.com/..."
                {...register("github_url")}
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white focus:border-[#3B82F6] outline-none font-mono text-xs"
              />
              {errors.github_url && <p className="text-[11px] text-red-400 font-mono mt-1">{errors.github_url.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-white uppercase tracking-wider font-mono">
                Lien LinkedIn
              </label>
              <input
                type="text"
                placeholder="https://linkedin.com/in/..."
                {...register("linkedin_url")}
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white focus:border-[#3B82F6] outline-none font-mono text-xs"
              />
              {errors.linkedin_url && <p className="text-[11px] text-red-400 font-mono mt-1">{errors.linkedin_url.message}</p>}
            </div>
          </div>

          {/* Recruiter Bio */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Présentation / Accroche Recruteur <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              {...register("bio_recruiter")}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#3B82F6] outline-none font-mono text-xs leading-relaxed"
            />
            {errors.bio_recruiter && <p className="text-[11px] text-red-400 font-mono mt-1">{errors.bio_recruiter.message}</p>}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end pt-4 border-t border-[#262626] mt-6">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-[#3B82F6] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#2563EB] transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Enregistrer les modifications
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
