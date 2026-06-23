import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Layers,
  GraduationCap,
  Cpu,
  Image,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  ChevronRight,
} from "lucide-react";
import { Toaster } from "sonner";
import useAuth from "../hooks/useAuth";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/projects", label: "Projets", icon: Layers },
  { to: "/admin/parcours", label: "Parcours", icon: GraduationCap },
  { to: "/admin/competences", label: "Compétences", icon: Cpu },
  { to: "/admin/medias", label: "Médias", icon: Image },
  { to: "/admin/parametres", label: "Paramètres", icon: Settings },
];

function NavItem({
  to,
  label,
  icon: Icon,
  collapsed,
  onClick,
  exact = false,
}: {
  to: string;
  label: string;
  icon: React.ElementType;
  collapsed: boolean;
  onClick?: () => void;
  exact?: boolean;
}) {
  const isActive = exact ? window.location.pathname === to : window.location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      onClick={onClick}
      aria-label={collapsed ? label : undefined}
      className={() =>
        `group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
          isActive
            ? "bg-[#1A1A1A] text-white border border-[#2E2E2E]"
            : "text-[#A1A1AA] hover:text-white hover:bg-[#111111] border border-transparent"
        } ${collapsed ? "justify-center" : ""}`
      }
    >
      <Icon
        size={16}
        className={`flex-shrink-0 transition-colors ${isActive ? "text-[#3B82F6]" : "group-hover:text-white"}`}
      />
      {!collapsed && <span style={{ fontFamily: "Inter, sans-serif" }}>{label}</span>}
      {!collapsed && isActive && (
        <ChevronRight size={12} className="ml-auto text-[#3B82F6]" />
      )}
    </NavLink>
  );
}

interface SidebarContentProps {
  collapsed: boolean;
  isMobile?: boolean;
  handleLogout: () => void;
  setMobileOpen: (open: boolean) => void;
}

function SidebarContent({
  collapsed,
  isMobile = false,
  handleLogout,
  setMobileOpen,
}: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-4 py-4 border-b border-[#1A1A1A] flex-shrink-0 ${
          collapsed && !isMobile ? "justify-center px-3" : ""
        }`}
      >
        <div className="w-7 h-7 rounded-lg bg-[#3B82F6] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold font-mono">EB</span>
        </div>
        {(!collapsed || isMobile) && (
          <span className="text-sm font-bold text-white tracking-tight" style={{ fontFamily: "Manrope, sans-serif" }}>
            EB Admin
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.label}
            to={item.to}
            label={item.label}
            icon={item.icon}
            exact={item.exact}
            collapsed={collapsed && !isMobile}
            onClick={isMobile ? () => setMobileOpen(false) : undefined}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-[#1A1A1A] p-2 space-y-0.5">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#A1A1AA] hover:text-white hover:bg-[#111111] transition-all ${
            collapsed && !isMobile ? "justify-center" : ""
          }`}
          aria-label={collapsed && !isMobile ? "Voir le site" : undefined}
        >
          <ExternalLink size={16} className="flex-shrink-0" />
          {(!collapsed || isMobile) && <span>Voir le site</span>}
        </a>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#A1A1AA] hover:text-red-400 hover:bg-red-500/05 transition-all ${
            collapsed && !isMobile ? "justify-center" : ""
          }`}
          aria-label={collapsed && !isMobile ? "Déconnexion" : undefined}
        >
          <LogOut size={16} className="flex-shrink-0" />
          {(!collapsed || isMobile) && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-[#0A0A0A] overflow-hidden">
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 border-r border-[#1A1A1A] bg-[#0A0A0A] transition-all duration-200 relative ${
          collapsed ? "w-[56px]" : "w-[220px]"
        }`}
      >
        <SidebarContent
          collapsed={collapsed}
          handleLogout={handleLogout}
          setMobileOpen={setMobileOpen}
        />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute bottom-[88px] w-5 h-8 bg-[#1A1A1A] border border-[#262626] rounded-r-md flex items-center justify-center text-[#A1A1AA] hover:text-white transition-colors z-10"
          style={{ right: -20, left: "auto" }}
          aria-label={collapsed ? "Développer la navigation" : "Réduire la navigation"}
        >
          <ChevronRight size={11} className={`transition-transform ${collapsed ? "" : "rotate-180"}`} />
        </button>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Fermer le menu"
          />
          <aside role="dialog" aria-modal="true" aria-label="Navigation administration" className="relative w-[260px] bg-[#0A0A0A] border-r border-[#1A1A1A] flex flex-col">
            <SidebarContent
              collapsed={collapsed}
              isMobile
              handleLogout={handleLogout}
              setMobileOpen={setMobileOpen}
            />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar (mobile only) */}
        <div className="md:hidden flex items-center justify-between px-4 h-14 border-b border-[#1A1A1A] flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#3B82F6] flex items-center justify-center">
              <span className="text-white text-[10px] font-bold font-mono">EB</span>
            </div>
            <span className="text-sm font-bold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
              Admin
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="text-[#A1A1AA] hover:text-white p-1"
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>

      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#111111",
            border: "1px solid #262626",
            color: "#FFFFFF",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "13px",
          },
        }}
      />
    </div>
  );
}
