import { describe, expect, it } from "vitest";
import { derivePlacements } from "../app/domain/placement";
import { PLANETS, getPlanet } from "../app/domain/planets";
import { calculateScore, normalizeName } from "../app/domain/scoring";
import type { Person, SurveyAnswer } from "../app/domain/types";

function person(index: number, score: number): Person {
  const answers = Array(10).fill(3) as SurveyAnswer[];
  const timestamp = new Date(2025, 0, index + 1).toISOString();
  return { id: `person-${index}`, name: `Kişi ${index}`, answers, score, createdAt: timestamp, updatedAt: timestamp };
}

describe("yakınlık puanı", () => {
  it("10–50 aralığını doğru hesaplar", () => {
    expect(calculateScore(Array(10).fill(1))).toBe(10);
    expect(calculateScore(Array(10).fill(5))).toBe(50);
  });

  it("eksik anketi reddeder ve adı normalleştirir", () => {
    expect(() => calculateScore([5, 5])).toThrow();
    expect(normalizeName("  Ada   Yılmaz  ")).toBe("Ada Yılmaz");
  });
});

describe("orbital yerleşimi", () => {
  it("2, 8 ve 18 kişilik kabuk sınırlarını uygular", () => {
    const placements = derivePlacements(Array.from({ length: 29 }, (_, index) => person(index, 50 - index)));
    expect(placements.filter(({ shell }) => shell === 1)).toHaveLength(2);
    expect(placements.filter(({ shell }) => shell === 2)).toHaveLength(8);
    expect(placements.filter(({ shell }) => shell === 3)).toHaveLength(18);
    expect(placements.filter(({ shell }) => shell === "free")).toHaveLength(1);
  });

  it("yüksek puanlı yeniyi merkeze alır ve eşitlikte eskiyi korur", () => {
    const older = person(0, 40);
    const newer = person(1, 40);
    const closest = person(2, 50);
    const placements = derivePlacements([newer, closest, older]);
    expect(placements.map(({ person: item }) => item.id)).toEqual([closest.id, older.id, newer.id]);
  });

  it("silme sonrası en yüksek serbest kişiyi otomatik terfi ettirir", () => {
    const people = Array.from({ length: 29 }, (_, index) => person(index, 50 - index));
    const promotedId = derivePlacements(people).find(({ shell }) => shell === "free")?.person.id;
    const afterDelete = derivePlacements(people.slice(1));
    expect(afterDelete.find(({ person: item }) => item.id === promotedId)?.shell).toBe(3);
  });
});

describe("çekirdek gök cisimleri", () => {
  it("Ay'ı ve farklı atmosfer profillerini sunar", () => {
    expect(getPlanet("moon").name).toBe("Ay");
    expect(new Set(PLANETS.map(({ atmosphere }) => atmosphere.style)).size).toBeGreaterThan(4);
  });
});
