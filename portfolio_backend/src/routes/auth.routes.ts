import { Router } from "express";
import validateAuth from "../validators/auth.validator.js";
import validate from "../middlewares/validate.middleware.js";
import * as authControllers from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", validateAuth, validate, authControllers.login);

export default router;