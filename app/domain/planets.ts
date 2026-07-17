import type { PlanetSkin } from "./types";

export interface PlanetDefinition {
  id: PlanetSkin;
  name: string;
  description: string;
  colors: readonly [string, string, string];
  roughness: number;
  emissive: string;
  emissiveIntensity: number;
  bands: number;
  atmosphere: AtmosphereDefinition;
  hasRing?: boolean;
}

export type AtmosphereStyle = "corona" | "haze" | "clouds" | "dust" | "storm" | "ice" | "none" | "custom";

export interface AtmosphereDefinition {
  style: AtmosphereStyle;
  color: string;
  opacity: number;
  speed: number;
  pulse: number;
}

const atmosphere = (style: AtmosphereStyle, color: string, opacity: number, speed: number, pulse: number): AtmosphereDefinition =>
  ({ style, color, opacity, speed, pulse });

export const PLANETS: readonly PlanetDefinition[] = [
  { id: "sun", name: "Güneş", description: "Alevli yıldız", colors: ["#fff3a4", "#ff9d2e", "#d83b0b"], roughness: .62, emissive: "#ff6a16", emissiveIntensity: 1.3, bands: 13, atmosphere: atmosphere("corona", "#ffb13b", .24, .16, .055) },
  { id: "mercury", name: "Merkür", description: "Kraterli kaya", colors: ["#d5cabd", "#8b8178", "#4d4845"], roughness: .94, emissive: "#2a211d", emissiveIntensity: .08, bands: 2, atmosphere: atmosphere("none", "#b6aa9f", .035, .01, .005) },
  { id: "venus", name: "Venüs", description: "Altın bulutlar", colors: ["#ffe0a3", "#cb7d32", "#72451f"], roughness: .82, emissive: "#4d2812", emissiveIntensity: .12, bands: 8, atmosphere: atmosphere("haze", "#f6b55d", .2, -.055, .018) },
  { id: "earth", name: "Dünya", description: "Mavi yaşam", colors: ["#4da9d9", "#176b4a", "#d8e4d5"], roughness: .72, emissive: "#092b55", emissiveIntensity: .14, bands: 3, atmosphere: atmosphere("clouds", "#78c9ff", .16, .08, .012) },
  { id: "mars", name: "Mars", description: "Kızıl yüzey", colors: ["#e07b50", "#9d3f27", "#54261f"], roughness: .9, emissive: "#41150d", emissiveIntensity: .1, bands: 4, atmosphere: atmosphere("dust", "#d9784e", .11, .035, .022) },
  { id: "jupiter", name: "Jüpiter", description: "Fırtına kuşakları", colors: ["#f0d2aa", "#bd7d55", "#725047"], roughness: .84, emissive: "#40221a", emissiveIntensity: .08, bands: 18, atmosphere: atmosphere("storm", "#d99a6c", .13, .11, .016) },
  { id: "saturn", name: "Satürn", description: "Halkalı dev", colors: ["#f0d99f", "#b99a68", "#78674e"], roughness: .8, emissive: "#3e321d", emissiveIntensity: .08, bands: 14, hasRing: true, atmosphere: atmosphere("storm", "#e7cb8b", .1, .07, .012) },
  { id: "uranus", name: "Uranüs", description: "Buz mavisi", colors: ["#d4fbf5", "#75cdd0", "#3d8e9d"], roughness: .7, emissive: "#174c58", emissiveIntensity: .14, bands: 7, atmosphere: atmosphere("ice", "#8de9e5", .17, -.025, .025) },
  { id: "neptune", name: "Neptün", description: "Derin mavi", colors: ["#5c90ff", "#244ec3", "#17266d"], roughness: .68, emissive: "#0c1d68", emissiveIntensity: .18, bands: 10, atmosphere: atmosphere("ice", "#537dff", .2, .06, .032) },
  { id: "moon", name: "Ay", description: "Sessiz uydumuz", colors: ["#dedbd3", "#888681", "#3f3f42"], roughness: .98, emissive: "#24242a", emissiveIntensity: .045, bands: 1, atmosphere: atmosphere("none", "#d8dded", .028, .008, .004) },
] as const;

const CUSTOM_PLANET: PlanetDefinition = {
  id: "custom", name: "Özel", description: "Sana ait yüzey", colors: ["#d7c5ff", "#7259a6", "#24203b"],
  roughness: .72, emissive: "#241b46", emissiveIntensity: .12, bands: 4,
  atmosphere: atmosphere("custom", "#a98dff", .14, .045, .02),
};

/** Kimliğe karşılık gelen güvenli gezegen tanımını döndürür. */
export function getPlanet(id: PlanetSkin): PlanetDefinition {
  if (id === "custom") return CUSTOM_PLANET;
  return PLANETS.find((planet) => planet.id === id) ?? PLANETS[0];
}
