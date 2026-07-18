"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { AdditiveBlending, MathUtils, type Group } from "three";
import { SelectionBurst } from "./SelectionBurst";

interface AtomicMarkerProps {
  color: string;
  free?: boolean;
  paused: boolean;
  selected: boolean;
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
export function AtomicMarker({ color, free, paused, selected, seed, onSelect }: AtomicMarkerProps) {
  const atom = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const rings = free ? RINGS.slice(0, 1) : RINGS;
  useFrame((_, delta) => {
    if (!atom.current) return;
    const baseScale = free ? .68 : .92;
    const targetScale = baseScale * (hovered ? 1.24 : 1) * (selected ? 1.08 : 1);
    atom.current.scale.setScalar(paused ? targetScale : MathUtils.damp(atom.current.scale.x, targetScale, 10, delta));
    if (!paused) {
      atom.current.rotation.y += delta * (.22 + seed % 5 * .018);
      atom.current.rotation.z += delta * .045;
    }
  });
  return <group ref={atom} scale={free ? .68 : .92} onClick={onSelect}
    onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
    <mesh><sphereGeometry args={[.17, 20, 20]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3.2} roughness={.24} /></mesh>
    <mesh scale={1.72}><sphereGeometry args={[.17, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={.09} blending={AdditiveBlending} depthWrite={false} /></mesh>
    {rings.map((rotation, index) => <ElectronRing color={color} rotation={rotation} index={index} key={index} />)}
    <SelectionBurst color={color} paused={paused} selected={selected} />
  </group>;
}
