import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProjectsPage from "../pages/ProjectsPage";
import ProjectDetailPage from "../pages/project-detail/ProjectDetailPage";
import useFetch from "../hooks/apiFetch";

vi.mock("../hooks/apiFetch", () => ({
  default: vi.fn(),
}));

const mockUseFetch = vi.mocked(useFetch);

const mockProject = {
  id: 1,
  title: "React Calculator",
  description: "A super interactive calculator built with React.",
  tech_stack: "React, CSS, Vitest",
  image_url: "https://example.com/project.png",
  github_url: "https://github.com/test/calculator",
  demo_url: "https://calculator.demo.com",
};

describe("Frontend Projects Pages Integration Tests", () => {
  describe("ProjectsPage", () => {
    it("renders loading state", () => {
      mockUseFetch.mockReturnValue({
        apiFetch: vi.fn().mockImplementation(() => new Promise(() => {})), // never resolves
        isLoading: true,
      });

      render(
        <MemoryRouter>
          <ProjectsPage />
        </MemoryRouter>
      );

      // The page displays "Chargement de la galerie..." while loading projects
      expect(screen.getByText(/Chargement de la galerie.../i)).toBeInTheDocument();
    });

    it("renders list of projects successfully", async () => {
      mockUseFetch.mockReturnValue({
        apiFetch: vi.fn().mockResolvedValue({
          data: [mockProject],
        }),
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <ProjectsPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("React Calculator")).toBeInTheDocument();
      });
      expect(screen.getByText("A super interactive calculator built with React.")).toBeInTheDocument();
    });

    it("renders error state when projects cannot be loaded", async () => {
      mockUseFetch.mockReturnValue({
        apiFetch: vi.fn().mockRejectedValue(new Error("Impossible de charger les projets.")),
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <ProjectsPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Impossible de charger les projets.")).toBeInTheDocument();
      });
    });
  });

  describe("ProjectDetailPage", () => {
    it("renders loading state", () => {
      mockUseFetch.mockReturnValue({
        apiFetch: vi.fn().mockImplementation(() => new Promise(() => {})), // never resolves
        isLoading: true,
      });

      render(
        <MemoryRouter initialEntries={["/projects/1"]}>
          <Routes>
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText(/Chargement du projet.../i)).toBeInTheDocument();
    });

    it("renders error state when project is not found", async () => {
      const apiFetchMock = vi.fn().mockRejectedValue(new Error("Projet non trouvé."));
      mockUseFetch.mockReturnValue({
        apiFetch: apiFetchMock,
        isLoading: false,
      });

      render(
        <MemoryRouter initialEntries={["/projects/999"]}>
          <Routes>
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Projet non trouvé")).toBeInTheDocument();
      });
    });

    it("renders project details on success", async () => {
      mockUseFetch.mockReturnValue({
        apiFetch: vi.fn().mockResolvedValue({
          success: true,
          data: mockProject,
        }),
        isLoading: false,
      });

      render(
        <MemoryRouter initialEntries={["/projects/1"]}>
          <Routes>
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("React Calculator")).toBeInTheDocument();
      });

      expect(screen.getByText("A super interactive calculator built with React.")).toBeInTheDocument();
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("CSS")).toBeInTheDocument();
    });
  });
});
