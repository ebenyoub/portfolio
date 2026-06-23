import { Router } from "express";
import validateContact from "../validators/contact.validator.js";
import validate from "../middlewares/validate.middleware.js";
import { sendContact } from "../controllers/contact.controller.js";

const router = Router();

router.post("/", validateContact, validate, sendContact);

export default router;