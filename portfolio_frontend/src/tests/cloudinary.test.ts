import { afterEach, describe, expect, it, vi } from "vitest";
import { uploadImageToCloudinary } from "../services/cloudinary";

vi.mock("../config/env", () => ({
  env: {
    VITE_CLOUDINARY_CLOUD_NAME: "portfolio-demo",
    VITE_CLOUDINARY_UPLOAD_PRESET: "unsigned-preset",
  },
}));

describe("uploadImageToCloudinary", () => {
  const image = new File(["image"], "cover.png", { type: "image/png" });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uploads an image and returns Cloudinary's secure URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        secure_url: "https://res.cloudinary.com/portfolio-demo/image/upload/cover.png",
        public_id: "portfolio/cover",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(uploadImageToCloudinary(image)).resolves.toEqual({
      secure_url: "https://res.cloudinary.com/portfolio-demo/image/upload/cover.png",
      public_id: "portfolio/cover",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.cloudinary.com/v1_1/portfolio-demo/image/upload",
      expect.objectContaining({ method: "POST" })
    );
    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = options.body as FormData;
    expect(body.get("file")).toBe(image);
    expect(body.get("upload_preset")).toBe("unsigned-preset");
  });

  it("returns Cloudinary's error message when the upload fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: { message: "Preset invalide" } }),
    }));

    await expect(uploadImageToCloudinary(image)).rejects.toThrow("Preset invalide");
  });
});
