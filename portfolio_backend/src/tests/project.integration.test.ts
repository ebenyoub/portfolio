import { describe, it, expect, vi, beforeAll, beforeEach, afterAll, afterEach } from "vitest";
import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import { Server } from "node:http";
import { RowDataPacket, ResultSetHeader, FieldPacket } from "mysql2";
import db from "../config/db.js";
import projectRoutes from "../routes/project.routes.js";
import errorHandler from "../middlewares/errorHandler.js";

// Mock database pool and JWT library
vi.mock("../config/db.js", () => ({
  default: {
    query: vi.fn(),
  },
}));
vi.mock("jsonwebtoken");

const app = express();
app.use(express.json());
app.use("/api/projects", projectRoutes);
app.use(errorHandler);

const mockProject = {
  id: 1,
  title: "Test Project",
  description: "Description of test project which is long enough",
  tech_stack: "React, Node",
  github_url: "https://github.com/test",
  demo_url: "https://demo.com",
  image_url: "https://cloudinary.com/test.png",
  context: "Project context",
  objective: "Objective description",
  learned_skills: JSON.stringify(["React", "Node"]),
  technical_stack: JSON.stringify(["React"]),
  gallery_images: JSON.stringify(["https://cloudinary.com/gallery.png"]),
  display_settings: JSON.stringify({ show_cover: true }),
  is_featured: 1,
  featured_order: 1,
  challenges: "Some challenges",
  solution: "Some solutions",
};

