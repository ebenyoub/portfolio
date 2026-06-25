import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
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
  { year: "2021", title: "École 42", subtitle: "Formation en C & Algorithmique", description: "Apprentissage par les pairs, projets bas niveau (gestion mémoire, algorithmes de tri, parseurs), programmation système et graphique.", badge: "Formation" },
  { year: "2022", title: "OpenClassrooms", subtitle: "Intégrateur Web", description: "Développement front-end, intégration HTML/CSS avancée, accessibilité WCAG, responsive design et optimisation des performances.", badge: "Diplôme" },
  { year: "2023–2024", title: "La Plateforme", subtitle: "Développeur Web et Web Mobile", description: "Formation full-stack intensive : React, Node.js, PHP, MySQL, Docker. Projets en équipe avec méthodologie agile, Git flow et code reviews.", badge: "Diplôme" },
  { year: "2025", title: "ESGI — Bachelor 3", subtitle: "Ingénierie du Web", description: "Admission en Bachelor 3 — approfondissement architecture web, DevOps avancé, microservices et développement full-stack en alternance.", badge: "En cours", current: true },
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

const HomePage = () => {
  const { apiFetch } = useFetch();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
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
    };
    fetchProjects();
  }, [apiFetch]);

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
              <span className="text-xs font-mono text-[#A1A1AA]">Disponible pour une alternance — Lyon</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[3.2rem] font-extrabold text-white leading-[1.1] tracking-tight mb-6" style={{ fontFamily: "Manrope, sans-serif" }}>
              Développeur Web<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)" }}>Front-End &amp; Full-Stack</span>
            </h1>
            <p className="text-[#A1A1AA] text-base leading-relaxed mb-3 max-w-[30rem]">
              Je conçois des applications web avec React, TypeScript, Express et MySQL.
            </p>
            <p className="text-[#A1A1AA] text-base leading-relaxed mb-10 max-w-[30rem]">
              Admis en Bachelor 3 Ingénierie du Web à l'ESGI Lyon, je recherche une alternance pour contribuer à des projets concrets et progresser dans un cadre professionnel.
            </p>
            <div className="flex flex-wrap gap-3 mb-12">
              <a href="#projets" className="group flex items-center gap-2 bg-[#3B82F6] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#2563EB] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                Voir mes projets
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <Link to="/contact" className="flex items-center gap-2 border border-[#262626] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#111111] hover:border-[#3B3B3B] transition-all duration-200">
                <Mail size={15} />
                Me contacter
              </Link>
            </div>
            <div className="flex items-center gap-5 text-sm text-[#A1A1AA]">
              <div className="flex items-center gap-1.5"><MapPin size={13} />Lyon, France</div>
              <div className="w-px h-4 bg-[#262626]" />
              <div className="flex items-center gap-3.5">
                <a href="https://github.com/ebenyoub" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="GitHub"><Github size={17} /></a>
                <a href="https://linkedin.com/in/elyas-benyoub" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn"><Linkedin size={17} /></a>
                <a href="mailto:embenyoub@gmail.com" className="hover:text-white transition-colors" aria-label="Email"><Mail size={17} /></a>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-[#111111] border border-[#262626] rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#262626] bg-[#0F0F0F]">
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                <span className="ml-3 text-xs text-[#6B7280] font-mono">elyas@portfolio ~/dev</span>
              </div>
              <div className="p-6 text-sm font-mono leading-7 select-none">
                <p><span className="text-[#6B7280]">// elyas.benyoub — dev web</span></p>
                <p className="mt-1"><span className="text-[#8B5CF6]">const </span><span className="text-[#60A5FA]">developer</span><span className="text-white"> = {"{"}</span></p>
                <p><span className="text-[#E5E7EB] ml-6">name</span><span className="text-[#6B7280]">: </span><span className="text-[#10B981]">"Elyas Benyoub"</span><span className="text-[#6B7280]">,</span></p>
                <p><span className="text-[#E5E7EB] ml-6">location</span><span className="text-[#6B7280]">: </span><span className="text-[#10B981]">"Lyon, France"</span><span className="text-[#6B7280]">,</span></p>
                <p className="mt-1"><span className="text-[#E5E7EB] ml-6">frontend</span><span className="text-[#6B7280]">: [</span><span className="text-[#F59E0B]">"React"</span><span className="text-[#6B7280]">, </span><span className="text-[#F59E0B]">"TypeScript"</span><span className="text-[#6B7280]">, </span><span className="text-[#F59E0B]">"Next.js"</span><span className="text-[#6B7280]">],</span></p>
                <p><span className="text-[#E5E7EB] ml-6">backend</span><span className="text-[#6B7280]">: [</span><span className="text-[#F59E0B]">"Node.js"</span><span className="text-[#6B7280]">, </span><span className="text-[#F59E0B]">"Express"</span><span className="text-[#6B7280]">, </span><span className="text-[#F59E0B]">"PHP"</span><span className="text-[#6B7280]">],</span></p>
                <p><span className="text-[#E5E7EB] ml-6">tools</span><span className="text-[#6B7280]">: [</span><span className="text-[#F59E0B]">"Docker"</span><span className="text-[#6B7280]">, </span><span className="text-[#F59E0B]">"Git"</span><span className="text-[#6B7280]">, </span><span className="text-[#F59E0B]">"Figma"</span><span className="text-[#6B7280]">],</span></p>
                <p className="mt-2"><span className="text-[#E5E7EB] ml-6">status</span><span className="text-[#6B7280]">: </span><span className="text-[#10B981]">"open_to_alternance"</span><span className="text-[#6B7280]">,</span></p>
                <p><span className="text-white">{"}"}</span><span className="text-[#6B7280]">;</span></p>
                <p className="mt-4 flex items-center gap-1.5"><span className="text-[#3B82F6]">▸</span><span className="text-[#A1A1AA]">ready to ship</span><span className="inline-block w-2 h-4 bg-[#3B82F6] animate-pulse ml-1" /></p>
              </div>
            </div>
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
            {TIMELINE.map((item) => (
              <div key={item.year} className="relative flex items-start gap-8 md:gap-14 py-8">
                <div className="w-14 md:w-24 flex-shrink-0 text-right pt-1">
                  <span className="text-xs font-mono text-[#A1A1AA] leading-tight block">{item.year}</span>
                </div>
                <div className={`absolute left-[4.85rem] md:left-[8.65rem] top-[2.15rem] w-3 h-3 rounded-full border-2 flex-shrink-0 z-10 ${item.current ? "border-[#3B82F6] bg-[#3B82F6] shadow-[0_0_10px_rgba(59,130,246,0.6)]" : "border-[#404040] bg-[#0A0A0A]"}`} />
                <div className="flex-1 pl-4">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-bold text-white tracking-tight" style={{ fontFamily: "Manrope, sans-serif" }}>{item.title}</h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${item.current ? "border-[#3B82F6]/40 bg-[#3B82F6]/10 text-[#60A5FA]" : "border-[#262626] bg-[#111111] text-[#A1A1AA]"}`}>{item.badge}</span>
                  </div>
                  <p className="text-sm text-[#3B82F6] font-medium mb-2">{item.subtitle}</p>
                  <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-lg">{item.description}</p>
                </div>
              </div>
            ))}
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
              <a
                href="mailto:embenyoub@gmail.com"
                className="group flex items-center gap-3 text-lg font-semibold text-white transition-colors duration-200 hover:text-[#3B82F6]"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                embenyoub@gmail.com
                <ArrowRight size={18} className="rotate-[-45deg] text-[#3B82F6] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <div className="mt-8">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#262626] px-5 py-3 text-sm font-semibold text-white transition-all hover:border-[#3B3B3B] hover:bg-[#111111]"
                >
                  <Mail size={15} />
                  Ouvrir la page contact
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { icon: Github, label: "GitHub", sublabel: "github.com/ebenyoub", href: "https://github.com/ebenyoub", color: "#FFFFFF" },
                { icon: Linkedin, label: "LinkedIn", sublabel: "linkedin.com/in/elyas-benyoub", href: "https://linkedin.com/in/elyas-benyoub", color: "#0A66C2" },
                { icon: Mail, label: "Email", sublabel: "embenyoub@gmail.com", href: "mailto:embenyoub@gmail.com", color: "#3B82F6" },
                { icon: Download, label: "Curriculum Vitae", sublabel: "Telecharger le PDF", href: "/cv_alternance_B3.pdf", color: "#10B981" },
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
                      <p className="text-xs text-[#A1A1AA]">{link.sublabel}</p>
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
