"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { AdditiveBlending, type Group } from "three";

interface AtomicMarkerProps {
  color: string;
  free?: boolean;
  paused: boolean;
  seed: number;
  onSelect: () => void;
}

const RINGS = [[.72, .1, .45], [-.55, .35, -.62], [.18, -.72, .28]] as const;

function ElectronRing({ color, rotation, index }: { color: string; rotation: readonly [number, number, number]; index: number }) {
  const angle = index * 2.05;
  return <group rotation={rotation}>
    <mesh><torusGeometry args={[.34, .006, 5, 64]} />
      <meshBasicMaterial color={color} transparent opacity={.28} blending={AdditiveBlending} depthWrite={false} /></mesh>
    <mesh position={[Math.cos(angle) * .34, Math.sin(angle) * .34, 0]}><sphereGeometry args={[.035, 8, 8]} />
      <meshBasicMaterial color="#ffffff" /></mesh>
  </group>;
}

/** Kişi düğümünü çekirdek, halo ve elektron yörüngelerinden oluşan mini atom olarak çizer. */
export function AtomicMarker({ color, free, paused, seed, onSelect }: AtomicMarkerProps) {
  const atom = useRef<Group>(null);
  const rings = free ? RINGS.slice(0, 1) : RINGS;
  useFrame((_, delta) => {
    if (!paused && atom.current) {
      atom.current.rotation.y += delta * (.22 + seed % 5 * .018);
      atom.current.rotation.z += delta * .045;
    }
  });
  return <group ref={atom} scale={free ? .68 : .92} onClick={onSelect} onPointerDown={onSelect}>
    <mesh><sphereGeometry args={[.17, 20, 20]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3.2} roughness={.24} /></mesh>
    <mesh scale={1.72}><sphereGeometry args={[.17, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={.09} blending={AdditiveBlending} depthWrite={false} /></mesh>
    {rings.map((rotation, index) => <ElectronRing color={color} rotation={rotation} index={index} key={index} />)}
  </group>;
}
