import { describe, expect, it } from "vitest";
import { freePosition, isFreePositionSafe } from "../app/scene/motion";

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
