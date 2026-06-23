import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProjectImageModal from "../pages/project-detail/components/ProjectImageModal";
import GalleryImagesField from "../components/GalleryImagesField";

describe("Accessibility regressions", () => {
  it("exposes a labelled modal and named carousel controls", () => {
    render(
      <ProjectImageModal
        image={{ src: "https://example.com/image.png", alt: "Interface du projet" }}
        imageIndex={0}
        imageCount={2}
        hasCarousel
        onClose={vi.fn()}
        onPreviousImage={vi.fn()}
        onNextImage={vi.fn()}
      />
    );

    expect(screen.getByRole("dialog", { name: "Aperçu de Interface du projet" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fermer l'image" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Image suivante" })).toBeInTheDocument();
  });

  it("announces gallery validation errors and names image actions", () => {
    render(
      <GalleryImagesField
        label="Images du carousel"
        images={[{ id: "image-1", url: "invalid-url" }]}
        errors={["URL invalide"]}
        onAddUrl={vi.fn()}
        onAppendFiles={vi.fn()}
        onChangeImage={vi.fn()}
        onRemoveImage={vi.fn()}
        onMoveImage={vi.fn()}
      />
    );

    expect(screen.getByRole("alert")).toHaveTextContent("URL invalide");
    expect(screen.getByRole("button", { name: "Supprimer l'image 1" })).toBeInTheDocument();
  });
});
