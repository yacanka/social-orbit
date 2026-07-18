import { describe, expect, it } from "vitest";
import { freePosition, isFreePositionSafe } from "../app/scene/motion";
import { orbitParticlePositions, orbitTrailPosition } from "../app/scene/orbit-visual";

describe("serbest evren hareketi", () => {
  it("kişileri orbital güvenlik alanı ile evren sınırı arasında tutar", () => {
    for (let seed = 1; seed < 40; seed += 3) {
      for (let time = 0; time < 100; time += 7) {
        expect(isFreePositionSafe(freePosition(seed, time))).toBe(true);
      }
    }
  });

  it("aynı kimlik ve zamanda kararlı konum üretir", () => {
    expect(freePosition(42, 12.5)).toEqual(freePosition(42, 12.5));
  });
});

describe("orbital enerji görselleri", () => {
  it("parçacıkları seçilen yörünge yarıçapına yakın tutar", () => {
    const positions = orbitParticlePositions(8.1, 40);
    for (let index = 0; index < positions.length; index += 3) {
      expect(Math.hypot(positions[index], positions[index + 2])).toBeCloseTo(8.1, 5);
      expect(Math.abs(positions[index + 1])).toBeLessThan(.04);
    }
  });

  it("enerji kuyruğunun tüm parçalarını aynı yörüngede tutar", () => {
    for (let index = 0; index < 7; index += 1) {
      const [x, y, z] = orbitTrailPosition(12.1, 1.8, index);
      expect(Math.hypot(x, z)).toBeCloseTo(12.1, 5);
      expect(y).toBe(0);
    }
  });
});
