export type ProjectDisplaySettings = {
  show_cover: boolean;
  show_gallery: boolean;
  show_presentation: boolean;
  show_context: boolean;
  show_objective: boolean;
  show_challenges: boolean;
  show_solution: boolean;
  show_learned_skills: boolean;
};

export type Project = {
  id: number;
  title: string;
  description: string;
  image_url?: string | null;
  tech_stack?: string | null;
  github_url?: string | null;
  demo_url?: string | null;
  context?: string | null;
  objective?: string | null;
  learned_skills?: string[] | string | null;
  technical_stack?: string[] | string | null;
  gallery_images?: string[] | string | null;
  display_settings?: Partial<ProjectDisplaySettings> | string | null;
  is_featured?: boolean | number | null;
  featured_order?: number | null;
  challenges?: string | null;
  solution?: string | null;
};

export type GalleryImageFormValue = {
  url: string;
  file?: File;
  previewUrl?: string;
};

export const defaultProjectDisplaySettings: ProjectDisplaySettings = {
  show_cover: true,
  show_gallery: false,
  show_presentation: true,
  show_context: true,
  show_objective: true,
  show_challenges: true,
  show_solution: true,
  show_learned_skills: true,
};
