import { body } from "express-validator";

const validateAuth = [
    body("email")
        .notEmpty().withMessage("L'email est requis.").bail()
        .isEmail().withMessage("Email invalide."),
    body("password").notEmpty().withMessage("Le mot de passe est requis.")
];

export default validateAuth;