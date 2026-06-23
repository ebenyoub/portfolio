import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import jwt from "jsonwebtoken";
import authenticate, { AuthRequest } from "../middlewares/auth.middleware.js";
import AppError from "../errors/AppError.js";
import { Response, NextFunction } from "express";

vi.mock("jsonwebtoken");

describe("Auth Middleware - JWT Verification", () => {
    let mockReq: Partial<AuthRequest>;
    let mockRes: Partial<Response>;
    let nextFunction: NextFunction;
    const originalEnv = process.env;

    beforeEach(() => {
        vi.resetAllMocks();
        process.env = { ...originalEnv, JWT_SECRET: "test_secret" };
        mockReq = {
            headers: {}
        };
        mockRes = {};
        nextFunction = vi.fn();
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it("should throw AppError 401 when Authorization header is absent", () => {
        mockReq.headers = {};

        expect(() => {
            authenticate(mockReq as AuthRequest, mockRes as Response, nextFunction);
        }).toThrow(new AppError("Accès refusé", 401));

        expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should throw AppError 401 when Authorization header does not start with Bearer", () => {
        mockReq.headers = {
            authorization: "Basic credentials123"
        };

        expect(() => {
            authenticate(mockReq as AuthRequest, mockRes as Response, nextFunction);
        }).toThrow(new AppError("Accès refusé", 401));

        expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should throw AppError 401 when token part is empty", () => {
        mockReq.headers = {
            authorization: "Bearer "
        };

        expect(() => {
            authenticate(mockReq as AuthRequest, mockRes as Response, nextFunction);
        }).toThrow(new AppError("Token manquant", 401));

        expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should throw error when JWT_SECRET env variable is missing", () => {
        delete process.env.JWT_SECRET;
        mockReq.headers = {
            authorization: "Bearer valid_token"
        };

        expect(() => {
            authenticate(mockReq as AuthRequest, mockRes as Response, nextFunction);
        }).toThrow("JWT_SECRET manquant");

        expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should throw AppError 401 when jwt.verify throws error (invalid token)", () => {
        mockReq.headers = {
            authorization: "Bearer invalid_token"
        };
        vi.spyOn(jwt, "verify").mockImplementation(() => {
            throw new Error("Invalid token signature");
        });

        expect(() => {
            authenticate(mockReq as AuthRequest, mockRes as Response, nextFunction);
        }).toThrow(new AppError("Token invalide ou expiré", 401));

        expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should authorize access and populate req.user when token is valid", () => {
        const mockDecodedToken = { id: 1, email: "admin@test.com" };
        mockReq.headers = {
            authorization: "Bearer valid_token"
        };
        vi.spyOn(jwt, "verify").mockImplementation(() => mockDecodedToken as unknown as jwt.JwtPayload);

        authenticate(mockReq as AuthRequest, mockRes as Response, nextFunction);

        expect(jwt.verify).toHaveBeenCalledWith("valid_token", "test_secret");
        expect(mockReq.user).toEqual(mockDecodedToken);
        expect(nextFunction).toHaveBeenCalledTimes(1);
    });
});
