import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../errors/AppError.js";

export type AuthRequest = Request & {
    user?: JwtPayload;
};

const authenticate = (req: AuthRequest, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError("Accès refusé", 401);
    }

    if (!process.env.JWT_SECRET) {
        // Erreur pour le serveur => AppError pour le client
        throw new Error("JWT_SECRET manquant");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        throw new AppError("Token manquant", 401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        req.user = decoded;
        next();
    } catch {
        throw new AppError("Token invalide ou expiré", 401);
    }
}

export default authenticate;