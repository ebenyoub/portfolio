import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError.js";

// middlewares/errorHandler.js
const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Erreur serveur",
  });
};

export default errorHandler;