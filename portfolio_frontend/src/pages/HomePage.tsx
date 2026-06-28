import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Github,
  Linkedin,
  Mail,
  ArrowRight,
  Download,
  Code2,
  Database,
  Server,
  Layers,
  Wrench,
  MapPin,
} from "lucide-react";
import useFetch from "../hooks/apiFetch";
import ProjectCard from "../components/ProjectCard";
import ProjectCaseStudyModal from "../components/ProjectCaseStudyModal";
import type { Project } from "../types/project";
import { getProjectCategory } from "../utils/projectPresentation";
import { getImageSrc } from "../utils/images";

// ─── Stack Categories Definition ────────────────────────────────────────────────
const STACK_CATEGORIES = [
  {
    label: "Frontend",
    icon: Code2,
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.06)",
    techs: ["React", "TypeScript", "Next.js", "Tailwind CSS", "HTML/CSS", "Redux"],
    projects: "La Loge · Rétrospective Agile · ArgentBank",
    size: "large",
  },
  {
    label: "Backend",
    icon: Server,
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.06)",
    techs: ["Node.js", "Express", "PHP", "REST API", "JWT"],
    projects: "La Loge · Rétrospective Agile · Médiathèque",
    size: "medium",
  },
  {
    label: "Base de données",
    icon: Database,
    color: "#10B981",
    bg: "rgba(16,185,129,0.06)",
    techs: ["MySQL", "SQL", "PDO"],
    projects: "La Loge · Rétrospective Agile · Médiathèque",
    size: "medium",
  },
  {
    label: "DevOps",
    icon: Layers,
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.06)",
    techs: ["Docker", "Git", "GitHub"],
    projects: "La Loge · Portfolio · Rétrospective Agile",
    size: "medium",
  },
  {
    label: "Outils",
    icon: Wrench,
    color: "#EC4899",
    bg: "rgba(236,72,153,0.06)",
    techs: ["Figma", "Postman", "VSCode", "Linux"],
    projects: "",
    size: "small",
  },
];

const TIMELINE = [
  { year: "2025", title: "ESGI — Bachelor 3", subtitle: "Ingénierie du Web", description: "Admission en Bachelor 3 — approfondissement architecture web, DevOps avancé, microservices et développement full-stack en alternance.", badge: "En cours", current: true },
  { year: "2023–2024", title: "La Plateforme", subtitle: "Développeur Web et Web Mobile", description: "Formation full-stack intensive : React, Node.js, PHP, MySQL, Docker. Projets en équipe avec méthodologie agile, Git flow et code reviews.", badge: "Diplôme" },
  { year: "2022", title: "OpenClassrooms", subtitle: "Intégrateur Web", description: "Développement front-end, intégration HTML/CSS avancée, accessibilité WCAG, responsive design et optimisation des performances.", badge: "Diplôme" },
  { year: "2021", title: "École 42", subtitle: "Formation en C & Algorithmique", description: "Apprentissage par les pairs, projets bas niveau (gestion mémoire, algorithmes de tri, parseurs), programmation système et graphique.", badge: "Formation" },
];

