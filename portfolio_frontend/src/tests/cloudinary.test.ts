import { afterEach, describe, expect, it, vi } from "vitest";
import { uploadImageToCloudinary } from "../services/cloudinary";
import * as envConfig from "../config/env";

vi.mock("../config/env", () => ({
  env: {
    VITE_CLOUDINARY_CLOUD_NAME: "portfolio-demo",
    VITE_CLOUDINARY_UPLOAD_PRESET: "unsigned-preset",
  },
}));

// The service uses XMLHttpRequest (needed for onProgress tracking in production).
// We stub the XHR constructor so tests are fully isolated from the network.
//
// When a constructor returns a plain object, `new Constructor()` returns that
// object instead of `this`. This lets us hold a reference to the exact instance
// the service receives, including the onload / onerror callbacks it attaches.
const stubXHR = (status: number, responseText: string) => {
  const xhrMock = {
    open: vi.fn(),
    send: vi.fn(),
    upload: {} as Record<string, unknown>,
    status,
    responseText,
    onload: null as (() => void) | null,
    onerror: null as (() => void) | null,
  };

  vi.stubGlobal("XMLHttpRequest", function MockXHR() { return xhrMock; });

  return xhrMock;
};

describe("uploadImageToCloudinary — validation", () => {
  it("throws when the file type is not an accepted image format", async () => {
    const pdf = new File(["data"], "doc.pdf", { type: "application/pdf" });
    await expect(uploadImageToCloudinary(pdf)).rejects.toThrow(
      "Format invalide"
    );
  });

  it("throws when the file exceeds the 5 Mo size limit", async () => {
    const big = new File([new ArrayBuffer(6 * 1024 * 1024)], "big.png", {
      type: "image/png",
    });
    await expect(uploadImageToCloudinary(big)).rejects.toThrow(
      "Image trop lourde"
    );
  });
});

describe("uploadImageToCloudinary — missing config", () => {
  it("throws when Cloudinary env variables are not set", async () => {
    // The mock factory returns a plain mutable object shared with cloudinary.ts.
    // Temporarily clearing the values is enough to trigger the guard.
    const backup = { ...envConfig.env };
    Object.assign(envConfig.env, {
      VITE_CLOUDINARY_CLOUD_NAME: "",
      VITE_CLOUDINARY_UPLOAD_PRESET: "",
    });

    const file = new File(["x"], "x.png", { type: "image/png" });
    await expect(uploadImageToCloudinary(file)).rejects.toThrow(
      "Configuration Cloudinary manquante"
    );

    Object.assign(envConfig.env, backup);
  });
});

describe("uploadImageToCloudinary", () => {
  const image = new File(["image"], "cover.png", { type: "image/png" });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uploads an image and returns Cloudinary's secure URL", async () => {
    const responseData = {
      secure_url: "https://res.cloudinary.com/portfolio-demo/image/upload/cover.png",
      public_id: "portfolio/cover",
    };

    const xhrMock = stubXHR(200, JSON.stringify(responseData));

    const uploadPromise = uploadImageToCloudinary(image);

    // The service attaches xhr.onload synchronously inside the Promise constructor,
    // so by the time uploadImageToCloudinary returns, onload is already set.
    xhrMock.onload!();

    await expect(uploadPromise).resolves.toEqual(responseData);

    expect(xhrMock.open).toHaveBeenCalledWith(
      "POST",
      "https://api.cloudinary.com/v1_1/portfolio-demo/image/upload",
      true
    );

    const formData = xhrMock.send.mock.calls[0][0] as FormData;
    expect(formData.get("file")).toBe(image);
    expect(formData.get("upload_preset")).toBe("unsigned-preset");
  });

  it("returns Cloudinary's error message when the upload fails", async () => {
    const xhrMock = stubXHR(
      400,
      JSON.stringify({ error: { message: "Preset invalide" } })
    );

    const uploadPromise = uploadImageToCloudinary(image);
    xhrMock.onload!();

    await expect(uploadPromise).rejects.toThrow("Preset invalide");
  });

  it("throws a network error when xhr.onerror fires", async () => {
    const xhrMock = stubXHR(0, "");

    const uploadPromise = uploadImageToCloudinary(image);
    xhrMock.onerror!();

    await expect(uploadPromise).rejects.toThrow("Erreur réseau");
  });
});
