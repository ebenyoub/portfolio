import type { Project, ProjectDisplaySettings } from "../../../types/project";
import { parseJsonArray } from "../../../utils/project";

export type ProjectImage = {
  src: string;
  alt: string;
};

export const getPreviousIndex = (current: number, total: number) => (
  current === 0 ? total - 1 : current - 1
);

export const getNextIndex = (current: number, total: number) => (current + 1) % total;

export const getProjectImages = (
  project: Project,
  displaySettings: ProjectDisplaySettings
): ProjectImage[] => {
  if (displaySettings.show_gallery) {
    const galleryImages = parseJsonArray(project.gallery_images).map((src, index) => ({
      src,
      alt: `${project.title} - image ${index + 1}`,
    }));

    if (galleryImages.length > 0) {
      return galleryImages;
    }
  }

  if (displaySettings.show_cover && project.image_url) {
    return [{ src: project.image_url, alt: project.title }];
  }

  return [];
};
