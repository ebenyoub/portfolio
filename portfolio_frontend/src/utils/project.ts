import {
  defaultProjectDisplaySettings,
  type Project,
  type ProjectDisplaySettings,
} from "../types/project";

export const cub3dGalleryPaths = [
  "/project-images/cub3d/cub3d-1.png",
  "/project-images/cub3d/cub3d-2.png",
  "/project-images/cub3d/cub3d-3.png",
  "/project-images/cub3d/cub3d-4.png",
];

export const isCub3dProject = (project: Pick<Project, "title">) => (
  project.title.toLowerCase().replace(/\s/g, "") === "cub3d"
);

export const parseJsonArray = (value: string[] | string | null | undefined): string[] => {
  if (Array.isArray(value)) return value;
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
};

export const parseDisplaySettings = (
  value: Partial<ProjectDisplaySettings> | string | null | undefined,
  project?: Pick<Project, "title">
): ProjectDisplaySettings => {
  const fallback = {
    ...defaultProjectDisplaySettings,
    show_gallery: project && isCub3dProject(project) ? true : defaultProjectDisplaySettings.show_gallery,
  };

  if (!value) return fallback;

  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      return typeof parsed === "object" && parsed !== null
        ? { ...fallback, ...parsed }
        : fallback;
    } catch {
      return fallback;
    }
  }

  return {
    ...fallback,
    ...value,
  };
};
