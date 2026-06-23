import { ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../config/db.js";
import { CreateProjectType, Project, ProjectDisplaySettings } from "../types/project.type.js"

export const defaultDisplaySettings: ProjectDisplaySettings = {
    show_cover: true,
    show_gallery: false,
    show_presentation: true,
    show_context: true,
    show_objective: true,
    show_challenges: true,
    show_solution: true,
    show_learned_skills: true,
};

const toJsonValue = (value: CreateProjectType["gallery_images"] | CreateProjectType["technical_stack"] | CreateProjectType["learned_skills"]) => {
    if (!value) return null;
    if (typeof value === "string") return value;

    return JSON.stringify(value);
};

const toDisplaySettingsValue = (value: CreateProjectType["display_settings"]) => {
    if (!value) return JSON.stringify(defaultDisplaySettings);

    if (typeof value === "string") {
        try {
            return JSON.stringify({
                ...defaultDisplaySettings,
                ...JSON.parse(value),
            });
        } catch {
            return JSON.stringify(defaultDisplaySettings);
        }
    }

    return JSON.stringify({
        ...defaultDisplaySettings,
        ...value,
    });
};

const toFeaturedValue = (value: CreateProjectType["is_featured"]) => (
    value === true || value === 1 ? 1 : 0
);

const toFeaturedOrderValue = (value: CreateProjectType["featured_order"]) => {
    if (typeof value !== "number" || !Number.isFinite(value)) return 0;

    return Math.max(0, Math.trunc(value));
};

const projectValues = (data: CreateProjectType) => [
    data.title,
    data.description ?? null,
    data.tech_stack ?? null,
    data.github_url ?? null,
    data.demo_url ?? null,
    data.image_url ?? null,
    data.context ?? null,
    data.objective ?? null,
    toJsonValue(data.learned_skills),
    toJsonValue(data.technical_stack),
    toJsonValue(data.gallery_images),
    toDisplaySettingsValue(data.display_settings),
    toFeaturedValue(data.is_featured),
    toFeaturedOrderValue(data.featured_order),
    data.challenges ?? null,
    data.solution ?? null,
];

export const findAll = async () => {
    const sql = "select * from projects";
    const [rows] = await db.query<(Project & RowDataPacket)[]>(sql);
    return rows;
}

export const findById = async (id: number) => {
    const sql = "select * from projects where id = ?";
    const [rows] = await db.query<(Project & RowDataPacket)[]>(sql, [id]);
    return rows[0] ?? null;
}

export const findByTitle = async (title: string) => {
    const sql = "select * from projects where title = ?";
    const [rows] = await db.query<(Project & RowDataPacket)[]>(sql, [title]);
    return rows[0] ?? null;
}

export const create = async (data: CreateProjectType): Promise<Project | null> => {
    const sql = `
        INSERT INTO projects (
            title,
            description,
            tech_stack,
            github_url,
            demo_url,
            image_url,
            context,
            objective,
            learned_skills,
            technical_stack,
            gallery_images,
            display_settings,
            is_featured,
            featured_order,
            challenges,
            solution
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query<ResultSetHeader>(sql, projectValues(data));
    return findById(result.insertId);
}    

export const update = async (id: number, data: CreateProjectType) => {
    const sql = `
        UPDATE projects
        SET
            title=?,
            description=?,
            tech_stack=?,
            github_url=?,
            demo_url=?,
            image_url=?,
            context=?,
            objective=?,
            learned_skills=?,
            technical_stack=?,
            gallery_images=?,
            display_settings=?,
            is_featured=?,
            featured_order=?,
            challenges=?,
            solution=?
        WHERE id=?
    `;
    const [result] = await db.query<ResultSetHeader>(sql, [
        ...projectValues(data),
        id
   ]);

   return result;
}

export const remove = async (id: number) => {
    const sql = "DELETE FROM projects WHERE id = ?";
    const [result] = await db.query<ResultSetHeader>(sql, [id]);
    return result;
}
