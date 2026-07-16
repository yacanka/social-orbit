import "fake-indexeddb/auto";
import { openDB } from "idb";
import { beforeEach, describe, expect, it } from "vitest";
import { EMPTY_STATE, type AppState, type SurveyAnswer } from "../app/domain/types";
import { clearState, loadState, saveState } from "../app/storage/orbit-storage";

const validState: AppState = {
  schemaVersion: 1,
  ownerName: "Ada",
  people: [{
    id: "person-1",
    name: "Deniz",
    answers: Array(10).fill(5) as SurveyAnswer[],
    score: 50,
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  }],
};

describe("IndexedDB depolaması", () => {
  beforeEach(clearState);

  it("durumu yeniden yüklemede korur ve tamamen temizler", async () => {
    await saveState(validState);
    expect(await loadState()).toEqual(validState);
    await clearState();
    expect(await loadState()).toEqual(EMPTY_STATE);
  });

  it("bozuk veya bilinmeyen şemayı güvenle reddeder", async () => {
    const database = await openDB("social-orbit", 1);
    await database.put("state", { schemaVersion: 99, ownerName: "X", people: [] }, "current");
    expect(await loadState()).toEqual(EMPTY_STATE);
  });
});
