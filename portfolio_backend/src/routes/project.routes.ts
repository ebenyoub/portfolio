import { Router } from "express";
import * as projectControllers from "../controllers/project.controller.js";
import validateProject, { validateProjectId, validateUpdateProject } from "../validators/project.validator.js";
import authorize from "../middlewares/authorize.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import authenticate from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", projectControllers.getAllProjects);
router.get("/:id", validateProjectId, validate, projectControllers.getProjectById);
router.post("/", authenticate, authorize('admin'), validateProject, validate, projectControllers.createProject);
router.put("/:id", authenticate, authorize('admin'), validateProjectId, validateUpdateProject, validate, projectControllers.updateProject);
router.delete("/:id", authenticate, authorize('admin'), validateProjectId, validate, projectControllers.deleteProject);

export default router;