import type { PlanetSkin } from "./types";

export type StandardPlanetSkin = Exclude<PlanetSkin, "custom">;
export type TextureMimeType = "image/jpeg" | "image/png" | "image/webp";

export type PlanetTextureSource =
  | { kind: "path"; value: string }
  | { kind: "base64"; value: string; mimeType?: TextureMimeType };

/**
 * Standart gök cisimlerinin isteğe bağlı texture kaynakları.
 * Örnekler:
 * earth: { kind: "path", value: "/textures/earth.jpg" }
 * mars: { kind: "base64", mimeType: "image/jpeg", value: "BASE64_DEĞERİ" }
 */
export const PLANET_TEXTURES: Partial<Record<StandardPlanetSkin, PlanetTextureSource>> = {};

const DATA_URL = /^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=\s]+$/i;
const RAW_BASE64 = /^[a-z0-9+/=\s]+$/i;
const MAX_ENCODED_LENGTH = 8_000_000;

function resolvePath(value: string): string | undefined {
  const path = value.trim();
  return path.startsWith("/") && !path.startsWith("//") && !/[\u0000-\u001f\\]/.test(path) ? path : undefined;
}

function resolveBase64(source: Extract<PlanetTextureSource, { kind: "base64" }>): string | undefined {
  const value = source.value.trim();
  if (!value || value.length > MAX_ENCODED_LENGTH) return undefined;
  if (DATA_URL.test(value)) return value.replace(/\s/g, "");
  if (!RAW_BASE64.test(value)) return undefined;
  return `data:${source.mimeType ?? "image/png"};base64,${value.replace(/\s/g, "")}`;
}

/** Güvenli texture yapılandırmasını Three.js tarafından yüklenebilir URL'ye dönüştürür. */
export function resolvePlanetTextureSource(source?: PlanetTextureSource): string | undefined {
  if (!source) return undefined;
  return source.kind === "path" ? resolvePath(source.value) : resolveBase64(source);
}

/** Standart gök cismi için doğrulanmış texture URL'sini döndürür. */
export function getPlanetTextureSource(skin: PlanetSkin): string | undefined {
  if (skin === "custom") return undefined;
  return resolvePlanetTextureSource(PLANET_TEXTURES[skin]);
}
