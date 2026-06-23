import { Link } from "react-router";
import {
  Layers,
  Cpu,
  GraduationCap,
  Clock,
  Plus,
  FileText,
  Upload,
  ArrowRight,
  Activity,
  TrendingUp,
} from "lucide-react";
import { useApp } from "../lib/context";
import { Card } from "../components/AdminUI";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  href,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  href?: string;
}) {
  const content = (
    <div className="bg-[#111111] border border-[#262626] rounded-xl p-5 hover:border-[#363636] transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: `${color}14`, border: `1px solid ${color}22` }}
        >
          <Icon size={17} style={{ color }} />
        </div>
        {href && (
          <ArrowRight
            size={14}
            className="text-[#4B4B4B] group-hover:text-[#A1A1AA] transition-colors"
          />
        )}
      </div>
      <p
        className="text-2xl font-bold text-white mb-1"
        style={{ fontFamily: "Manrope, sans-serif" }}
      >
        {value}
      </p>
      <p className="text-xs text-[#A1A1AA]">{label}</p>
    </div>
  );
  return href ? <Link to={href}>{content}</Link> : content;
}

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  project_updated: TrendingUp,
  project_added: Plus,
  skill_added: Cpu,
  career_updated: GraduationCap,
  settings_updated: FileText,
};

const ACTIVITY_COLORS: Record<string, string> = {
  project_updated: "#3B82F6",
  project_added: "#10B981",
  skill_added: "#8B5CF6",
  career_updated: "#F59E0B",
  settings_updated: "#A1A1AA",
};

export default function DashboardPage() {
  const { projects, skills, career, activity, settings } = useApp();
  const published = projects.filter((p) => p.status === "published").length;

  const stats = [
    { label: "Projets publiés", value: `${published} / ${projects.length}`, icon: Layers, color: "#3B82F6", href: "/projects" },
    { label: "Compétences", value: skills.length, icon: Cpu, color: "#8B5CF6", href: "/skills" },
    { label: "Étapes du parcours", value: career.length, icon: GraduationCap, color: "#10B981", href: "/career" },
    { label: "Dernière mise à jour", value: activity[0] ? "Aujourd'hui" : "—", icon: Clock, color: "#F59E0B" },
  ];

  const quickActions = [
    { label: "Nouveau projet", icon: Plus, to: "/projects/new", desc: "Ajouter un projet au portfolio" },
    { label: "Modifier le Hero", icon: FileText, to: "/settings", desc: "Titre, sous-titre, disponibilité" },
    { label: "Mettre à jour le CV", icon: Upload, to: "/settings", desc: "Remplacer le fichier PDF" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-mono text-[#3B82F6] tracking-widest uppercase mb-1.5">
          Dashboard
        </p>
        <h1
          className="text-2xl font-bold text-white tracking-tight"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          Bonjour, Elyas 👋
        </h1>
        <p className="text-sm text-[#A1A1AA] mt-1">
          {settings.heroAvailable ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              Disponible pour une alternance — statut actif
            </span>
          ) : (
            "Statut de disponibilité désactivé"
          )}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity */}
        <div className="lg:col-span-2">
          <Card padding={false}>
            <div className="flex items-center gap-2 px-5 py-4 border-b border-[#1A1A1A]">
              <Activity size={15} className="text-[#3B82F6]" />
              <h2
                className="text-sm font-bold text-white"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                Activité récente
              </h2>
            </div>
            <div>
              {activity.slice(0, 6).map((item, i) => {
                const Icon = ACTIVITY_ICONS[item.type] ?? Clock;
                const color = ACTIVITY_COLORS[item.type] ?? "#A1A1AA";
                return (
                  <div
                    key={item.id}
                    className={`flex items-start gap-4 px-5 py-3.5 ${
                      i < activity.slice(0, 6).length - 1
                        ? "border-b border-[#111111]"
                        : ""
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${color}14` }}
                    >
                      <Icon size={13} style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{item.label}</p>
                      <p className="text-xs text-[#A1A1AA] font-mono mt-0.5">{item.timestamp}</p>
                    </div>
                  </div>
                );
              })}
              {activity.length === 0 && (
                <div className="px-5 py-8 text-center text-sm text-[#4B4B4B] font-mono">
                  Aucune activité pour le moment
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Quick actions */}
        <div>
          <Card padding={false}>
            <div className="flex items-center gap-2 px-5 py-4 border-b border-[#1A1A1A]">
              <ArrowRight size={15} className="text-[#3B82F6]" />
              <h2
                className="text-sm font-bold text-white"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                Accès rapide
              </h2>
            </div>
            <div className="p-3 space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.label}
                    to={action.to}
                    className="group flex items-start gap-3 p-3 rounded-lg hover:bg-[#141414] border border-transparent hover:border-[#1E1E1E] transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-[#3B82F6]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
                        {action.label}
                      </p>
                      <p className="text-xs text-[#A1A1AA] mt-0.5">{action.desc}</p>
                    </div>
                    <ArrowRight
                      size={13}
                      className="ml-auto text-[#4B4B4B] group-hover:text-[#A1A1AA] flex-shrink-0 mt-1 transition-colors"
                    />
                  </Link>
                );
              })}
            </div>
          </Card>

          {/* Draft warning */}
          {projects.filter((p) => p.status === "draft").length > 0 && (
            <Link to="/projects">
              <div className="mt-4 p-4 bg-amber-500/06 border border-amber-500/20 rounded-xl hover:border-amber-500/35 transition-colors">
                <p className="text-xs font-mono text-amber-400 mb-1">Brouillons en attente</p>
                <p className="text-sm text-white font-medium" style={{ fontFamily: "Manrope, sans-serif" }}>
                  {projects.filter((p) => p.status === "draft").length} projet
                  {projects.filter((p) => p.status === "draft").length > 1 ? "s" : ""} non publié
                  {projects.filter((p) => p.status === "draft").length > 1 ? "s" : ""}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
