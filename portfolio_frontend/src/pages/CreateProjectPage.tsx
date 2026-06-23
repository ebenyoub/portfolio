import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
import { FormTitle } from "../components/ui/Form";
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
    <Container className="py-12 max-w-4xl">
      <Card className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl md:p-12">
        <FormTitle className="text-3xl font-extrabold text-gray-900 mb-8">
          Ajouter un nouveau projet
        </FormTitle>

        <ProjectForm
          isLoading={isLoading}
          submitLabel="Créer le projet"
          loadingLabel="Création..."
          onSubmit={onSubmit}
          onCancel={() => navigate("/admin")}
        />
      </Card>
    </Container>
  );
};

export default CreateProjectPage;
