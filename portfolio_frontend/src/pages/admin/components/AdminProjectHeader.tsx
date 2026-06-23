import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const AdminProjectHeader = () => (
  <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="text-xs font-mono tracking-[0.2em] uppercase text-[#3B82F6] mb-1">Gestion</p>
      <h1 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "Manrope, sans-serif" }}>
        Projets
      </h1>
      <p className="mt-2 text-sm text-[#A1A1AA]">
        Gérerez les projets, leur mise en avant sur l'accueil et les sections de détail.
      </p>
    </div>

    <Link
      to="/admin/projects/new"
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2563EB]"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <Plus size={15} />
      Nouveau projet
    </Link>
  </div>
);

export default AdminProjectHeader;
