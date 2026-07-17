import { describe, expect, it } from "vitest";
import { resolvePlanetTextureSource } from "../app/domain/planet-textures";

describe("standart gezegen texture kaynakları", () => {
  it("aynı-origin public yolunu kabul eder", () => {
    expect(resolvePlanetTextureSource({ kind: "path", value: "/textures/earth.jpg" })).toBe("/textures/earth.jpg");
  });

  it("ham Base64 değerini belirtilen MIME tipiyle data URL'ye çevirir", () => {
    expect(resolvePlanetTextureSource({ kind: "base64", mimeType: "image/jpeg", value: "YWJjZA==" }))
      .toBe("data:image/jpeg;base64,YWJjZA==");
  });

  it("geçerli raster data URL'lerini doğrudan kabul eder", () => {
    expect(resolvePlanetTextureSource({ kind: "base64", value: "data:image/webp;base64,YWJjZA==" }))
      .toBe("data:image/webp;base64,YWJjZA==");
  });

  it("harici, protokol-relative ve çalıştırılabilir kaynakları reddeder", () => {
    expect(resolvePlanetTextureSource({ kind: "path", value: "https://example.com/earth.jpg" })).toBeUndefined();
    expect(resolvePlanetTextureSource({ kind: "path", value: "//example.com/earth.jpg" })).toBeUndefined();
    expect(resolvePlanetTextureSource({ kind: "base64", value: "javascript:alert(1)" })).toBeUndefined();
  });
});
