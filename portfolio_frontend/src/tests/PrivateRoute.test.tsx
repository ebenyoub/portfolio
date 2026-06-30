import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import useAuth from "../hooks/useAuth";
import type { JwtPayload } from "../context/AuthProvider";

const makeToken = (payload: object) =>
  `eyJhbGciOiJIUzI1NiJ9.${btoa(JSON.stringify(payload))}.signature`;

vi.mock("../hooks/useAuth", () => ({
  default: vi.fn(),
}));

const mockUseAuth = vi.mocked(useAuth);

describe("PrivateRoute Component", () => {
  it("redirects unauthenticated user to login", () => {
    mockUseAuth.mockReturnValue({
      token: null,
      user: null,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <div data-testid="protected-content">Protected Content</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    expect(screen.getByTestId("login-page")).toBeInTheDocument();
  });

  it("renders children when user is authenticated", () => {
    const validToken = makeToken({ id: 1, email: "admin@test.com", role: "admin", exp: Math.floor(Date.now() / 1000) + 3600 });
    mockUseAuth.mockReturnValue({
      token: validToken,
      user: { id: 1, email: "admin@test.com", role: "admin" } as JwtPayload,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <div data-testid="protected-content">Protected Content</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
  });
});
