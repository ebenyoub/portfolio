import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Server } from "node:http";
import cors from "cors";
import express from "express";
import request from "supertest";
import { createCorsOptions, parseCorsOrigins } from "../config/cors.js";

const app = express();
app.use(cors(createCorsOptions("http://localhost:5173,http://localhost:8080")));
app.get("/health", (_req, res) => res.status(200).json({ success: true }));

describe("CORS configuration", () => {
  let server: Server;

  beforeAll(async () => {
    server = await new Promise<Server>((resolve, reject) => {
      const testServer = app.listen(0, "127.0.0.1", () => resolve(testServer));
      testServer.once("error", reject);
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  });

  it("parses comma-separated origins and trims whitespace", () => {
    expect(parseCorsOrigins(" http://localhost:5173, https://elyas-benyoub.fr ")).toEqual([
      "http://localhost:5173",
      "https://elyas-benyoub.fr",
    ]);
  });

  it("allows an origin configured in CORS_ORIGIN", async () => {
    const response = await request(server)
      .options("/health")
      .set("Origin", "http://localhost:5173")
      .set("Access-Control-Request-Method", "GET");

    expect(response.status).toBe(204);
    expect(response.headers["access-control-allow-origin"]).toBe("http://localhost:5173");
  });

  it("does not authorize an origin absent from CORS_ORIGIN", async () => {
    const response = await request(server)
      .options("/health")
      .set("Origin", "https://untrusted.example")
      .set("Access-Control-Request-Method", "GET");

    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });
});
