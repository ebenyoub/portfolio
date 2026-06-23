import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  Github,
  Linkedin,
  Mail,
  Download,
  ExternalLink,
  X,
  ArrowRight,
  Code2,
  Database,
  Server,
  Layers,
  Wrench,
  MapPin,
  ArrowUpRight,
  Terminal,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PortfolioProject {
  id: string;
  title: string;
  shortDesc: string;
  image: string;
  stack: string[];
  category: string;
  github?: string;
  wip?: boolean;
  context: string;
  objectives: string[];
  challenges: string[];
  solutions: string[];
  learnings: string[];
}

interface TimelineItem {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  current?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROJECTS: PortfolioProject[] = [
  {
    id: "la-loge",
    title: "La Loge — Site vitrine restaurant",
    shortDesc:
      "Site vitrine pour un restaurant avec système de réservation, espace admin et notifications e-mail. Projet client en cours.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop&auto=format",
    stack: ["React", "TypeScript", "Express", "MySQL", "Docker", "Nodemailer"],
    category: "Full-Stack — Projet client",
    wip: true,
    context:
      "Refonte de la présence web du restaurant La Loge. L'objectif est de remplacer un site limité par une vitrine moderne, administrable et orientée réservation.",
    objectives: [
      "Présenter le restaurant de façon professionnelle",
      "Permettre aux clients de faire une demande de réservation en ligne",
      "Permettre au gérant de gérer les réservations via un espace admin",
      "Préparer un déploiement Docker sur VPS",
      "Centraliser les contenus administrables sans accès au code",
    ],
    challenges: [
      "Concevoir un parcours de réservation clair et accessible",
      "Structurer un backend Express/MySQL maintenable",
      "Gérer les notifications e-mail côté serveur (Nodemailer)",
      "Concevoir un espace admin simple pour un non-développeur",
      "Garder un design sobre adapté à l'univers restauration",
    ],
    solutions: [
      "Architecture découplée frontend React / backend Express",
      "API REST avec validation des données entrantes",
      "Base MySQL avec gestion des créneaux et statuts de réservation",
      "Docker Compose pour l'environnement de développement",
      "Nodemailer pour les confirmations e-mail automatiques",
    ],
    learnings: [
      "Structuration d'un projet client de A à Z",
      "Gestion d'un système de réservation avec états",
      "Conception d'un back-office pour utilisateur non-technique",
      "Dockerisation d'une application full-stack",
      "Communication par e-mail côté serveur",
    ],
  },
  {
    id: "retro-agile",
    title: "App Rétrospective Agile",
    shortDesc:
      "Outil de rétrospective Scrum avec authentification JWT, boards collaboratifs et système de vote.",
    image:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=500&fit=crop&auto=format",
    stack: ["React", "TypeScript", "Express", "JWT", "MySQL"],
    category: "Full-Stack",
    context:
      "Projet répondant à un besoin concret : digitaliser les cérémonies de rétrospective d'équipes agiles.",
    objectives: [
      "Authentification par JWT avec gestion des sessions",
      "Board collaboratif avec ajout, vote et regroupement de cartes",
      "Architecture RESTful claire et maintenable",
    ],
    challenges: [
      "Sécurisation des routes protégées côté React",
      "Gestion des relations entre utilisateurs, boards et cartes en MySQL",
      "Interface utilisable par des équipes non-techniques",
    ],
    solutions: [
      "Middleware d'authentification Express avec refresh tokens",
      "Requêtes SQL structurées avec jointures explicites",
      "Interface épurée avec retours visuels clairs",
    ],
    learnings: [
      "Sécurité applicative : gestion des tokens, validation des entrées",
      "Architecture MVC côté API Express",
      "Importance de l'expérience utilisateur dans les outils internes",
    ],
  },
  {
    id: "argent-bank",
    title: "Argent Bank",
    shortDesc:
      "Application bancaire React avec gestion d'état Redux et intégration d'une API REST existante.",
    image:
      "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&h=500&fit=crop&auto=format",
    stack: ["React", "Redux", "JavaScript", "Swagger"],
    category: "Frontend",
    context:
      "Projet OpenClassrooms simulant une application bancaire avec authentification et gestion de profil utilisateur.",
    objectives: [
      "Mettre en place Redux Toolkit pour la gestion d'état",
      "Consommer une API REST existante",
      "Documenter les nouveaux endpoints avec Swagger",
    ],
    challenges: [
      "Organiser le store Redux pour une application avec plusieurs domaines",
      "Gérer les états de chargement et d'erreur de façon cohérente",
      "Maintenir la session utilisateur entre les rechargements de page",
    ],
    solutions: [
      "Slices Redux Toolkit découplés par domaine fonctionnel",
      "Gestion centralisée des appels API",
      "Persistance du token via localStorage",
    ],
    learnings: [
      "Flux de données unidirectionnel avec Redux",
      "Documentation d'API avec OpenAPI 3.0",
      "Gestion de l'état applicatif à l'échelle",
    ],
  },
  {
    id: "mediatheque",
    title: "Médiathèque PHP MVC",
    shortDesc:
      "Application de gestion de médiathèque en PHP natif avec architecture MVC implémentée sans framework.",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=500&fit=crop&auto=format",
    stack: ["PHP", "MySQL", "MVC", "HTML/CSS"],
    category: "Backend",
    context:
      "Projet de formation pour comprendre les fondamentaux du back-end web sans couche d'abstraction.",
    objectives: [
      "Implémenter le pattern MVC from scratch",
      "CRUD complet pour livres, films et musiques",
      "Sécuriser les échanges avec la base de données",
    ],
    challenges: [
      "Implémenter un routeur PHP sans framework",
      "Prévenir les injections SQL et les failles XSS",
      "Gérer les sessions et l'authentification côté PHP",
    ],
    solutions: [
      "Routeur maison basé sur les patterns d'URL",
      "PDO avec requêtes préparées sur toutes les interactions base",
      "Sessions PHP avec régénération d'identifiant à la connexion",
    ],
    learnings: [
      "Comprendre le MVC sans abstraction de framework",
      "Principes de sécurité PHP : validation, échappement, sessions",
      "Modélisation relationnelle avec MySQL",
    ],
  },
  {
    id: "cub3d",
    title: "Cub3D — École 42",
    shortDesc:
      "Moteur graphique 3D par raycasting en C. Mathématiques appliquées, rendu temps réel, gestion mémoire manuelle.",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=500&fit=crop&auto=format",
    stack: ["C", "Raycasting", "Trigonométrie", "MiniLibX"],
    category: "Bas niveau — École 42",
    context:
      "Projet de l'École 42 consistant à implémenter un moteur graphique 3D par raycasting, en s'appuyant uniquement sur la MiniLibX.",
    objectives: [
      "Implémenter le raycasting pour simuler une vue 3D depuis une carte 2D",
      "Gérer les textures et le rendu pixel par pixel",
      "Parser un fichier de configuration de map",
    ],
    challenges: [
      "Précision des calculs trigonométriques",
      "Gestion manuelle de la mémoire en C",
      "Optimiser le rendu pour rester fluide",
    ],
    solutions: [
      "Algorithme DDA pour le raycasting",
      "Tables précalculées pour sin/cos afin de réduire les calculs à chaque frame",
      "Gestion rigoureuse de la mémoire vérifiée avec Valgrind",
    ],
    learnings: [
      "Mathématiques appliquées : trigonométrie, vecteurs, projection",
      "Programmation C bas niveau et discipline de gestion mémoire",
      "Algorithmique de rendu graphique",
    ],
  },
];

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

const TIMELINE: TimelineItem[] = [
  { year: "2021", title: "École 42", subtitle: "Formation en C & Algorithmique", description: "Apprentissage par les pairs, projets bas niveau (gestion mémoire, algorithmes de tri, parseurs), programmation système et graphique.", badge: "Formation" },
  { year: "2022", title: "OpenClassrooms", subtitle: "Intégrateur Web", description: "Développement front-end, intégration HTML/CSS avancée, accessibilité WCAG, responsive design et optimisation des performances.", badge: "Diplôme" },
  { year: "2023–2024", title: "La Plateforme", subtitle: "Développeur Web et Web Mobile", description: "Formation full-stack intensive : React, Node.js, PHP, MySQL, Docker. Projets en équipe avec méthodologie agile, Git flow et code reviews.", badge: "Diplôme" },
  { year: "2025", title: "ESGI — Bachelor 3", subtitle: "Ingénierie du Web", description: "Admission en Bachelor 3 — approfondissement architecture web, DevOps avancé, microservices et développement full-stack en alternance.", badge: "En cours", current: true },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const handler = () => setY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return y;
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 22 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-mono tracking-[0.2em] uppercase text-[#3B82F6] mb-3">{children}</p>;
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ scrollY }: { scrollY: number }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = scrollY > 48;
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0A0A0A]/85 backdrop-blur-2xl border-b border-[#262626]" : ""}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-mono text-sm font-semibold text-white tracking-tight select-none">
          EB<span className="text-[#3B82F6]">.</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {["Projets", "Stack", "Parcours", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-[#A1A1AA] hover:text-white transition-colors duration-150">{item}</a>
          ))}
        </div>
        <a href="mailto:elyas.benyoub@email.com" className="hidden md:flex items-center gap-2 text-sm bg-[#3B82F6] text-white px-4 py-2 rounded-lg hover:bg-[#2563EB] transition-colors font-medium">
          Me contacter
        </a>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-[#A1A1AA] hover:text-white p-1" aria-label="Menu">
          {menuOpen ? <X size={20} /> : <Terminal size={20} />}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-[#262626] bg-[#0A0A0A] px-6 py-4 flex flex-col gap-4">
          {["Projets", "Stack", "Parcours", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="text-sm text-[#A1A1AA] hover:text-white transition-colors">{item}</a>
          ))}
          <a href="mailto:elyas.benyoub@email.com" className="text-sm text-[#3B82F6] font-medium mt-2">Me contacter →</a>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 opacity-25 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #3B3B3B 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 40% at 50% -5%, rgba(59,130,246,0.13) 0%, transparent 65%)" }} />
      <div className="relative max-w-6xl mx-auto px-6 py-24 w-full grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="inline-flex items-center gap-2.5 border border-[#262626] bg-[#111111] rounded-full px-3.5 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-xs font-mono text-[#A1A1AA]">Disponible pour une alternance — Lyon</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }} className="text-4xl md:text-5xl lg:text-[3.2rem] font-extrabold text-white leading-[1.1] tracking-tight mb-6" style={{ fontFamily: "Manrope, sans-serif" }}>
            Développeur Web<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)" }}>Front-End &amp; Full-Stack</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }} className="text-[#A1A1AA] text-base leading-relaxed mb-3 max-w-[30rem]">
            Je conçois des applications web avec React, TypeScript, Express et MySQL.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }} className="text-[#A1A1AA] text-base leading-relaxed mb-10 max-w-[30rem]">
            Admis en Bachelor 3 Ingénierie du Web à l'ESGI Lyon, je recherche une alternance pour contribuer à des projets concrets et progresser dans un cadre professionnel.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} className="flex flex-wrap gap-3 mb-12">
            <a href="#projets" className="group flex items-center gap-2 bg-[#3B82F6] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#2563EB] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
              Voir mes projets
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a href="mailto:elyas.benyoub@email.com" className="flex items-center gap-2 border border-[#262626] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#111111] hover:border-[#3B3B3B] transition-all duration-200">
              <Mail size={15} />
              Me contacter
            </a>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.45 }} className="flex items-center gap-5 text-sm text-[#A1A1AA]">
            <div className="flex items-center gap-1.5"><MapPin size={13} />Lyon, France</div>
            <div className="w-px h-4 bg-[#262626]" />
            <div className="flex items-center gap-3.5">
              <a href="https://github.com/elyas-benyoub" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="GitHub"><Github size={17} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn"><Linkedin size={17} /></a>
              <a href="mailto:elyas.benyoub@email.com" className="hover:text-white transition-colors" aria-label="Email"><Mail size={17} /></a>
            </div>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="hidden lg:block">
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
        </motion.div>
      </div>
    </section>
  );
}

