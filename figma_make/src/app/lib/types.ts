export type ProjectStatus = "published" | "draft";
export type SkillCategory = "frontend" | "backend" | "database" | "devops" | "tools";
export type ActivityType =
  | "project_updated"
  | "project_added"
  | "skill_added"
  | "career_updated"
  | "settings_updated";

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  description: string;
  image: string;
  gallery: string[];
  stack: string[];
  category: string;
  github: string;
  demo: string;
  status: ProjectStatus;
  updatedAt: string;
  context: string;
  objectives: string[];
  architecture: string;
  challenges: string[];
  solutions: string[];
  results: string;
  learnings: string[];
}

export interface CareerItem {
  id: string;
  title: string;
  institution: string;
  period: string;
  description: string;
  badge: string;
  order: number;
  current: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  order: number;
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroAvailable: boolean;
  email: string;
  github: string;
  linkedin: string;
  location: string;
  cvFilename: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  label: string;
  timestamp: string;
}

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  size: string;
  uploadedAt: string;
}
