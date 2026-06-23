import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware.js";
import AppError from "../errors/AppError.js";

const authorize = (...roles: string[]) => (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
        throw new AppError("Non authentifié", 401);
    }

    if (!roles.includes(req.user.role)) {
        throw new AppError("Accès interdit.", 403);
    }

    next();
}

export default authorize;