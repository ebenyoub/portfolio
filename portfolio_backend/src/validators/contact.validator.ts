// src/validators/contact.validator.ts
import { body } from "express-validator";

const validateContact = [
  body("name")
    .notEmpty().withMessage("Le nom est requis.")
    .bail()
    .isString().withMessage("Le nom doit être une chaîne de caractères.")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Le nom doit contenir entre 2 et 100 caractères."),

  body("email")
    .notEmpty().withMessage("L'email est requis.")
    .bail()
    .isEmail().withMessage("Email invalide."),

  body("subject")
    .notEmpty().withMessage("Le sujet est requis.")
    .bail()
    .isString().withMessage("Le sujet doit être une chaîne de caractères.")
    .bail()
    .isLength({ min: 3, max: 150 })
    .withMessage("Le sujet doit contenir entre 3 et 150 caractères."),

  body("message")
    .notEmpty().withMessage("Le message est requis.")
    .bail()
    .isString().withMessage("Le message doit être une chaîne de caractères.")
    .bail()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Le message doit contenir entre 10 et 2000 caractères."),
];

export default validateContact;
