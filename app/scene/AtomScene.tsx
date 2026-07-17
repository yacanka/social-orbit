"use client";

import { OrbitControls } from "@react-three/drei/core/OrbitControls.js";
import { Stars } from "@react-three/drei/core/Stars.js";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { BackSide } from "three";
import type { Group } from "three";
import type { Placement, PlanetSkin } from "../domain/types";
import { Nucleus } from "./Nucleus";
import { PersonNode } from "./PersonNode";
import { SpaceEffects } from "./SpaceEffects";
import { UNIVERSE_RADIUS } from "./motion";

interface AtomSceneProps {
  ownerName: string;
  nucleusSkin: PlanetSkin;
  customTextureUrl?: string;
  placements: Placement[];
  paused: boolean;
  onSelect: (id: string) => void;
}

const SHELLS = [
  { shell: 1, radius: 4.4, color: "#f9c87b", rotation: [0.28, 0, 0.18] },
  { shell: 2, radius: 8.1, color: "#a98dff", rotation: [-0.42, 0.16, -0.12] },
  { shell: 3, radius: 12.1, color: "#72d9ff", rotation: [0.38, -0.22, 0.26] },
] as const;

function EnergyShell({ radius, color, rotation, paused, index }: typeof SHELLS[number] & { paused: boolean; index: number }) {
  const pulse = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!pulse.current) return;
    const time = paused ? 0 : clock.getElapsedTime();
    const angle = time * (.18 - index * .025) + index * 2.1;
    pulse.current.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
  });
  return <group rotation={rotation}>
    <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[radius, .018, 8, 220]} />
      <meshBasicMaterial color={color} transparent opacity={.4} /></mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]} scale={1.003}><torusGeometry args={[radius, .055, 6, 220, .5]} />
      <meshBasicMaterial color={color} transparent opacity={.18} /></mesh>
    <group ref={pulse}><mesh><sphereGeometry args={[.075, 12, 12]} />
      <meshBasicMaterial color={color} /></mesh><pointLight color={color} intensity={1.8} distance={2.5} /></group>
  </group>;
}

function OrbitShells({ paused }: { paused: boolean }) {
  return <>{SHELLS.map((shell, index) => <EnergyShell {...shell} index={index} paused={paused} key={shell.shell} />)}</>;
}

function UniverseBoundary() {
  return <mesh><sphereGeometry args={[UNIVERSE_RADIUS, 48, 48]} />
    <meshBasicMaterial color="#6e7faa" side={BackSide} transparent opacity={0.025} /></mesh>;
}

/** Social Orbit'in etkileşimli Three.js sahnesini oluşturur. */
export function AtomScene({ ownerName, nucleusSkin, customTextureUrl, placements, paused, onSelect }: AtomSceneProps) {
  return <>
    <color attach="background" args={["#050611"]} />
    <fog attach="fog" args={["#050611", 28, 60]} />
    <ambientLight intensity={.34} color="#91a4ef" />
    <directionalLight position={[8, 10, 7]} intensity={1.35} color="#c9d6ff" />
    <Stars radius={70} depth={40} count={2400} factor={2.2} saturation={.45} fade speed={paused ? 0 : .12} />
    <SpaceEffects paused={paused} /><UniverseBoundary /><OrbitShells paused={paused} />
    <Nucleus ownerName={ownerName} skin={nucleusSkin} customTextureUrl={customTextureUrl} paused={paused} />
    {placements.map((placement) => <PersonNode key={placement.person.id} placement={placement} paused={paused} onSelect={onSelect} />)}
    <OrbitControls enablePan={false} minDistance={9} maxDistance={42} autoRotate={!paused && !placements.length} autoRotateSpeed={0.25} />
  </>;
}
