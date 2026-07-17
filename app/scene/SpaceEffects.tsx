"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, BackSide, type Group } from "three";

function seeded(index: number): number {
  const value = Math.sin(index * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function dustPositions(): Float32Array {
  const positions = new Float32Array(360 * 3);
  for (let index = 0; index < 360; index += 1) {
    const radius = 16 + seeded(index) * 35;
    const angle = seeded(index + 1) * Math.PI * 2;
    positions.set([Math.cos(angle) * radius, (seeded(index + 2) - .5) * 24, Math.sin(angle) * radius], index * 3);
  }
  return positions;
}

/** Sahneye yavaş hareket eden yıldız tozu ve nebula derinliği ekler. */
export function SpaceEffects({ paused }: { paused: boolean }) {
  const dust = useRef<Group>(null);
  const positions = useMemo(() => dustPositions(), []);
  useFrame((_, delta) => {
    if (!paused && dust.current) dust.current.rotation.y += delta * .006;
  });
  return <>
    <group ref={dust}><points>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color="#8aa7ff" size={.055} transparent opacity={.65} sizeAttenuation blending={AdditiveBlending} />
    </points></group>
    <mesh scale={[42, 31, 42]}><sphereGeometry args={[1, 48, 48]} />
      <meshBasicMaterial color="#28184f" side={BackSide} transparent opacity={.055} /></mesh>
  </>;
}
