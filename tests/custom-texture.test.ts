import { describe, expect, it } from "vitest";
import { validateTextureFile } from "../app/components/custom-texture";

function file(type: string, size: number): File {
  return { type, size } as File;
}

describe("özel texture güvenliği", () => {
  it("desteklenen küçük raster dosyalarını kabul eder", () => {
    expect(validateTextureFile(file("image/png", 1024))).toBeNull();
    expect(validateTextureFile(file("image/webp", 1024))).toBeNull();
  });

  it("SVG, boş ve 4 MB üzerindeki dosyaları reddeder", () => {
    expect(validateTextureFile(file("image/svg+xml", 1024))).toMatch(/PNG/);
    expect(validateTextureFile(file("image/png", 0))).toMatch(/Boş/);
    expect(validateTextureFile(file("image/jpeg", 4 * 1024 * 1024 + 1))).toMatch(/4 MB/);
  });
});
