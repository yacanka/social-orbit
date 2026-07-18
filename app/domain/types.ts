export type SurveyAnswer = 1 | 2 | 3 | 4 | 5;

export type OrbitalDensity = "calm" | "balanced" | "dense";

export type PlanetSkin =
  | "sun"
  | "mercury"
  | "venus"
  | "earth"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"
  | "moon"
  | "custom";

export interface CustomTexture {
  name: string;
  dataUrl: string;
  updatedAt: string;
}

export type Shell = 1 | 2 | 3 | "free";

export interface Person {
  id: string;
  name: string;
  answers: SurveyAnswer[];
  score: number;
  createdAt: string;
  updatedAt: string;
}

export interface Placement {
  person: Person;
  rank: number;
  shell: Shell;
  shellIndex: number;
  seed: number;
}

export interface AppState {
  schemaVersion: 1;
  ownerName: string;
  nucleusSkin: PlanetSkin;
  customTexture: CustomTexture | null;
  orbitalDensity: OrbitalDensity;
  people: Person[];
}

export const EMPTY_STATE: AppState = {
  schemaVersion: 1,
  ownerName: "",
  nucleusSkin: "sun",
  customTexture: null,
  orbitalDensity: "balanced",
  people: [],
};
