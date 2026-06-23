import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import FeaturedProjectsCarousel from "../components/FeaturedProjectsCarousel";
import useFetch from "../hooks/apiFetch";

vi.mock("../hooks/apiFetch", () => ({ default: vi.fn() }));

const mockUseFetch = vi.mocked(useFetch);

const projects = [
  { id: 1, title: "Second projet", description: "Second", is_featured: true, featured_order: 2 },
  { id: 2, title: "Projet non sélectionné", description: "Hidden", is_featured: false, featured_order: 0 },
  { id: 3, title: "Premier projet", description: "First", is_featured: 1, featured_order: 1 },
];

const renderCarousel = () => render(
  <MemoryRouter>
    <FeaturedProjectsCarousel />
  </MemoryRouter>
);

describe("FeaturedProjectsCarousel", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders only featured projects in featured_order order", async () => {
    mockUseFetch.mockReturnValue({ apiFetch: vi.fn().mockResolvedValue({ data: projects }), isLoading: false });
    renderCarousel();

    await waitFor(() => expect(screen.getByRole("heading", { name: "Premier projet" })).toBeInTheDocument());
    expect(screen.queryByText("Projet non sélectionné")).not.toBeInTheDocument();
  });

  it("navigates to the next and previous featured project", async () => {
    const user = userEvent.setup();
    mockUseFetch.mockReturnValue({ apiFetch: vi.fn().mockResolvedValue({ data: projects }), isLoading: false });
    renderCarousel();

    await screen.findByRole("heading", { name: "Premier projet" });
    await user.click(screen.getByRole("button", { name: "Projet suivant" }));
    expect(screen.getByRole("heading", { name: "Second projet" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Projet précédent" }));
    expect(screen.getByRole("heading", { name: "Premier projet" })).toBeInTheDocument();
  });

  it("renders nothing when no project is featured", async () => {
    const apiFetch = vi.fn().mockResolvedValue({ data: [projects[1]] });
    mockUseFetch.mockReturnValue({ apiFetch, isLoading: false });
    renderCarousel();

    await waitFor(() => expect(apiFetch).toHaveBeenCalledWith("/projects"));
    expect(screen.queryByText("Projets sélectionnés")).not.toBeInTheDocument();
  });
});
