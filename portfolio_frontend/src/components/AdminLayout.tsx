import { useEffect, useState } from "react";
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
  X,
  ChevronRight,
} from "lucide-react";
import { Toaster } from "sonner";
import useAuth from "../hooks/useAuth";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
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
}: {
  to: string;
  label: string;
  icon: React.ElementType;
  collapsed: boolean;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-all duration-150 ${
          isActive
            ? "border-[#2E2E2E] bg-[#1A1A1A] text-white"
            : "border-transparent text-[#A1A1AA] hover:bg-[#111111] hover:text-white"
        } ${collapsed ? "justify-center" : ""}`
      }
      aria-label={collapsed ? label : undefined}
    >
      {({ isActive }) => (
        <>
          <Icon
            size={16}
            className={`flex-shrink-0 transition-colors ${isActive ? "text-[#3B82F6]" : "group-hover:text-white"}`}
          />
          {!collapsed && <span style={{ fontFamily: "Inter, sans-serif" }}>{label}</span>}
          {!collapsed && isActive && (
            <ChevronRight size={12} className="ml-auto text-[#3B82F6]" />
          )}
        </>
      )}
    </NavLink>
  );
}

type SidebarContentProps = {
  collapsed: boolean;
  isMobile?: boolean;
  handleLogout: () => void;
  setMobileOpen: (open: boolean) => void;
};

function SidebarContent({
  collapsed,
  isMobile = false,
  handleLogout,
  setMobileOpen,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      <div
        className={`flex flex-shrink-0 items-center gap-3 border-b border-[#1A1A1A] px-4 py-4 ${
          collapsed && !isMobile ? "justify-center px-3" : ""
        }`}
      >
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#3B82F6]">
          <span className="font-mono text-xs font-bold text-white">EB</span>
        </div>
        {(!collapsed || isMobile) && (
          <div className="min-w-0">
            <p className="text-sm font-bold leading-none text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
              EB Admin
            </p>
            <p className="mt-0.5 text-[10px] font-mono text-[#A1A1AA]">Portfolio CMS</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-4">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.to}
            {...item}
            collapsed={collapsed && !isMobile}
            onClick={isMobile ? () => setMobileOpen(false) : undefined}
          />
        ))}
      </nav>

      <div className="flex-shrink-0 space-y-0.5 border-t border-[#1A1A1A] p-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#A1A1AA] transition-all hover:bg-[#111111] hover:text-white ${
            collapsed && !isMobile ? "justify-center" : ""
          }`}
          aria-label={collapsed && !isMobile ? "Voir le site" : undefined}
        >
          <ExternalLink size={16} className="flex-shrink-0" />
          {(!collapsed || isMobile) && <span>Voir le site</span>}
        </a>
        <button
          onClick={handleLogout}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#A1A1AA] transition-all hover:bg-red-500/5 hover:text-red-400 ${
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
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#0A0A0A]">
      <aside
        className={`relative hidden flex-shrink-0 flex-col border-r border-[#1A1A1A] bg-[#0A0A0A] transition-all duration-200 md:flex ${
          collapsed ? "w-[56px]" : "w-[220px]"
        }`}
      >
        <SidebarContent
          collapsed={collapsed}
          handleLogout={handleLogout}
          setMobileOpen={setMobileOpen}
        />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute bottom-[88px] left-0 z-10 flex h-8 w-5 items-center justify-center rounded-r-md border border-[#262626] bg-[#1A1A1A] text-[#A1A1AA] transition-colors hover:text-white"
          style={{ left: collapsed ? 44 : 208 }}
          aria-label={collapsed ? "Développer la navigation" : "Réduire la navigation"}
        >
          <ChevronRight size={11} className={`transition-transform ${collapsed ? "" : "rotate-180"}`} />
        </button>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Fermer le menu"
          />
          <aside className="relative flex w-[260px] flex-col border-r border-[#1A1A1A] bg-[#0A0A0A]">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 z-10 text-[#A1A1AA] hover:text-white"
              aria-label="Fermer la navigation"
            >
              <X size={16} />
            </button>
            <SidebarContent
              collapsed={collapsed}
              isMobile
              handleLogout={handleLogout}
              setMobileOpen={setMobileOpen}
            />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-[#1A1A1A] px-4 md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#3B82F6]">
              <span className="font-mono text-[10px] font-bold text-white">EB</span>
            </div>
            <span className="text-sm font-bold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
              Admin
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1 text-[#A1A1AA] hover:text-white"
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-5xl px-5 py-6 md:px-8 md:py-8">
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
