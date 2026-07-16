import { openDB, type IDBPDatabase } from "idb";
import { z } from "zod";
import { EMPTY_STATE, type AppState } from "../domain/types";

const DATABASE_NAME = "social-orbit";
const STORE_NAME = "state";
const STATE_KEY = "current";

const personSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(60),
  answers: z.array(z.number().int().min(1).max(5)).length(10),
  score: z.number().int().min(10).max(50),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const stateSchema = z.object({
  schemaVersion: z.literal(1),
  ownerName: z.string().max(60),
  people: z.array(personSchema),
});

function database(): Promise<IDBPDatabase> {
  return openDB(DATABASE_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
    },
  });
}

/** IndexedDB'den doğrulanmış uygulama durumunu yükler. */
export async function loadState(): Promise<AppState> {
  const stored = await (await database()).get(STORE_NAME, STATE_KEY);
  const parsed = stateSchema.safeParse(stored);
  return parsed.success ? (parsed.data as AppState) : EMPTY_STATE;
}

/** Uygulama durumunu yalnızca bu cihazdaki IndexedDB'ye kaydeder. */
export async function saveState(state: AppState): Promise<void> {
  const parsed = stateSchema.parse(state);
  await (await database()).put(STORE_NAME, parsed, STATE_KEY);
}

/** Social Orbit veritabanını bu cihazdan tamamen kaldırır. */
export async function clearState(): Promise<void> {
  await (await database()).clear(STORE_NAME);
}
