import { Link } from "react-router-dom";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import type { Project } from "../../../types/project";

type AdminProjectActionsProps = {
  project: Project;
  onDeleteProject: (project: Project) => void | Promise<void>;
};

const AdminProjectActions = ({ project, onDeleteProject }: AdminProjectActionsProps) => (
  <div className="flex items-center justify-end gap-1.5">
    <a
      href={`/projects/${project.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#262626] bg-[#0A0A0A] text-[#4B4B4B] transition-colors hover:border-[#363636] hover:text-[#D4D4D8]"
      aria-label="Prévisualiser"
    >
      <ExternalLink size={14} />
    </a>
    <Link
      to={`/admin/projects/${project.id}/edit`}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#262626] bg-[#0A0A0A] text-[#4B4B4B] transition-colors hover:border-[#3B82F6]/30 hover:text-[#3B82F6]"
      aria-label="Modifier"
    >
      <Pencil size={14} />
    </Link>
    <button
      onClick={() => {
        void onDeleteProject(project);
      }}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#262626] bg-[#0A0A0A] text-[#4B4B4B] transition-colors hover:border-red-500/30 hover:text-red-400"
      aria-label="Supprimer"
    >
      <Trash2 size={14} />
    </button>
  </div>
);

export default AdminProjectActions;
