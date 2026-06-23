import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { MapPin, Mail, Github, Linkedin, Download, ArrowUpRight } from "lucide-react";
import useFetch from "../hooks/apiFetch";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.email("Email invalide"),
  subject: z.string().trim().min(3, "Le sujet doit contenir au moins 3 caractères"),
  message: z.string().trim().min(10, "Le message doit contenir au moins 10 caractères"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactPage = () => {
  const { apiFetch, isLoading } = useFetch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      const response = await apiFetch("/contact", {
        method: "POST",
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          subject: values.subject.trim(),
          message: values.message.trim(),
        }),
      });

      toast.success(response.message || "Message envoyé avec succès.");
      reset();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <p className="text-xs font-mono tracking-[0.2em] uppercase text-[#3B82F6] mb-3">Contact</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4" style={{ fontFamily: "Manrope, sans-serif" }}>
            Travaillons ensemble
          </h1>
          <p className="max-w-2xl text-base text-[#A1A1AA] leading-relaxed">
            Disponible pour une alternance Bachelor 3 Ingénierie du Web à l'ESGI (Lyon / Remote). Ouvert à des projets freelance et des opportunités de stage.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Information & Links */}
          <div className="space-y-8">
            <div>
              <p className="text-sm text-[#A1A1AA] mb-4">Email de contact direct :</p>
              <a href="mailto:elyas.benyoub@email.com" className="group flex items-center gap-3 text-white text-lg font-semibold hover:text-[#3B82F6] transition-colors duration-200" style={{ fontFamily: "Manrope, sans-serif" }}>
                elyas.benyoub@email.com
                <ArrowUpRight size={18} className="text-[#3B82F6] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: Github, label: "GitHub", sublabel: "github.com/ebenyoub", href: "https://github.com/ebenyoub", color: "#FFFFFF" },
                { icon: Linkedin, label: "LinkedIn", sublabel: "linkedin.com/in/elyas-benyoub", href: "https://linkedin.com/in/elyas-benyoub", color: "#0A66C2" },
                { icon: Mail, label: "Email", sublabel: "elyas.benyoub@email.com", href: "mailto:elyas.benyoub@email.com", color: "#3B82F6" },
                { icon: Download, label: "Curriculum Vitae", sublabel: "Télécharger le PDF", href: "/cv_alternance_B3.pdf", color: "#10B981" },
              ].map((link) => {
                const Icon = link.icon;
                return (
                  <a key={link.label} href={link.href} target={link.href.startsWith("http") || link.href.endsWith(".pdf") ? "_blank" : undefined} rel="noopener noreferrer" className="group flex items-start gap-3 p-4 bg-[#111111] border border-[#262626] rounded-xl hover:border-[#363636] hover:bg-[#141414] transition-all duration-200">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${link.color}14`, border: `1px solid ${link.color}20` }}>
                      <Icon size={15} style={{ color: link.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white mb-0.5" style={{ fontFamily: "Manrope, sans-serif" }}>{link.label}</p>
                      <p className="text-xs text-[#A1A1AA] truncate">{link.sublabel}</p>
                    </div>
                  </a>
                );
              })}
            </div>
            <div className="flex items-center gap-2 text-xs text-[#4B4B4B] font-mono"><MapPin size={11} />Lyon, France — 2026</div>
          </div>

          {/* Form */}
          <div className="bg-[#111111] border border-[#262626] rounded-2xl p-7 shadow-2xl">
            {isSubmitSuccessful && (
              <div className="mb-6 rounded-lg border border-green-500/20 bg-green-500/5 px-4 py-3 text-sm font-medium text-green-400 font-mono">
                Votre message a bien été envoyé.
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-sm font-medium text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    aria-invalid={!!errors.name}
                    className={`w-full bg-[#0A0A0A] border rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#4B4B4B] font-mono outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors ${errors.name ? "border-red-500/50" : "border-[#262626]"}`}
                  />
                  {errors.name && <p className="text-xs text-red-400 font-mono">{errors.name.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-sm font-medium text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                    className={`w-full bg-[#0A0A0A] border rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#4B4B4B] font-mono outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors ${errors.email ? "border-red-500/50" : "border-[#262626]"}`}
                  />
                  {errors.email && <p className="text-xs text-red-400 font-mono">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="block text-sm font-medium text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
                  Sujet <span className="text-red-500">*</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  {...register("subject")}
                  aria-invalid={!!errors.subject}
                  className={`w-full bg-[#0A0A0A] border rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#4B4B4B] font-mono outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors ${errors.subject ? "border-red-500/50" : "border-[#262626]"}`}
                />
                {errors.subject && <p className="text-xs text-red-400 font-mono">{errors.subject.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="block text-sm font-medium text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  rows={6}
                  {...register("message")}
                  aria-invalid={!!errors.message}
                  className={`w-full bg-[#0A0A0A] border rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#4B4B4B] font-mono outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors ${errors.message ? "border-red-500/50" : "border-[#262626]"}`}
                />
                {errors.message && <p className="text-xs text-red-400 font-mono">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#3B82F6] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#2563EB] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                {isLoading ? "Envoi..." : "Envoyer le message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
