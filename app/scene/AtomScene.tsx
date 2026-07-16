"use client";

import { OrbitControls } from "@react-three/drei/core/OrbitControls.js";
import { Sparkles } from "@react-three/drei/core/Sparkles.js";
import { Stars } from "@react-three/drei/core/Stars.js";
import { Html } from "@react-three/drei/web/Html.js";
import { BackSide } from "three";
import type { Placement } from "../domain/types";
import { PersonNode } from "./PersonNode";
import { UNIVERSE_RADIUS } from "./motion";

interface AtomSceneProps {
  ownerName: string;
  placements: Placement[];
  paused: boolean;
  onSelect: (id: string) => void;
}

const SHELLS = [
  { shell: 1, radius: 4.4, color: "#f9c87b", rotation: [0.28, 0, 0.18] },
  { shell: 2, radius: 8.1, color: "#a98dff", rotation: [-0.42, 0.16, -0.12] },
  { shell: 3, radius: 12.1, color: "#72d9ff", rotation: [0.38, -0.22, 0.26] },
] as const;

function Nucleus({ ownerName }: Pick<AtomSceneProps, "ownerName">) {
  return <group>
    <mesh><sphereGeometry args={[1.05, 48, 48]} />
      <meshStandardMaterial color="#f6d19a" emissive="#ff8a45" emissiveIntensity={2.4} roughness={0.22} /></mesh>
    <mesh scale={1.32}><sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="#ff7b4d" transparent opacity={0.08} /></mesh>
    <pointLight color="#ff9b62" intensity={35} distance={13} decay={2} />
    <Sparkles count={24} scale={3.2} size={2} speed={0.18} color="#ffd6a0" />
    <Html center position={[0, -1.65, 0]}><div className="owner-label"><span>MERKEZ</span>{ownerName}</div></Html>
  </group>;
}

function OrbitShells() {
  return <>{SHELLS.map(({ shell, radius, color, rotation }) => <group rotation={rotation} key={shell}>
    <mesh><torusGeometry args={[radius, 0.018, 8, 180]} />
      <meshBasicMaterial color={color} transparent opacity={0.34} /></mesh>
  </group>)}</>;
}

function UniverseBoundary() {
  return <mesh><sphereGeometry args={[UNIVERSE_RADIUS, 48, 48]} />
    <meshBasicMaterial color="#6e7faa" side={BackSide} transparent opacity={0.025} /></mesh>;
}

/** Social Orbit'in etkileşimli Three.js sahnesini oluşturur. */
export function AtomScene({ ownerName, placements, paused, onSelect }: AtomSceneProps) {
  return <>
    <color attach="background" args={["#050611"]} />
    <fog attach="fog" args={["#050611", 28, 60]} />
    <ambientLight intensity={0.18} color="#8493d8" />
    <Stars radius={70} depth={40} count={1800} factor={2.2} saturation={0.35} fade speed={paused ? 0 : 0.12} />
    <UniverseBoundary /><OrbitShells /><Nucleus ownerName={ownerName} />
    {placements.map((placement) => <PersonNode key={placement.person.id} placement={placement} paused={paused} onSelect={onSelect} />)}
    <OrbitControls enablePan={false} minDistance={9} maxDistance={42} autoRotate={!paused && !placements.length} autoRotateSpeed={0.25} />
  </>;
}
