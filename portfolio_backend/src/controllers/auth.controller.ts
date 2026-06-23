import { Request, Response } from "express";
import * as authServices from "../services/auth.service.js"
import { LoginBody } from "../types/auth.type.js";
import { EmptyParams } from "../types/request.js";

export const login = async (req: Request<EmptyParams, unknown, LoginBody>, res: Response) => {
    const token = await authServices.loginUser(req.body);
    res.status(200).json({
        success: true,
        token
    })
}