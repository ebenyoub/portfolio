import { Link } from "react-router-dom";
import Button from "../../../components/ui/Button";
import type { Project } from "../../../types/project";

type AdminProjectActionsProps = {
  project: Project;
  onDeleteProject: (project: Project) => void | Promise<void>;
};

const AdminProjectActions = ({ project, onDeleteProject }: AdminProjectActionsProps) => (
  <div className="flex gap-2 lg:justify-end">
    <Link
      to={`/projects/${project.id}`}
      className="rounded-md bg-gray-100 px-3 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200"
    >
      Voir
    </Link>
    <Link
      to={`/admin/projects/${project.id}/edit`}
      className="rounded-md bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-100"
    >
      Modifier
    </Link>
    <Button
      type="button"
      onClick={() => {
        void onDeleteProject(project);
      }}
      className="bg-red-50 px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-100"
    >
      Supprimer
    </Button>
  </div>
);

export default AdminProjectActions;
