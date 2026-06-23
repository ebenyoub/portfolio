import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Button from "../../components/ui/Button";
import Container from "../../components/ui/Container";
import { LoadingState } from "../../components/ui/Page";
import useFetch from "../../hooks/apiFetch";
import type { Project } from "../../types/project";
import { parseDisplaySettings, parseJsonArray } from "../../utils/project";
import ProjectDetailsSections from "./components/ProjectDetailsSections";
import ProjectHero from "./components/ProjectHero";
import ProjectImageModal from "./components/ProjectImageModal";
import { getNextIndex, getPreviousIndex, getProjectImages } from "./utils/projectImages";

const ProjectDetailPage = () => {
  const { apiFetch, isLoading } = useFetch();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [modalImageIndex, setModalImageIndex] = useState<number | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFetch(`/projects/${id}`);
        setProject(response.data);
        setActiveImageIndex(0);
        setModalImageIndex(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          toast.error(err.message);
        }
      }
    };

    if (id) {
      fetchData();
    }
  }, [apiFetch, id]);

  const displaySettings = project ? parseDisplaySettings(project.display_settings, project) : parseDisplaySettings(null);
  const projectImages = project ? getProjectImages(project, displaySettings) : [];
  const modalImage = modalImageIndex !== null ? projectImages[modalImageIndex] : null;

  useEffect(() => {
    if (modalImageIndex === null || projectImages.length === 0) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModalImageIndex(null);
      }

      if (event.key === "ArrowLeft") {
        setModalImageIndex((current) => current === null ? current : getPreviousIndex(current, projectImages.length));
      }

      if (event.key === "ArrowRight") {
        setModalImageIndex((current) => current === null ? current : getNextIndex(current, projectImages.length));
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalImageIndex, projectImages.length]);

  if (isLoading && !project) {
    return (
      <Container className="py-20 flex justify-center items-center">
        <LoadingState className="animate-pulse text-xl font-medium text-gray-500">
          <p>Chargement du projet...</p>
        </LoadingState>
      </Container>
    );
  }

  if (error || !project) {
    return (
      <Container className="py-20 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Projet non trouvé</h2>
        <Button onClick={() => navigate("/projects")}>Retour aux projets</Button>
      </Container>
    );
  }

  const technologies = project.tech_stack
    ? project.tech_stack.split(",").map((tech) => tech.trim()).filter(Boolean)
    : parseJsonArray(project.technical_stack);
  const learnedSkills = parseJsonArray(project.learned_skills);
  const hasCarousel = displaySettings.show_gallery && projectImages.length > 1;
  const showMediaSection = displaySettings.show_cover || displaySettings.show_gallery;
  const showPresentation = displaySettings.show_presentation && Boolean(project.description);
  const showContext = displaySettings.show_context && Boolean(project.context);
  const showObjective = displaySettings.show_objective && Boolean(project.objective);
  const showChallenges = displaySettings.show_challenges && Boolean(project.challenges);
  const showSolution = displaySettings.show_solution && Boolean(project.solution);
  const showLearnedSkills = displaySettings.show_learned_skills && learnedSkills.length > 0;
  const showPreviousImage = () => setActiveImageIndex((current) => getPreviousIndex(current, projectImages.length));
  const showNextImage = () => setActiveImageIndex((current) => getNextIndex(current, projectImages.length));
  const showPreviousModalImage = () => setModalImageIndex((current) => current === null ? current : getPreviousIndex(current, projectImages.length));
  const showNextModalImage = () => setModalImageIndex((current) => current === null ? current : getNextIndex(current, projectImages.length));

  return (
    <div className="min-h-screen bg-white">
      <Container className="!max-w-6xl flex-col py-8 md:py-12">
        <button
          type="button"
          onClick={() => navigate("/projects")}
          className="mb-8 inline-flex w-fit items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span className="mr-2">←</span> Retour aux projets
        </button>

        <ProjectHero
          project={project}
          technologies={technologies}
          projectImages={projectImages}
          activeImageIndex={activeImageIndex}
          hasCarousel={hasCarousel}
          showMediaSection={showMediaSection}
          onPreviousImage={showPreviousImage}
          onNextImage={showNextImage}
          onSelectImage={setActiveImageIndex}
          onOpenImage={setModalImageIndex}
        />
      </Container>

      <ProjectDetailsSections
        project={project}
        learnedSkills={learnedSkills}
        showPresentation={showPresentation}
        showContext={showContext}
        showObjective={showObjective}
        showChallenges={showChallenges}
        showSolution={showSolution}
        showLearnedSkills={showLearnedSkills}
      />

      <ProjectImageModal
        image={modalImage}
        imageIndex={modalImageIndex}
        imageCount={projectImages.length}
        hasCarousel={hasCarousel}
        onClose={() => setModalImageIndex(null)}
        onPreviousImage={showPreviousModalImage}
        onNextImage={showNextModalImage}
      />
    </div>
  );
};

export default ProjectDetailPage;
