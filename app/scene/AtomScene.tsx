"use client";

import { OrbitControls } from "@react-three/drei/core/OrbitControls.js";
import { Stars } from "@react-three/drei/core/Stars.js";
import { BackSide } from "three";
import type { OrbitalDensity, Placement, PlanetSkin } from "../domain/types";
import { Nucleus } from "./Nucleus";
import { OrbitShells } from "./OrbitShells";
import { PersonNode } from "./PersonNode";
import { SpaceEffects } from "./SpaceEffects";
import { UNIVERSE_RADIUS } from "./motion";

interface AtomSceneProps {
  ownerName: string;
  nucleusSkin: PlanetSkin;
  customTextureUrl?: string;
  orbitalDensity: OrbitalDensity;
  selectedId?: string;
  placements: Placement[];
  paused: boolean;
  onSelect: (id: string) => void;
}

function UniverseBoundary() {
  return <mesh><sphereGeometry args={[UNIVERSE_RADIUS, 48, 48]} />
    <meshBasicMaterial color="#6e7faa" side={BackSide} transparent opacity={0.025} /></mesh>;
}

/** Social Orbit'in etkileşimli Three.js sahnesini oluşturur. */
export function AtomScene({ ownerName, nucleusSkin, customTextureUrl, orbitalDensity, selectedId, placements, paused, onSelect }: AtomSceneProps) {
  return <>
    <color attach="background" args={["#050611"]} />
    <fog attach="fog" args={["#050611", 28, 60]} />
    <ambientLight intensity={.34} color="#91a4ef" />
    <directionalLight position={[8, 10, 7]} intensity={1.35} color="#c9d6ff" />
    <Stars radius={70} depth={40} count={2400} factor={2.2} saturation={.45} fade speed={paused ? 0 : .12} />
    <SpaceEffects paused={paused} /><UniverseBoundary /><OrbitShells paused={paused} density={orbitalDensity} />
    <Nucleus ownerName={ownerName} skin={nucleusSkin} customTextureUrl={customTextureUrl} paused={paused} />
    {placements.map((placement) => <PersonNode key={placement.person.id} placement={placement} paused={paused}
      selected={placement.person.id === selectedId} onSelect={onSelect} />)}
    <OrbitControls enablePan={false} minDistance={9} maxDistance={42} autoRotate={!paused && !placements.length} autoRotateSpeed={0.25} />
  </>;
}
