import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router";
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
import { useApp } from "../lib/context";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projets", icon: Layers },
  { to: "/career", label: "Parcours", icon: GraduationCap },
  { to: "/skills", label: "Compétences", icon: Cpu },
  { to: "/media", label: "Médias", icon: Image },
  { to: "/settings", label: "Paramètres", icon: Settings },
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
        `group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
          isActive
            ? "bg-[#1A1A1A] text-white border border-[#2E2E2E]"
            : "text-[#A1A1AA] hover:text-white hover:bg-[#111111] border border-transparent"
        } ${collapsed ? "justify-center" : ""}`
      }
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

export default function AdminLayout() {
  const { isAuthenticated, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login", { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) return null;

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`flex flex-col h-full ${isMobile ? "" : ""}`}>
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
          <div className="min-w-0">
            <p className="text-sm font-bold text-white leading-none" style={{ fontFamily: "Manrope, sans-serif" }}>
              EB Admin
            </p>
            <p className="text-[10px] text-[#A1A1AA] font-mono mt-0.5">Portfolio CMS</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.to}
            {...item}
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
        >
          <ExternalLink size={16} className="flex-shrink-0" />
          {(!collapsed || isMobile) && <span>Voir le site</span>}
        </a>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#A1A1AA] hover:text-red-400 hover:bg-red-500/05 transition-all ${
            collapsed && !isMobile ? "justify-center" : ""
          }`}
        >
          <LogOut size={16} className="flex-shrink-0" />
          {(!collapsed || isMobile) && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0A0A0A] overflow-hidden">
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 border-r border-[#1A1A1A] bg-[#0A0A0A] transition-all duration-200 ${
          collapsed ? "w-[56px]" : "w-[220px]"
        }`}
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute bottom-[88px] left-0 w-5 h-8 bg-[#1A1A1A] border border-[#262626] rounded-r-md flex items-center justify-center text-[#A1A1AA] hover:text-white transition-colors z-10"
          style={{ left: collapsed ? 44 : 208 }}
        >
          <ChevronRight size={11} className={`transition-transform ${collapsed ? "" : "rotate-180"}`} />
        </button>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-[260px] bg-[#0A0A0A] border-r border-[#1A1A1A] flex flex-col">
            <SidebarContent isMobile />
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
          <div className="max-w-5xl mx-auto px-5 md:px-8 py-8">
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
