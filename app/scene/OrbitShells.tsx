"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, type Group } from "three";
import type { OrbitalDensity } from "../domain/types";
import { getOrbitDensityProfile, orbitParticlePositions, orbitTrailPosition } from "./orbit-visual";

const SHELLS = [
  { shell: 1, radius: 4.4, color: "#f9c87b", rotation: [0.28, 0, 0.18] },
  { shell: 2, radius: 8.1, color: "#a98dff", rotation: [-0.42, 0.16, -0.12] },
  { shell: 3, radius: 12.1, color: "#72d9ff", rotation: [0.38, -0.22, 0.26] },
] as const;

interface OrbitShellProps {
  radius: number;
  color: string;
  rotation: readonly [number, number, number];
  paused: boolean;
  index: number;
  density: OrbitalDensity;
}

function EnergyTrail({ color, count }: Pick<OrbitShellProps, "color"> & { count: number }) {
  return <>{Array.from({ length: count }, (_, index) => <mesh key={index} scale={1 - index * .075}>
    <sphereGeometry args={[.07, 10, 10]} />
    <meshBasicMaterial color={color} transparent opacity={.9 - index * .12} blending={AdditiveBlending} depthWrite={false} />
  </mesh>)}</>;
}

function OrbitShell({ radius, color, rotation, paused, index, density }: OrbitShellProps) {
  const trail = useRef<Group>(null);
  const arc = useRef<Group>(null);
  const profile = getOrbitDensityProfile(density);
  const count = Math.round((82 - index * 12) * profile.particleMultiplier);
  const particles = useMemo(() => orbitParticlePositions(radius, count), [radius, count]);
  useFrame(({ clock }) => {
    const time = paused ? 0 : clock.getElapsedTime();
    const angle = time * (.2 - index * .028) + index * 2.1;
    trail.current?.children.forEach((child, childIndex) => child.position.set(...orbitTrailPosition(radius, angle, childIndex)));
    if (arc.current) arc.current.rotation.y = -angle;
  });
  return <group rotation={rotation}>
    <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[radius, .012, 6, 240]} />
      <meshBasicMaterial color={color} transparent opacity={profile.lineOpacity} depthWrite={false} /></mesh>
    <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[particles, 3]} /></bufferGeometry>
      <pointsMaterial color={color} size={.045} transparent opacity={profile.particleOpacity} sizeAttenuation blending={AdditiveBlending} depthWrite={false} /></points>
    <group ref={arc}><mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[radius, .035, 5, 72, .48]} />
      <meshBasicMaterial color={color} transparent opacity={profile.arcOpacity} blending={AdditiveBlending} depthWrite={false} /></mesh></group>
    <group ref={trail}><EnergyTrail color={color} count={profile.trailCount} /></group>
  </group>;
}

/** İnce çizgiler, parçacıklar ve enerji kuyruklarıyla atomik kabukları çizer. */
export function OrbitShells({ paused, density }: { paused: boolean; density: OrbitalDensity }) {
  return <>{SHELLS.map((shell, index) => <OrbitShell {...shell} index={index} paused={paused} density={density} key={shell.shell} />)}</>;
}
