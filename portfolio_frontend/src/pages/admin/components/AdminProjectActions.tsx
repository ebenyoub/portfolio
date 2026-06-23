import { Link } from "react-router-dom";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import type { Project } from "../../../types/project";

type AdminProjectActionsProps = {
  project: Project;
  onDeleteProject: (project: Project) => void | Promise<void>;
};

const AdminProjectActions = ({ project, onDeleteProject }: AdminProjectActionsProps) => (
  <div className="flex items-center justify-end gap-1">
    <a
      href={`/projects/${project.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-7 w-7 items-center justify-center rounded-lg text-[#4B4B4B] transition-all hover:bg-[#1A1A1A] hover:text-[#A1A1AA]"
      aria-label="Prévisualiser"
    >
      <ExternalLink size={13} />
    </a>
    <Link
      to={`/admin/projects/${project.id}/edit`}
      className="flex h-7 w-7 items-center justify-center rounded-lg text-[#4B4B4B] transition-all hover:bg-[#3B82F6]/10 hover:text-[#3B82F6]"
      aria-label="Modifier"
    >
      <Pencil size={13} />
    </Link>
    <button
      onClick={() => {
        void onDeleteProject(project);
      }}
      className="flex h-7 w-7 items-center justify-center rounded-lg text-[#4B4B4B] transition-all hover:bg-red-500/10 hover:text-red-400"
      aria-label="Supprimer"
    >
      <Trash2 size={13} />
    </button>
  </div>
);

export default AdminProjectActions;
