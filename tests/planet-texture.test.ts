import { afterEach, describe, expect, it, vi } from "vitest";
import { Texture, TextureLoader } from "three";
import { PLANETS } from "../app/domain/planets";
import { createNucleusTexture } from "../app/scene/planet-texture";

describe("çekirdek texture yükleme", () => {
  afterEach(() => vi.restoreAllMocks());

  it("tanımlı resmi prosedürel texture'a kopyalamadan bağımsız yükler", () => {
    const loadedTexture = new Texture<HTMLImageElement>();
    const load = vi.spyOn(TextureLoader.prototype, "load").mockReturnValue(loadedTexture);

    const texture = createNucleusTexture(PLANETS[3], "/textures/earth.jpg");

    expect(load).toHaveBeenCalledWith("/textures/earth.jpg");
    expect(texture).toBe(loadedTexture);
  });
});
