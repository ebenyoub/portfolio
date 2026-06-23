const Footer = () => {
  return (
    <footer className="border-t border-[#1A1A1A] py-6 bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#4B4B4B] font-mono">
        <span>EB<span className="text-[#3B82F6]">.</span> — Elyas Benyoub</span>
        <span className="text-center sm:text-right">
          Ce portfolio est développé avec React, TypeScript, Express, MySQL, Docker et un CMS admin maison.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
