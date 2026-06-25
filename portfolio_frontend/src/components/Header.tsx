import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { X, Terminal } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrolled = scrollY > 48;
  const isHomePage = location.pathname === "/";

  const menuItems = [
    { label: "Accueil", href: isHomePage ? "#" : "/" },
    { label: "Projets", href: isHomePage ? "#projets" : "/projects" },
    { label: "Stack", href: isHomePage ? "#stack" : "/#stack" },
    { label: "Parcours", href: isHomePage ? "#parcours" : "/#parcours" },
    { label: "Contact", href: "/contact" }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0A0A0A]/85 backdrop-blur-2xl border-b border-[#262626]" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <NavLink to="/" className="font-mono text-sm font-semibold text-white tracking-tight select-none">
          EB<span className="text-[#3B82F6]">.</span>
        </NavLink>
        
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            item.href.startsWith("#") ? (
              <a key={item.label} href={item.href} className="text-sm text-[#A1A1AA] hover:text-white transition-colors duration-150">
                {item.label}
              </a>
            ) : (
              <NavLink key={item.label} to={item.href} className="text-sm text-[#A1A1AA] hover:text-white transition-colors duration-150">
                {item.label}
              </NavLink>
            )
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <NavLink to="/contact" className="flex items-center gap-2 text-sm bg-[#3B82F6] text-white px-4 py-2 rounded-lg hover:bg-[#2563EB] transition-colors font-medium">
            Me contacter
          </NavLink>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-[#A1A1AA] hover:text-white p-1" aria-label="Menu">
          {menuOpen ? <X size={20} /> : <Terminal size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[#262626] bg-[#0A0A0A] px-6 py-4 flex flex-col gap-4">
          {menuItems.map((item) => (
            item.href.startsWith("#") ? (
              <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className="text-sm text-[#A1A1AA] hover:text-white transition-colors">
                {item.label}
              </a>
            ) : (
              <NavLink key={item.label} to={item.href} onClick={() => setMenuOpen(false)} className="text-sm text-[#A1A1AA] hover:text-white transition-colors">
                {item.label}
              </NavLink>
            )
          ))}
          <NavLink to="/contact" onClick={() => setMenuOpen(false)} className="text-sm text-[#3B82F6] font-medium mt-2">
            Me contacter →
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Header;
