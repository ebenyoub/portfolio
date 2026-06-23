// src/validators/project.validator.ts

import { body, param } from "express-validator";

const isUrlOrLocalPath = (value: unknown) => {
  if (typeof value !== "string") return false;
  if (value.startsWith("/")) return true;

  return isHttpUrl(value);
};

const isHttpUrl = (value: unknown) => {
  if (typeof value !== "string") return false;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const optionalText = (field: string, label: string, max = 2000) => body(field)
  .optional({ values: "null" })
  .isString().withMessage(`${label} doit être une chaîne de caractères.`)
  .bail()
  .isLength({ max }).withMessage(`${label} ne doit pas dépasser ${max} caractères.`);

const optionalUrl = (field: string, label: string) => body(field)
  .optional({ values: "null" })
  .custom(isUrlOrLocalPath).withMessage(`${label} doit être une URL valide ou un chemin local.`);

const optionalHttpUrl = (field: string, label: string) => body(field)
  .optional({ values: "null" })
  .custom(isHttpUrl).withMessage(`${label} doit commencer par http:// ou https://.`);

const optionalStringArray = (field: string, label: string) => body(field)
  .optional({ values: "null" })
  .isArray().withMessage(`${label} doit être une liste.`);

const optionalImageArray = body("gallery_images")
  .optional({ values: "null" })
  .isArray().withMessage("La galerie doit être une liste d'images.")
  .bail()
  .custom((images: string[]) => images.every(isUrlOrLocalPath))
  .withMessage("Chaque image de la galerie doit être une URL valide ou un chemin local.");

const requireGalleryImagesWhenEnabled = body("gallery_images")
  .custom((images: unknown, { req }) => {
    const showGallery = req.body?.display_settings?.show_gallery === true;

    if (!showGallery) return true;

    if (!Array.isArray(images) || images.length === 0) {
      throw new Error("Ajoutez au moins une image pour activer le carousel.");
    }

    return true;
  });

const optionalDisplaySettings = [
  body("display_settings")
    .optional({ values: "null" })
    .isObject().withMessage("Les réglages d'affichage doivent être un objet."),
  body("display_settings.*")
    .optional()
    .isBoolean().withMessage("Chaque réglage d'affichage doit être un booléen."),
];

const optionalHomepageSettings = [
  body("is_featured")
    .optional({ values: "null" })
    .isBoolean().withMessage("La sélection accueil doit être un booléen."),
  body("featured_order")
    .optional({ values: "null" })
    .isInt({ min: 0, max: 999 })
    .withMessage("L'ordre d'affichage doit être un entier positif."),
];

const validateProject = [
  body("title")
    .notEmpty().withMessage("Le titre est requis.")
    .bail()
    .isString().withMessage("Le titre doit être une chaîne de caractères.")
    .bail()
    .isLength({ min: 2, max: 150 })
    .withMessage("Le titre doit contenir entre 2 et 150 caractères."),

  optionalText("description", "La description"),

  optionalText("tech_stack", "La stack technique", 255),

  optionalHttpUrl("github_url", "L'URL GitHub"),

  optionalHttpUrl("demo_url", "L'URL de démo"),

  optionalUrl("image_url", "L'URL de l'image"),
  optionalText("context", "Le contexte"),
  optionalText("objective", "L'objectif"),
  optionalText("challenges", "Les défis"),
  optionalText("solution", "La solution"),
  optionalStringArray("learned_skills", "Les compétences acquises"),
  optionalStringArray("technical_stack", "La stack technique détaillée"),
  optionalImageArray,
  requireGalleryImagesWhenEnabled,
  ...optionalDisplaySettings,
  ...optionalHomepageSettings,
];

export const validateUpdateProject = [
  body("title")
    .optional()
    .isString().withMessage("Le titre doit être une chaîne de caractères.")
    .bail()
    .isLength({ min: 2, max: 150 })
    .withMessage("Le titre doit contenir entre 2 et 150 caractères."),

  optionalText("description", "La description"),

  optionalText("tech_stack", "La stack technique", 255),

  optionalHttpUrl("github_url", "L'URL GitHub"),

  optionalHttpUrl("demo_url", "L'URL de démo"),

  optionalUrl("image_url", "L'URL de l'image"),
  optionalText("context", "Le contexte"),
  optionalText("objective", "L'objectif"),
  optionalText("challenges", "Les défis"),
  optionalText("solution", "La solution"),
  optionalStringArray("learned_skills", "Les compétences acquises"),
  optionalStringArray("technical_stack", "La stack technique détaillée"),
  optionalImageArray,
  requireGalleryImagesWhenEnabled,
  ...optionalDisplaySettings,
  ...optionalHomepageSettings,
];

export const validateProjectId = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID invalide."),
];

export default validateProject;