function StackCardComponent({ cat }: { cat: typeof STACK_CATEGORIES[0] }) {
  const Icon = cat.icon;
  const customBackground = `radial-gradient(circle at 10% 10%, ${cat.color}15, transparent 80%), #111111`;
  return (
    <div className="h-full flex flex-col border border-[#2D2D2D] rounded-xl p-6 hover:border-[#3D3D3D] transition-all duration-300 group" style={{ background: customBackground }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}28` }}>
          <Icon size={18} style={{ color: cat.color }} />
        </div>
        <span className="text-sm font-semibold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>{cat.label}</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {cat.techs.map((tech) => (
          <span key={tech} className="text-xs font-mono px-2.5 py-1 rounded-md border border-[#333333] bg-[#0A0A0A] text-[#A1A1AA] group-hover:border-[#444444] transition-colors">{tech}</span>
        ))}
      </div>
      {cat.projects && (
        <p className="text-[10px] font-mono text-[#6B7280] group-hover:text-[#A1A1AA] transition-colors mt-auto pt-3 border-t border-[#262626]">
          {cat.projects}
        </p>
      )}
    </div>
  );
}

const contactSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.email("Email invalide"),
  subject: z.string().trim().min(3, "Le sujet doit contenir au moins 3 caractères"),
  message: z.string().trim().min(10, "Le message doit contenir au moins 10 caractères"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const HomePage = () => {
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [heroActiveIndex, setHeroActiveIndex] = useState(0);
  const [timeline, setTimeline] = useState(TIMELINE);
  const [settings, setSettings] = useState({
    name: "Elyas Benyoub",
    title: "React & Full-Stack",
    location: "Lyon, France",
    email: "embenyoub@gmail.com",
    github_url: "https://github.com/ebenyoub",
    linkedin_url: "https://linkedin.com/in/elyas-benyoub",
    bio_recruiter: "Conception d'applications web robustes, scalables et centrées sur l'expérience utilisateur. Admis à l'ESGI Lyon en Bachelor 3 Ingénierie du Web, je recherche une alternance pour relever vos défis techniques et intégrer vos équipes de développement."
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFetch("/projects");
        const sorted = (response.data as Project[])
          .filter((project) => (
            project.title.toLowerCase() !== "portfolio personnel"
            && (project.is_featured === true || project.is_featured === 1)
          ))
          .sort((a, b) => {
            const orderA = typeof a.featured_order === "number" ? a.featured_order : Number.MAX_SAFE_INTEGER;
            const orderB = typeof b.featured_order === "number" ? b.featured_order : Number.MAX_SAFE_INTEGER;
            return orderA - orderB;
          });

        setProjects(sorted);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }

      // Fetch parameters
      try {
        const paramRes = await apiFetch("/parametres");
        if (paramRes.data) {
          setSettings((prev) => ({ ...prev, ...paramRes.data }));
        }
      } catch {
        // Silent fallback
      }

      // Fetch parcours
      try {
        const parcoursRes = await apiFetch("/parcours");
        if (parcoursRes.data && parcoursRes.data.length > 0) {
          setTimeline(parcoursRes.data);
        }
      } catch {
        // Silent fallback
      }
    };
    fetchData();
  }, [apiFetch]);

  useEffect(() => {
    if (projects.length <= 1) return;
    const interval = setInterval(() => {
      setHeroActiveIndex((prev) => (prev + 1) % projects.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [projects.length]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden border-b border-[#1A1A1A]">
        <div className="absolute inset-0 opacity-25 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #3B3B3B 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 40% at 50% -5%, rgba(59,130,246,0.13) 0%, transparent 65%)" }} />
        <div className="relative max-w-6xl mx-auto px-6 py-24 w-full grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2.5 border border-[#262626] bg-[#111111] rounded-full px-3.5 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-xs font-mono text-[#A1A1AA]">Disponible pour une alternance — {settings.location.split(",")[0] || "Lyon"}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[3.2rem] font-extrabold text-white leading-[1.1] tracking-tight mb-6" style={{ fontFamily: "Manrope, sans-serif" }}>
              Développeur Web<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)" }}>
                {settings.title.toLowerCase().includes("développeur web") 
                  ? settings.title.replace(/développeur web/gi, "").trim()
                  : settings.title}
              </span>
            </h1>
            <p className="text-[#A1A1AA] text-base leading-relaxed mb-10 max-w-[30rem]">
              {settings.bio_recruiter}
            </p>
            <div className="flex flex-wrap gap-3 mb-12">
              <a
                href="#projets"
                className="group flex items-center gap-2 bg-[#3B82F6] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#2563EB] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Voir mes projets
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="/cv_alternance_B3.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-[#262626] bg-[#111111] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#1A1A1A] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                aria-label="Télécharger mon CV (Format PDF)"
              >
                <Download size={15} />
                Télécharger mon CV
              </a>
            </div>
            <div className="flex items-center gap-5 text-sm text-[#A1A1AA]">
              <div className="flex items-center gap-1.5"><MapPin size={13} />{settings.location}</div>
              <div className="w-px h-4 bg-[#262626]" />
              <div className="flex items-center gap-3.5">
                {settings.github_url && (
                  <a href={settings.github_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="GitHub">
                    <Github size={17} />
                  </a>
                )}
                {settings.linkedin_url && (
                  <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn">
                    <Linkedin size={17} />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            {projects.length > 0 ? (
              (() => {
                const activeProj = projects[heroActiveIndex] || projects[0];
                return (
                  <div className="bg-[#111111] border border-[#262626] rounded-xl overflow-hidden shadow-2xl flex flex-col h-[400px] transition-all duration-500 hover:border-[#3B82F6]/30">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#262626] bg-[#0F0F0F] select-none">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                        <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                        <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                        <span className="ml-3 text-xs text-[#6B7280] font-mono"> elyas.dev/projects</span>
                      </div>
                      <div className="flex gap-1.5">
                        {projects.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setHeroActiveIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${idx === heroActiveIndex ? "bg-[#3B82F6] scale-125" : "bg-[#262626] hover:bg-[#404040]"}`}
                            aria-label={`Voir projet à la une ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="relative h-48 bg-[#1A1A1A] overflow-hidden flex-shrink-0">
                      {activeProj.image_url ? (
                        <img
                          src={getImageSrc(activeProj.image_url)}
                          alt={activeProj.title}
                          className="w-full h-full object-cover opacity-90 transition-all duration-700 hover:scale-[1.01]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/50 to-indigo-950/50 p-4 text-center text-sm font-bold text-white opacity-40">
                          {activeProj.title}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
                    </div>
                    <div className="p-5 flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#3B82F6]">
                            {getProjectCategory(activeProj)}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white mb-2 leading-tight" style={{ fontFamily: "Manrope, sans-serif" }}>
                          {activeProj.title}
                        </h3>
                        <p className="text-[#A1A1AA] text-xs leading-relaxed line-clamp-2">
                          {activeProj.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <button
                          type="button"
                          onClick={() => setSelectedProject(activeProj)}
                          className="flex items-center gap-1 text-xs font-semibold text-[#3B82F6] hover:text-[#60A5FA] transition-colors"
                        >
                          En savoir plus
                          <ArrowRight size={12} />
                        </button>
                        <div className="flex items-center gap-3">
                          {activeProj.demo_url && (
                            <a
                              href={activeProj.demo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center rounded border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-2 py-0.5 text-[11px] font-mono text-[#60A5FA] hover:bg-[#3B82F6]/25 transition-all"
                            >
                              Démo
                            </a>
                          )}
                          {activeProj.github_url && (
                            <a
                              href={activeProj.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#A1A1AA] hover:text-white transition-colors"
                              aria-label="GitHub"
                            >
                              <Github size={15} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="bg-[#111111] border border-[#262626] rounded-xl overflow-hidden shadow-2xl flex flex-col h-[400px] items-center justify-center text-center p-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse mb-3" />
                <p className="text-[#A1A1AA] font-mono text-xs">Chargement du showcase...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stack Section */}
      <section id="stack" className="py-28 max-w-6xl mx-auto px-6 border-b border-[#1A1A1A]">
        <p className="text-xs font-mono tracking-[0.2em] uppercase text-[#3B82F6] mb-3">Stack technique</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4" style={{ fontFamily: "Manrope, sans-serif" }}>Les outils que je maîtrise</h2>
        <p className="text-[#A1A1AA] text-base leading-relaxed max-w-2xl mb-14">Un ensemble de technologies modernes couvrant le cycle de développement complet, du design à la production.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2"><StackCardComponent cat={STACK_CATEGORIES[0]} /></div>
          <div><StackCardComponent cat={STACK_CATEGORIES[3]} /></div>
          <div><StackCardComponent cat={STACK_CATEGORIES[1]} /></div>
          <div><StackCardComponent cat={STACK_CATEGORIES[2]} /></div>
          <div><StackCardComponent cat={STACK_CATEGORIES[4]} /></div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projets" className="py-28 bg-[#0D0D0D] border-b border-[#1A1A1A]">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-mono tracking-[0.2em] uppercase text-[#3B82F6] mb-3">Projets</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4" style={{ fontFamily: "Manrope, sans-serif" }}>Ce que j'ai construit</h2>
          <p className="text-[#A1A1AA] text-base leading-relaxed max-w-2xl mb-14">Applications web full-stack, projets de formation et expériences bas niveau. Chaque projet représente une étape concrète de progression.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  description={project.description ?? ""}
                  image_url={project.image_url ?? undefined}
                  tech_stack={project.tech_stack ?? undefined}
                  github_url={project.github_url ?? undefined}
                  demo_url={project.demo_url ?? undefined}
                  onOpenDetail={() => setSelectedProject(project)}
                />
              ))
            ) : (
              <p className="text-[#A1A1AA] font-mono col-span-full">Aucun projet trouvé.</p>
            )}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-lg border border-[#262626] px-5 py-3 text-sm font-semibold text-white transition-all hover:border-[#3B3B3B] hover:bg-[#111111]"
            >
              Voir tous les projets
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="parcours" className="py-28 max-w-6xl mx-auto px-6 border-b border-[#1A1A1A]">
        <p className="text-xs font-mono tracking-[0.2em] uppercase text-[#3B82F6] mb-3">Parcours</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4" style={{ fontFamily: "Manrope, sans-serif" }}>Formation &amp; expériences</h2>
        <p className="text-[#A1A1AA] text-base leading-relaxed max-w-2xl mb-14">Un parcours atypique et rigoureux, de l'École 42 jusqu'au Bachelor Ingénierie du Web.</p>
        
        <div className="relative">
          <div className="absolute left-[5.5rem] md:left-36 top-0 bottom-0 w-px bg-gradient-to-b from-[#3B82F6]/40 via-[#262626] to-transparent" />
          <div className="space-y-0">
            {timeline.map((item) => {
              const isCurrent = Boolean(item.current);
              return (
                <div key={`${item.year}-${item.title}`} className="relative flex items-start gap-8 md:gap-14 py-8">
                  <div className="w-14 md:w-24 flex-shrink-0 text-right pt-1">
                    <span className="text-xs font-mono text-[#A1A1AA] leading-tight block">{item.year}</span>
                  </div>
                  <div className={`absolute left-[4.85rem] md:left-[8.65rem] top-[2.15rem] w-3 h-3 rounded-full border-2 flex-shrink-0 z-10 ${isCurrent ? "border-[#3B82F6] bg-[#3B82F6] shadow-[0_0_10px_rgba(59,130,246,0.6)]" : "border-[#404040] bg-[#0A0A0A]"}`} />
                  <div className="flex-1 pl-4">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base font-bold text-white tracking-tight" style={{ fontFamily: "Manrope, sans-serif" }}>{item.title}</h3>
                      {item.badge && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${isCurrent ? "border-[#3B82F6]/40 bg-[#3B82F6]/10 text-[#60A5FA]" : "border-[#262626] bg-[#111111] text-[#A1A1AA]"}`}>{item.badge}</span>
                      )}
                    </div>
                    {item.subtitle && <p className="text-sm text-[#3B82F6] font-medium mb-2">{item.subtitle}</p>}
                    {item.description && <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-lg">{item.description}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="border-b border-[#1A1A1A] bg-[#0D0D0D] py-28">
        <div className="max-w-6xl mx-auto px-6">
          <p className="mb-3 text-xs font-mono uppercase tracking-[0.2em] text-[#3B82F6]">Contact</p>
          <div className="grid items-start gap-16 lg:grid-cols-2">
            <div>
              <h2
                className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-5xl leading-[1.1]"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                Travaillons
                <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)" }}
                >
                  ensemble.
                </span>
              </h2>
              <p className="mb-8 max-w-md text-base leading-relaxed text-[#A1A1AA]">
                Disponible pour une alternance Bachelor 3 Ingenierie du Web a l'ESGI (Lyon / Remote). Ouvert aux projets freelance et aux opportunites de stage.
              </p>
              
              <div className="flex flex-col gap-3">
                {[
                  ...(settings.github_url ? [{ icon: Github, label: "GitHub", sublabel: settings.github_url.replace("https://", ""), href: settings.github_url, color: "#FFFFFF" }] : []),
                  ...(settings.linkedin_url ? [{ icon: Linkedin, label: "LinkedIn", sublabel: settings.linkedin_url.replace("https://", ""), href: settings.linkedin_url, color: "#0A66C2" }] : []),
                  { icon: Mail, label: "Email", sublabel: settings.email, href: `mailto:${settings.email}`, color: "#3B82F6" },
                  { icon: Download, label: "Curriculum Vitae", sublabel: "Télécharger le PDF", href: "/cv_alternance_B3.pdf", color: "#10B981" },
                ].map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith("http") || link.href.endsWith(".pdf") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") || link.href.endsWith(".pdf") ? "noopener noreferrer" : undefined}
                      className="group flex items-start gap-3 rounded-xl border border-[#262626] bg-[#111111] p-4 transition-all duration-200 hover:border-[#363636] hover:bg-[#141414]"
                    >
                      <div
                        className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                        style={{ background: `${link.color}14`, border: `1px solid ${link.color}20` }}
                      >
                        <Icon size={15} style={{ color: link.color }} />
                      </div>
                      <div className="min-w-0">
                        <p className="mb-0.5 text-sm font-semibold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
                          {link.label}
                        </p>
                        <p className="text-xs text-[#A1A1AA] truncate">{link.sublabel}</p>
                      </div>
                    </a>
                  );
                })}
                <div className="mt-3 flex items-center gap-2 text-xs font-mono text-[#4B4B4B]">
                  <MapPin size={11} />
                  Lyon, France - 2026
                </div>
              </div>
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
                    {errors.name && <p role="alert" className="text-xs text-red-400 font-mono">{errors.name.message}</p>}
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
                    {errors.email && <p role="alert" className="text-xs text-red-400 font-mono">{errors.email.message}</p>}
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
                  {errors.subject && <p role="alert" className="text-xs text-red-400 font-mono">{errors.subject.message}</p>}
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
                  {errors.message && <p role="alert" className="text-xs text-red-400 font-mono">{errors.message.message}</p>}
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
      </section>

      <ProjectCaseStudyModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};

export default HomePage;
