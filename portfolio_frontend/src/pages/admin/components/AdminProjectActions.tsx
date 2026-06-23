import { Link } from "react-router-dom";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import type { Project } from "../../../types/project";

type AdminProjectActionsProps = {
  project: Project;
  onDeleteProject: (project: Project) => void | Promise<void>;
};

const AdminProjectActions = ({ project, onDeleteProject }: AdminProjectActionsProps) => (
  <div className="flex items-center gap-1.5 justify-end">
    <a
      href={`/projects/${project.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4B4B4B] hover:text-[#A1A1AA] hover:bg-[#1A1A1A] transition-all"
      aria-label="Prévisualiser"
    >
      <ExternalLink size={14} />
    </a>
    <Link
      to={`/admin/projects/${project.id}/edit`}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4B4B4B] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 transition-all"
      aria-label="Modifier"
    >
      <Pencil size={14} />
    </Link>
    <button
      onClick={() => {
        void onDeleteProject(project);
      }}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4B4B4B] hover:text-red-400 hover:bg-red-500/10 transition-all"
      aria-label="Supprimer"
    >
      <Trash2 size={14} />
    </button>
  </div>
);

export default AdminProjectActions;
