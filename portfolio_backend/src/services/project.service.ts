import AppError from "../errors/AppError.js";
import * as projectModel from "../models/project.model.js";
import { CreateProjectType, Project } from "../types/project.type.js";

export const getAllProjects = async () => {
    return projectModel.findAll();
}

export const getProjectById = async (id: number) => {
    const project = await projectModel.findById(id);
    if (!project) {
        throw new AppError("Projet non trouvé.", 404);
    }

    return project;
}

export const createProject = async (data: CreateProjectType) => {
    const project = await projectModel.findByTitle(data.title); 
    if (project) {
        throw new AppError("Titre déjà utilisé.", 409);
    }

    const projectCreated = await projectModel.create(data);
    if (!projectCreated) {
        throw new AppError("La création a échoué.", 500);
    }

    return projectCreated;
}

export const getProjectByTitle = async (title: string) => {
    const project = await projectModel.findByTitle(title);
    if (!project) {
        throw new AppError(`Le projet "${title}" est introuvable.`, 409);
    }

    return project;
}

export const updateProject = async (id: number, data:Partial<CreateProjectType>): Promise<Project> => {
    const project = await projectModel.findById(id);
    if (!project) {
        throw new AppError("Projet introuvable.", 404);
    }
    
    const result = await projectModel.update(id, {...project, ...data});
    if (result.affectedRows === 0) {
        throw new AppError("La modification a échoué.", 500);
    }

    return await projectModel.findById(id);
}

export const deleteProject = async (id: number) => {
    const project = await projectModel.findById(id);
    if (!project) {
        throw new AppError("Projet introuvable.", 404);
    }

    const result = await projectModel.remove(id);
    if (result.affectedRows === 0) {
        throw new AppError("Impossible de supprimer le projet " + id, 500);
    }

    return { id, deleted: true };
}
