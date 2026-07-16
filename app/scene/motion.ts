const FREE_MIN_RADIUS = 15.5;
export const UNIVERSE_RADIUS = 24;

function unitVector(seed: number, time: number): [number, number, number] {
  const phase = (seed % 997) / 997 * Math.PI * 2;
  const x = Math.sin(time * 0.19 + phase) + Math.cos(time * 0.11 + phase * 2) * 0.35;
  const y = Math.cos(time * 0.17 + phase * 1.4) + Math.sin(time * 0.13 + phase) * 0.3;
  const z = Math.sin(time * 0.23 + phase * 0.7) + Math.cos(time * 0.09 + phase) * 0.4;
  const length = Math.hypot(x, y, z) || 1;
  return [x / length, y / length, z / length];
}

/** Serbest kişinin dış orbital ile evren sınırı arasında kalan konumunu hesaplar. */
export function freePosition(seed: number, time: number): [number, number, number] {
  const direction = unitVector(seed, time);
  const range = UNIVERSE_RADIUS - FREE_MIN_RADIUS - 0.8;
  const radius = FREE_MIN_RADIUS + range * (0.5 + 0.5 * Math.sin(time * 0.07 + seed));
  return direction.map((component) => component * radius) as [number, number, number];
}

/** Bir konumun güvenli serbest uzay aralığında olduğunu doğrular. */
export function isFreePositionSafe(position: [number, number, number]): boolean {
  const radius = Math.hypot(...position);
  return radius >= FREE_MIN_RADIUS && radius <= UNIVERSE_RADIUS;
}