// ─── Stack ────────────────────────────────────────────────────────────────────

function StackCard({ cat }: { cat: typeof STACK_CATEGORIES[0] }) {
  const Icon = cat.icon;
  return (
    <div className="h-full border border-[#262626] rounded-xl p-6 hover:border-[#363636] transition-all duration-300 group" style={{ background: cat.bg }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}28` }}>
          <Icon size={18} style={{ color: cat.color }} />
        </div>
        <span className="text-sm font-semibold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>{cat.label}</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {cat.techs.map((tech) => (
          <span key={tech} className="text-xs font-mono px-2.5 py-1 rounded-md border border-[#262626] bg-[#0A0A0A] text-[#A1A1AA] group-hover:border-[#303030] transition-colors">{tech}</span>
        ))}
      </div>
      {cat.projects && (
        <p className="text-[10px] font-mono text-[#3B3B3B] group-hover:text-[#4B4B4B] transition-colors">
          {cat.projects}
        </p>
      )}
    </div>
  );
}

function Stack() {
  return (
    <section id="stack" className="py-28 max-w-6xl mx-auto px-6">
      <FadeIn>
        <SectionLabel>Stack technique</SectionLabel>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4" style={{ fontFamily: "Manrope, sans-serif" }}>Les outils que je maîtrise</h2>
        <p className="text-[#A1A1AA] text-base leading-relaxed max-w-2xl mb-14">Un ensemble de technologies modernes couvrant le cycle de développement complet, du design à la production.</p>
      </FadeIn>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FadeIn delay={0.05} className="md:col-span-2"><StackCard cat={STACK_CATEGORIES[0]} /></FadeIn>
        <FadeIn delay={0.1}><StackCard cat={STACK_CATEGORIES[3]} /></FadeIn>
        <FadeIn delay={0.15}><StackCard cat={STACK_CATEGORIES[1]} /></FadeIn>
        <FadeIn delay={0.2}><StackCard cat={STACK_CATEGORIES[2]} /></FadeIn>
        <FadeIn delay={0.25}><StackCard cat={STACK_CATEGORIES[4]} /></FadeIn>
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function CaseStudyBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-[#1E1E1E] rounded-xl p-4 bg-[#0F0F0F]">
      <h4 className="text-xs font-mono text-[#A1A1AA] uppercase tracking-widest mb-3">{title}</h4>
      {children}
    </div>
  );
}

function CaseStudyModal({ project, onClose }: { project: PortfolioProject | null; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (project) { document.body.style.overflow = "hidden"; const t = setTimeout(() => setVisible(true), 10); return () => clearTimeout(t); }
    else { document.body.style.overflow = ""; setVisible(false); }
  }, [project]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  if (!project) return null;
  return (
    <div className={`fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 transition-all duration-300 ${visible ? "opacity-100" : "opacity-0"}`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full md:max-w-3xl max-h-[92vh] bg-[#111111] border border-[#262626] rounded-t-2xl md:rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col ${visible ? "translate-y-0 scale-100" : "translate-y-8 scale-[0.97]"}`}>
        <div className="relative h-52 bg-[#1A1A1A] flex-shrink-0 overflow-hidden">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/50 to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-[#1A1A1A] border border-[#262626] rounded-lg flex items-center justify-center text-[#A1A1AA] hover:text-white hover:border-[#404040] transition-all" aria-label="Fermer"><X size={15} /></button>
          <div className="absolute bottom-5 left-6 right-16">
            <span className="text-[10px] font-mono text-[#3B82F6] tracking-widest uppercase mb-1.5 block">{project.category}</span>
            <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "Manrope, sans-serif" }}>{project.title}</h2>
          </div>
        </div>
        <div className="overflow-y-auto p-6 flex-1 space-y-7">
          <div>
            <h4 className="text-xs font-mono text-[#A1A1AA] uppercase tracking-widest mb-3">Stack technique</h4>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span key={tech} className="text-xs font-mono px-2.5 py-1 rounded-md border border-[#3B82F6]/30 bg-[#3B82F6]/08 text-[#93C5FD]">{tech}</span>
              ))}
            </div>
          </div>
          <CaseStudyBlock title="Contexte"><p className="text-[#A1A1AA] text-sm leading-relaxed">{project.context}</p></CaseStudyBlock>
          <CaseStudyBlock title="Objectifs">
            <ul className="space-y-2">
              {project.objectives.map((obj, i) => <li key={i} className="flex items-start gap-2.5 text-sm text-[#A1A1AA]"><span className="text-[#3B82F6] mt-0.5 flex-shrink-0">▸</span>{obj}</li>)}
            </ul>
          </CaseStudyBlock>
          <div className="grid md:grid-cols-2 gap-4">
            <CaseStudyBlock title="Difficultés rencontrées">
              <ul className="space-y-2">
                {project.challenges.map((c, i) => <li key={i} className="flex items-start gap-2.5 text-sm text-[#A1A1AA]"><span className="text-[#F59E0B] mt-0.5 flex-shrink-0">▸</span>{c}</li>)}
              </ul>
            </CaseStudyBlock>
            <CaseStudyBlock title="Solutions apportées">
              <ul className="space-y-2">
                {project.solutions.map((s, i) => <li key={i} className="flex items-start gap-2.5 text-sm text-[#A1A1AA]"><span className="text-[#10B981] mt-0.5 flex-shrink-0">▸</span>{s}</li>)}
              </ul>
            </CaseStudyBlock>
          </div>
          <CaseStudyBlock title="Ce que j'ai appris">
            <ul className="space-y-2">
              {project.learnings.map((l, i) => <li key={i} className="flex items-start gap-2.5 text-sm text-[#A1A1AA]"><span className="text-[#8B5CF6] mt-0.5 flex-shrink-0">▸</span>{l}</li>)}
            </ul>
          </CaseStudyBlock>
          <div className="flex gap-3 pt-2 pb-1">
            {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm border border-[#262626] text-white px-4 py-2.5 rounded-lg hover:bg-[#1A1A1A] hover:border-[#363636] transition-all font-medium"><Github size={15} />Code source</a>}
            <button onClick={onClose} className="ml-auto text-sm text-[#A1A1AA] hover:text-white transition-colors px-4 py-2.5">Fermer</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, onSelect }: { project: PortfolioProject; onSelect: (p: PortfolioProject) => void }) {
  return (
    <div className="group bg-[#111111] border border-[#262626] rounded-xl overflow-hidden cursor-pointer hover:border-[#3B82F6]/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.06)] flex flex-col" onClick={() => onSelect(project)}>
      <div className="relative h-44 bg-[#1A1A1A] overflow-hidden flex-shrink-0">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-65 group-hover:scale-[1.03] transition-all duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/30 to-transparent" />
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#262626] bg-[#0A0A0A]/80 text-[#A1A1AA] backdrop-blur-sm">{project.category}</span>
          {project.wip && <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-amber-500/30 bg-[#0A0A0A]/80 text-amber-400 backdrop-blur-sm">En cours</span>}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-white mb-2 tracking-tight" style={{ fontFamily: "Manrope, sans-serif" }}>{project.title}</h3>
        <p className="text-[#A1A1AA] text-sm leading-relaxed mb-4 flex-1">{project.shortDesc}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.stack.slice(0, 4).map((tech) => <span key={tech} className="text-[11px] font-mono px-2 py-0.5 rounded border border-[#262626] bg-[#0A0A0A] text-[#A1A1AA]">{tech}</span>)}
          {project.stack.length > 4 && <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-[#262626] bg-[#0A0A0A] text-[#A1A1AA]">+{project.stack.length - 4}</span>}
        </div>
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-1.5 text-xs text-[#3B82F6] font-medium group-hover:gap-2.5 transition-all">Voir le détail<ArrowUpRight size={13} /></button>
          {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[#A1A1AA] hover:text-white transition-colors" aria-label="GitHub"><Github size={15} /></a>}
        </div>
      </div>
    </div>
  );
}

function Projects({ onSelect }: { onSelect: (p: PortfolioProject) => void }) {
  return (
    <section id="projets" className="py-28 bg-[#0D0D0D] border-y border-[#1A1A1A]">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <SectionLabel>Projets</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4" style={{ fontFamily: "Manrope, sans-serif" }}>Ce que j'ai construit</h2>
          <p className="text-[#A1A1AA] text-base leading-relaxed max-w-2xl mb-14">Applications web full-stack, projets de formation et expériences bas niveau. Chaque projet représente une étape concrète de progression.</p>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {PROJECTS.map((project, i) => (
            <FadeIn key={project.id} delay={i * 0.06}>
              <ProjectCard project={project} onSelect={onSelect} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

function Timeline() {
  return (
    <section id="parcours" className="py-28 max-w-6xl mx-auto px-6">
      <FadeIn>
        <SectionLabel>Parcours</SectionLabel>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4" style={{ fontFamily: "Manrope, sans-serif" }}>Formation &amp; expériences</h2>
        <p className="text-[#A1A1AA] text-base leading-relaxed max-w-2xl mb-14">Un parcours atypique et rigoureux, de l'École 42 jusqu'au Bachelor Ingénierie du Web.</p>
      </FadeIn>
      <div className="relative">
        <div className="absolute left-[5.5rem] md:left-36 top-0 bottom-0 w-px bg-gradient-to-b from-[#3B82F6]/40 via-[#262626] to-transparent" />
        <div className="space-y-0">
          {TIMELINE.map((item, i) => (
            <FadeIn key={item.year} delay={i * 0.08}>
              <div className="relative flex items-start gap-8 md:gap-14 py-8">
                <div className="w-14 md:w-24 flex-shrink-0 text-right pt-1"><span className="text-xs font-mono text-[#A1A1AA] leading-tight block">{item.year}</span></div>
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
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact() {
  return (
    <section id="contact" className="py-28 border-t border-[#1A1A1A] bg-[#0D0D0D]">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn><p className="text-xs font-mono tracking-[0.2em] uppercase text-[#3B82F6] mb-3">Contact</p></FadeIn>
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <FadeIn delay={0.05}>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-6" style={{ fontFamily: "Manrope, sans-serif" }}>
              Travaillons<br /><span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)" }}>ensemble.</span>
            </h2>
            <p className="text-[#A1A1AA] text-base leading-relaxed mb-8 max-w-md">Disponible pour une alternance Bachelor 3 Ingénierie du Web à l'ESGI (Lyon / Remote). Ouvert à des projets freelance et des opportunités de stage.</p>
            <a href="mailto:elyas.benyoub@email.com" className="group flex items-center gap-3 text-white text-lg font-semibold hover:text-[#3B82F6] transition-colors duration-200" style={{ fontFamily: "Manrope, sans-serif" }}>
              elyas.benyoub@email.com
              <ArrowUpRight size={18} className="text-[#3B82F6] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Github, label: "GitHub", sublabel: "github.com/elyas", href: "https://github.com", color: "#FFFFFF" },
                { icon: Linkedin, label: "LinkedIn", sublabel: "linkedin.com/in/elyas", href: "https://linkedin.com", color: "#0A66C2" },
                { icon: Mail, label: "Email", sublabel: "elyas.benyoub@email.com", href: "mailto:elyas.benyoub@email.com", color: "#3B82F6" },
                { icon: Download, label: "Curriculum Vitae", sublabel: "Télécharger le PDF", href: "#", color: "#10B981" },
              ].map((link) => {
                const Icon = link.icon;
                return (
                  <a key={link.label} href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined} className="group flex items-start gap-3 p-4 bg-[#111111] border border-[#262626] rounded-xl hover:border-[#363636] hover:bg-[#141414] transition-all duration-200">
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
            <div className="mt-6 flex items-center gap-2 text-xs text-[#4B4B4B] font-mono"><MapPin size={11} />Lyon, France — 2025</div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#1A1A1A] py-6">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#4B4B4B] font-mono">
        <span>EB<span className="text-[#3B82F6]">.</span> — Elyas Benyoub</span>
        <span className="text-center">
          Ce portfolio est développé avec React, TypeScript, Express, MySQL, Docker et un CMS admin maison.
        </span>
      </div>
    </footer>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function PublicPortfolio() {
  const scrollY = useScrollY();
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar scrollY={scrollY} />
      <main>
        <Hero />
        <Stack />
        <Projects onSelect={setSelectedProject} />
        <Timeline />
        <Contact />
      </main>
      <Footer />
      <CaseStudyModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
