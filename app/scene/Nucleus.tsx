"use client";

import { Sparkles } from "@react-three/drei/core/Sparkles.js";
import { Html } from "@react-three/drei/web/Html.js";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { AdditiveBlending, BackSide, type Group } from "three";
import { getPlanet } from "../domain/planets";
import type { PlanetSkin } from "../domain/types";
import { createPlanetTexture } from "./planet-texture";

interface NucleusProps {
  ownerName: string;
  paused: boolean;
  skin: PlanetSkin;
}

function SaturnRing() {
  return <mesh rotation={[Math.PI / 2.35, 0, -.18]}>
    <ringGeometry args={[1.35, 2.05, 96]} />
    <meshBasicMaterial color="#d9bd83" transparent opacity={.58} side={2} />
  </mesh>;
}

function Atmosphere({ color }: { color: string }) {
  return <>
    <mesh scale={1.1}><sphereGeometry args={[1.05, 40, 40]} />
      <meshBasicMaterial color={color} side={BackSide} transparent opacity={.18} blending={AdditiveBlending} /></mesh>
    <mesh scale={1.34}><sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={.045} blending={AdditiveBlending} /></mesh>
  </>;
}

/** Seçilen gök cismini merkez çekirdeği olarak çizer ve hareketlendirir. */
export function Nucleus({ ownerName, paused, skin }: NucleusProps) {
  const group = useRef<Group>(null);
  const planet = getPlanet(skin);
  const texture = useMemo(() => createPlanetTexture(planet), [planet]);

  useEffect(() => () => texture.dispose(), [texture]);
  useFrame((_, delta) => {
    if (!paused && group.current) group.current.rotation.y += delta * .08;
  });

  return <group ref={group}>
    <mesh><sphereGeometry args={[1.05, 64, 64]} />
      <meshStandardMaterial map={texture} color="#ffffff" emissive={planet.emissive} emissiveMap={texture}
        emissiveIntensity={planet.emissiveIntensity} roughness={planet.roughness} metalness={.03} /></mesh>
    {planet.hasRing && <SaturnRing />}
    <Atmosphere color={planet.colors[0]} />
    <pointLight color={planet.colors[0]} intensity={skin === "sun" ? 42 : 22} distance={15} decay={2} />
    <Sparkles count={skin === "sun" ? 42 : 22} scale={3.4} size={2.4} speed={paused ? 0 : .22} color={planet.colors[0]} />
    <Html center position={[0, -1.72, 0]}><div className="owner-label"><span>{planet.name.toLocaleUpperCase("tr-TR")}</span>{ownerName}</div></Html>
  </group>;
}
