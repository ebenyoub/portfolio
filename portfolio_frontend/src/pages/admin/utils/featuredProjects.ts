import type { Project } from "../../../types/project";

export const isProjectFeatured = (project: Project) => (
  project.is_featured === true || project.is_featured === 1
);

export const getFeaturedOrder = (project: Project) => (
  typeof project.featured_order === "number" ? project.featured_order : 0
);
