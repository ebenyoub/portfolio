import { renderHook, act, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useFetch from "../hooks/apiFetch";

// vi.hoisted ensures the reference is available inside the vi.mock factory,
// which is hoisted to the top of the module before any import is resolved.
const mockEnv = vi.hoisted(() => ({ VITE_API_URL: "http://localhost:3000" }));

vi.mock("../config/env", () => ({ env: mockEnv }));

// ─── helpers ─────────────────────────────────────────────────────────────────

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const getLastCallHeaders = () => {
  const calls = vi.mocked(fetch).mock.calls;
  const [, options] = calls[calls.length - 1] as [string, RequestInit];
  return options.headers as Record<string, string>;
};

// ─── suite ───────────────────────────────────────────────────────────────────

describe("useFetch / apiFetch", () => {
  beforeEach(() => {
    // Default: no token in storage. Overridden per-test when needed.
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    mockEnv.VITE_API_URL = "http://localhost:3000";
  });

  // ── happy path ─────────────────────────────────────────────────────────────

  it("returns the parsed JSON body on a successful response", async () => {
    const data = { id: 1, title: "React Calculator" };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(data)));

    const { result } = renderHook(() => useFetch());
    let response: unknown;

    await act(async () => {
      response = await result.current.apiFetch("/projects");
    });

    expect(response).toEqual(data);
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      "http://localhost:3000/projects",
      expect.objectContaining({ headers: expect.any(Object) })
    );
  });

  // ── isLoading state ────────────────────────────────────────────────────────

  it("starts as not loading and returns to false after a successful fetch", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ ok: true })));

    const { result } = renderHook(() => useFetch());
    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      await result.current.apiFetch("/test");
    });

    expect(result.current.isLoading).toBe(false);
  });

  it("sets isLoading to true while the request is in flight", async () => {
    let resolveRequest!: (r: Response) => void;
    const pendingFetch = new Promise<Response>((resolve) => {
      resolveRequest = resolve;
    });
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(pendingFetch));

    const { result } = renderHook(() => useFetch());

    // Fire without awaiting so the request stays pending
    void result.current.apiFetch("/test");

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    // Resolve cleanly to avoid act() warnings from pending state updates
    await act(async () => {
      resolveRequest(jsonResponse({ ok: true }));
      await pendingFetch;
    });
  });

  it("resets isLoading to false even when the request fails (finally block)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Not found" }), { status: 404 })
      )
    );

    const { result } = renderHook(() => useFetch());

    await act(async () => {
      await result.current.apiFetch("/missing").catch(() => undefined);
    });

    expect(result.current.isLoading).toBe(false);
  });

  // ── Authorization header ───────────────────────────────────────────────────

  it("sends an Authorization header when a token is stored in localStorage", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue("my-jwt-token");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ ok: true })));

    const { result } = renderHook(() => useFetch());
    await act(async () => {
      await result.current.apiFetch("/admin");
    });

    expect(getLastCallHeaders().Authorization).toBe("Bearer my-jwt-token");
  });

  it("does not send an Authorization header when no token is stored", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ ok: true })));

    const { result } = renderHook(() => useFetch());
    await act(async () => {
      await result.current.apiFetch("/public");
    });

    expect(getLastCallHeaders().Authorization).toBeUndefined();
  });

  // ── Content-Type header ────────────────────────────────────────────────────

  it("sends Content-Type: application/json for a plain JSON body", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ ok: true })));

    const { result } = renderHook(() => useFetch());
    await act(async () => {
      await result.current.apiFetch("/projects", {
        method: "POST",
        body: JSON.stringify({ title: "New" }),
      });
    });

    expect(getLastCallHeaders()["Content-Type"]).toBe("application/json");
  });

  it("does not set Content-Type when the body is FormData (lets the browser set the multipart boundary)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ ok: true })));

    const formData = new FormData();
    formData.append("file", new Blob(["data"]));

    const { result } = renderHook(() => useFetch());
    await act(async () => {
      await result.current.apiFetch("/upload", { method: "POST", body: formData });
    });

    expect(getLastCallHeaders()["Content-Type"]).toBeUndefined();
  });

  // ── error responses ────────────────────────────────────────────────────────

  it("throws the server error message when the response is not OK", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 })
      )
    );

    const { result } = renderHook(() => useFetch());

    await expect(result.current.apiFetch("/admin")).rejects.toThrow("Unauthorized");
  });

  it('falls back to "Erreur serveur" when the error response has no message field', async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({}), { status: 500 }))
    );

    const { result } = renderHook(() => useFetch());

    await expect(result.current.apiFetch("/api")).rejects.toThrow("Erreur serveur");
  });

  // ── 204 No Content ─────────────────────────────────────────────────────────

  it("returns null for a 204 No Content response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 204 })));

    const { result } = renderHook(() => useFetch());
    let response: unknown = "NOT_NULL";

    await act(async () => {
      response = await result.current.apiFetch("/projects/1");
    });

    expect(response).toBeNull();
  });

  // ── missing env URL ────────────────────────────────────────────────────────

  it('throws "VITE_API_URL manquante" when the base URL is not configured', async () => {
    mockEnv.VITE_API_URL = "";

    const { result } = renderHook(() => useFetch());

    await expect(result.current.apiFetch("/test")).rejects.toThrow(
      "VITE_API_URL manquante"
    );
  });
});
