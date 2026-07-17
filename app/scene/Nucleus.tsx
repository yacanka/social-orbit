"use client";

import { Html } from "@react-three/drei/web/Html.js";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { type Group } from "three";
import { getPlanet } from "../domain/planets";
import type { PlanetSkin } from "../domain/types";
import { Atmosphere } from "./Atmosphere";
import { createNucleusTexture } from "./planet-texture";

interface NucleusProps {
  ownerName: string;
  paused: boolean;
  skin: PlanetSkin;
  customTextureUrl?: string;
}

function SaturnRing() {
  return <mesh rotation={[Math.PI / 2.35, 0, -.18]}>
    <ringGeometry args={[1.35, 2.05, 96]} />
    <meshBasicMaterial color="#d9bd83" transparent opacity={.58} side={2} />
  </mesh>;
}

/** Seçilen gök cismini merkez çekirdeği olarak çizer ve hareketlendirir. */
export function Nucleus({ ownerName, paused, skin, customTextureUrl }: NucleusProps) {
  const group = useRef<Group>(null);
  const planet = getPlanet(skin);
  const source = skin === "custom" ? customTextureUrl : undefined;
  const texture = useMemo(() => createNucleusTexture(planet, source), [planet, source]);

  useEffect(() => () => texture.dispose(), [texture]);
  useFrame((_, delta) => {
    if (!paused && group.current) group.current.rotation.y += delta * .08;
  });

  return <group ref={group}>
    <mesh><sphereGeometry args={[1.05, 64, 64]} />
      <meshStandardMaterial map={texture} color="#ffffff" emissive={planet.emissive} emissiveMap={texture}
        emissiveIntensity={planet.emissiveIntensity} roughness={planet.roughness} metalness={.03} /></mesh>
    {planet.hasRing && <SaturnRing />}
    <Atmosphere planet={planet} paused={paused} />
    <pointLight color={planet.atmosphere.color} intensity={skin === "sun" ? 42 : skin === "moon" ? 10 : 22} distance={15} decay={2} />
    <Html center position={[0, -1.72, 0]}><div className="owner-label"><span>{planet.name.toLocaleUpperCase("tr-TR")}</span>{ownerName}</div></Html>
  </group>;
}
