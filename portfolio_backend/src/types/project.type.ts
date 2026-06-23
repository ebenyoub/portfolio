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

export type CreateProjectType = {
    title: string;
    description: string | null;
    tech_stack: string | null;
    github_url: string | null;
    demo_url: string | null;
    image_url: string | null;
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
}

export type Project = CreateProjectType & {
  id: number;
  created_at?: Date;
  updated_at?: Date;
};
