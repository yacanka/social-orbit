import { describe, expect, it } from "vitest";
import { advanceMotionTime, freePosition, isFreePositionSafe } from "../app/scene/motion";
import { isScreenPointHovered, isVisibleDepth } from "../app/scene/hover-proximity";
import { getOrbitDensityProfile, orbitParticlePositions, orbitTrailPosition } from "../app/scene/orbit-visual";

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

  it("yalnızca genel duraklatmada zamanı dondurur", () => {
    expect(advanceMotionTime(4, .2, true)).toBe(4);
    expect(advanceMotionTime(4, .2, false)).toBeCloseTo(4.2);
  });
});

describe("ekran yakınlığı hover alanı", () => {
  const viewport = { x: 1000, y: 800 };

  it("girişten daha geniş çıkış alanı kullanarak titreşimi önler", () => {
    const pointer = { x: 0, y: 0 };
    expect(isScreenPointHovered({ x: .07, y: 0 }, pointer, viewport, false)).toBe(false);
    expect(isScreenPointHovered({ x: .07, y: 0 }, pointer, viewport, true)).toBe(true);
  });

  it("yalnızca kamera kırpma alanındaki düğümleri kabul eder", () => {
    expect(isVisibleDepth(0)).toBe(true);
    expect(isVisibleDepth(1.1)).toBe(false);
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

  it("yoğunluğu artırırken orbital ana çizgiyi geri planda tutar", () => {
    const calm = getOrbitDensityProfile("calm");
    const dense = getOrbitDensityProfile("dense");
    expect(dense.particleMultiplier).toBeGreaterThan(calm.particleMultiplier);
    expect(dense.trailCount).toBeGreaterThan(calm.trailCount);
    expect(dense.lineOpacity).toBeLessThanOrEqual(.2);
  });
});
