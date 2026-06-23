import type { Project } from "../types/project";
import { parseJsonArray } from "./project";

const PROJECT_CATEGORY_RULES = [
  {
    label: "Bas niveau",
    keywords: ["cub3d", "minilibx", "raycasting", "trigonometrie", "trigonométrie"],
  },
  {
    label: "Backend",
    keywords: ["php", "pdo"],
  },
  {
    label: "Full-Stack",
    keywords: ["express", "mysql", "jwt", "nodemailer", "docker"],
  },
  {
    label: "Frontend",
    keywords: ["react", "redux", "javascript", "typescript", "tailwind css"],
  },
];

const normalize = (value: string) => value.trim().toLowerCase();

export const getProjectTechnologies = (project: Project) => {
  if (project.tech_stack) {
    return project.tech_stack
      .split(",")
      .map((tech) => tech.trim())
      .filter(Boolean);
  }

  return parseJsonArray(project.technical_stack);
};

export const getProjectCategory = (project: Project) => {
  const technologies = getProjectTechnologies(project).map(normalize);
  const searchableValues = [
    project.title,
    project.description,
    ...technologies,
  ]
    .filter(Boolean)
    .map((value) => normalize(String(value)));

  if (technologies.includes("c")) {
    return "Bas niveau";
  }

  const matchingRule = PROJECT_CATEGORY_RULES.find((rule) => (
    rule.keywords.some((keyword) => searchableValues.some((value) => value.includes(keyword)))
  ));

  return matchingRule?.label ?? "Projet web";
};

export const getProjectBulletList = (value: string | null | undefined) => (
  value
    ? value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
    : []
);
