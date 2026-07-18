/** Belirli yarıçapta eşit aralıklı yörünge parçacıklarını üretir. */
export function orbitParticlePositions(radius: number, count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const angle = index / count * Math.PI * 2;
    const drift = Math.sin(index * 12.7) * .035;
    positions.set([Math.cos(angle) * radius, drift, Math.sin(angle) * radius], index * 3);
  }
  return positions;
}

/** Hareketli orbital enerji kuyruğundaki bir parçacığın konumunu hesaplar. */
export function orbitTrailPosition(radius: number, angle: number, index: number): [number, number, number] {
  const offsetAngle = angle - index * .026;
  return [Math.cos(offsetAngle) * radius, 0, Math.sin(offsetAngle) * radius];
}
