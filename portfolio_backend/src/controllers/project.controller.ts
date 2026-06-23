import { Request, Response } from "express";
import * as projectService from "../services/project.service.js";
import { CreateProjectType } from "../types/project.type.js";
import { EmptyParams, IdParams } from "../types/request.js";

export const getAllProjects = async (_req: Request, res: Response) => {
    const projects = await projectService.getAllProjects();
    return res.status(200).json({
        success: true,
        data: projects
    })
}

export const getProjectById = async (req: Request<IdParams>, res: Response) => {
    const { id } = req.params;
    const project = await projectService.getProjectById(Number(id));
    return res.status(200).json({
        success: true,
        data: project
    })
}

export const getProjectByTitle = async (req: Request<EmptyParams, unknown, { title: string }>, res: Response) => {
    const project = await projectService.getProjectByTitle(req.body.title);
    return res.status(200).json({
        success: true,
        data: project
    })
}

export const createProject = async (req: Request<EmptyParams, unknown, CreateProjectType>, res: Response) => {
    const projectCreated = await projectService.createProject(req.body);

    return res.status(201).json({
        success: true,
        data: projectCreated,
        message: "Project créé avec succès."
    })
}

export const updateProject = async (req: Request<IdParams, unknown, Partial<CreateProjectType>>, res: Response) => {
    const { id } = req.params;
    await projectService.updateProject(Number(id), req.body);

    return res.status(200).json({
        success: true,
        message: "Projet modifié avec succès."
    })
}

export const deleteProject = async (req: Request<IdParams>, res: Response) => {
    const { id } = req.params;
    const result = await projectService.deleteProject(Number(id));

    return res.status(200).json({
        success: true,
        data: result,
        message: "Projet supprimé avec succès."
    })
}