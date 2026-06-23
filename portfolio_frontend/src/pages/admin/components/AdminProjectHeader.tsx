import { Link } from "react-router-dom";
import { PageDescription, PageHeader, PageTitle } from "../../../components/ui/Page";

const AdminProjectHeader = () => (
  <PageHeader className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <PageTitle className="text-4xl font-extrabold text-gray-900">Administration</PageTitle>
      <PageDescription className="mt-2 text-gray-600">
        Gérez les projets, leur mise en avant sur l'accueil et les sections affichées sur chaque page détail.
      </PageDescription>
    </div>

    <Link
      to="/admin/projects/new"
      className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-3 font-bold text-white transition-colors hover:bg-blue-700"
    >
      Nouveau projet
    </Link>
  </PageHeader>
);

export default AdminProjectHeader;
