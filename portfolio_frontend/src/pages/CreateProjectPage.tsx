import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/apiFetch";
import ProjectForm, { type ProjectPayload } from "../components/ProjectForm";

const CreateProjectPage = () => {
  const { apiFetch, isLoading } = useFetch();
  const navigate = useNavigate();

  const onSubmit = async (payload: ProjectPayload) => {
    try {
      await apiFetch("/projects", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      toast.success("Projet créé avec succès !");
      navigate("/admin");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-[#111111] border border-[#262626] rounded-xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-white tracking-tight mb-8" style={{ fontFamily: "Manrope, sans-serif" }}>
          Ajouter un nouveau projet
        </h1>

        <ProjectForm
          isLoading={isLoading}
          submitLabel="Créer le projet"
          loadingLabel="Création..."
          onSubmit={onSubmit}
          onCancel={() => navigate("/admin")}
        />
      </div>
    </div>
  );
};

export default CreateProjectPage;