describe("Projects REST API Integration Tests", () => {
  const originalEnv = process.env;
  let server: Server;

  beforeAll(async () => {
    server = await new Promise<Server>((resolve, reject) => {
      const testServer = app.listen(0, "127.0.0.1", () => resolve(testServer));
      testServer.once("error", reject);
    });
  });

  beforeEach(() => {
    vi.resetAllMocks();
    process.env = { ...originalEnv, JWT_SECRET: "test_secret" };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  });

  describe("GET /api/projects", () => {
    it("should return list of all projects with 200 OK", async () => {
      vi.mocked(db.query).mockResolvedValue([[mockProject], []] as unknown as [RowDataPacket[], FieldPacket[]]);

      const res = await request(server).get("/api/projects");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([mockProject]);
      expect(db.query).toHaveBeenCalledWith("select * from projects");
    });
  });

  describe("GET /api/projects/:id", () => {
    it("should return the project when ID exists", async () => {
      vi.mocked(db.query).mockResolvedValue([[mockProject], []] as unknown as [RowDataPacket[], FieldPacket[]]);

      const res = await request(server).get("/api/projects/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockProject);
    });

    it("should return 404 project not found when ID does not exist", async () => {
      vi.mocked(db.query).mockResolvedValue([[], []] as unknown as [RowDataPacket[], FieldPacket[]]);

      const res = await request(server).get("/api/projects/999");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Projet non trouvé.");
    });

    it("should return 400 when ID is not an integer", async () => {
      const res = await request(server).get("/api/projects/abc");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/projects", () => {
    const payload = {
      title: "New Project Title",
      description: "Description of the new project which must be at least ten characters",
      tech_stack: "Vue, NestJS",
    };

    it("should return 401 Unauthorized when authorization header is missing", async () => {
      const res = await request(server).post("/api/projects").send(payload);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should return 403 Forbidden when user is not an admin", async () => {
      vi.mocked(jwt.verify).mockImplementation(() => ({
        id: 2,
        email: "user@test.com",
        role: "user",
      }) as unknown as jwt.JwtPayload);

      const res = await request(server)
        .post("/api/projects")
        .set("Authorization", "Bearer user_token")
        .send(payload);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Accès interdit.");
    });

    it("should create project and return 201 Created when data and auth are valid", async () => {
      vi.mocked(jwt.verify).mockImplementation(() => ({
        id: 1,
        email: "admin@test.com",
        role: "admin",
      }) as unknown as jwt.JwtPayload);

      // findByTitle: return null (doesn't exist yet)
      // create: mock insert result (ResultSetHeader)
      // findById: return newly created project
      vi.mocked(db.query)
        .mockResolvedValueOnce([[], []] as unknown as [RowDataPacket[], FieldPacket[]]) // findByTitle
        .mockResolvedValueOnce([{ insertId: 10 } as unknown as ResultSetHeader, []] as unknown as [ResultSetHeader, FieldPacket[]]) // create
        .mockResolvedValueOnce([[{ id: 10, ...payload }], []] as unknown as [RowDataPacket[], FieldPacket[]]); // findById

      const res = await request(server)
        .post("/api/projects")
        .set("Authorization", "Bearer admin_token")
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(10);
      expect(res.body.message).toBe("Project créé avec succès.");
    });

    it("should return 400 Bad Request when validation fails", async () => {
      vi.mocked(jwt.verify).mockImplementation(() => ({
        id: 1,
        email: "admin@test.com",
        role: "admin",
      }) as unknown as jwt.JwtPayload);

      const invalidPayload = {
        title: "a", // too short
        description: "short", // too short
      };

      const res = await request(server)
        .post("/api/projects")
        .set("Authorization", "Bearer admin_token")
        .send(invalidPayload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("PUT /api/projects/:id", () => {
    const updatePayload = {
      title: "Updated Title",
      description: "Updated description that is at least ten characters long",
    };

    it("should update project and return 200 OK when authorized", async () => {
      vi.mocked(jwt.verify).mockImplementation(() => ({
        id: 1,
        email: "admin@test.com",
        role: "admin",
      }) as unknown as jwt.JwtPayload);

      // findById (for check): returns existing mockProject
      // update (ResultSetHeader): returns affectedRows: 1
      // findById (returning updated): returns updated mockProject
      vi.mocked(db.query)
        .mockResolvedValueOnce([[mockProject], []] as unknown as [RowDataPacket[], FieldPacket[]])
        .mockResolvedValueOnce([{ affectedRows: 1 } as unknown as ResultSetHeader, []] as unknown as [ResultSetHeader, FieldPacket[]])
        .mockResolvedValueOnce([[{ ...mockProject, ...updatePayload }], []] as unknown as [RowDataPacket[], FieldPacket[]]);

      const res = await request(server)
        .put("/api/projects/1")
        .set("Authorization", "Bearer admin_token")
        .send(updatePayload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Projet modifié avec succès.");
    });

    it("should return 401 Unauthorized when authorization header is missing", async () => {
      const res = await request(server).put("/api/projects/1").send(updatePayload);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 Bad Request when validation fails", async () => {
      vi.mocked(jwt.verify).mockImplementation(() => ({
        id: 1,
        email: "admin@test.com",
        role: "admin",
      }) as unknown as jwt.JwtPayload);

      const res = await request(server)
        .put("/api/projects/1")
        .set("Authorization", "Bearer admin_token")
        .send({ title: "a" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 404 when project to update does not exist", async () => {
      vi.mocked(jwt.verify).mockImplementation(() => ({
        id: 1,
        email: "admin@test.com",
        role: "admin",
      }) as unknown as jwt.JwtPayload);

      vi.mocked(db.query).mockResolvedValueOnce([[], []] as unknown as [RowDataPacket[], FieldPacket[]]);

      const res = await request(server)
        .put("/api/projects/999")
        .set("Authorization", "Bearer admin_token")
        .send(updatePayload);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Projet introuvable.");
    });
  });

  describe("DELETE /api/projects/:id", () => {
    it("should delete project and return 200 OK when authorized", async () => {
      vi.mocked(jwt.verify).mockImplementation(() => ({
        id: 1,
        email: "admin@test.com",
        role: "admin",
      }) as unknown as jwt.JwtPayload);

      // findById (for check): returns existing mockProject
      // remove (ResultSetHeader): returns affectedRows: 1
      vi.mocked(db.query)
        .mockResolvedValueOnce([[mockProject], []] as unknown as [RowDataPacket[], FieldPacket[]])
        .mockResolvedValueOnce([{ affectedRows: 1 } as unknown as ResultSetHeader, []] as unknown as [ResultSetHeader, FieldPacket[]]);

      const res = await request(server)
        .delete("/api/projects/1")
        .set("Authorization", "Bearer admin_token");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Projet supprimé avec succès.");
    });

    it("should return 401 Unauthorized when authorization header is missing", async () => {
      const res = await request(server).delete("/api/projects/1");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should return 404 when project to delete does not exist", async () => {
      vi.mocked(jwt.verify).mockImplementation(() => ({
        id: 1,
        email: "admin@test.com",
        role: "admin",
      }) as unknown as jwt.JwtPayload);

      vi.mocked(db.query).mockResolvedValueOnce([[], []] as unknown as [RowDataPacket[], FieldPacket[]]);

      const res = await request(server)
        .delete("/api/projects/999")
        .set("Authorization", "Bearer admin_token");

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Projet introuvable.");
    });
  });
});
