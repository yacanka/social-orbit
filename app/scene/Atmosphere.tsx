"use client";

import { Sparkles } from "@react-three/drei/core/Sparkles.js";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { AdditiveBlending, BackSide, type Group } from "three";
import type { PlanetDefinition } from "../domain/planets";

interface AtmosphereProps {
  paused: boolean;
  planet: PlanetDefinition;
}

function StormBands({ color, opacity }: { color: string; opacity: number }) {
  return <>{[-.48, .02, .5].map((latitude) => <mesh key={latitude} position={[0, latitude, 0]} rotation={[Math.PI / 2, 0, 0]}>
    <torusGeometry args={[Math.sqrt(1.08 - latitude * latitude), .012, 5, 96]} />
    <meshBasicMaterial color={color} transparent opacity={opacity} blending={AdditiveBlending} />
  </mesh>)}</>;
}

function AtmosphericMotion({ planet, paused }: AtmosphereProps) {
  const { atmosphere } = planet;
  if (atmosphere.style === "corona") return <Sparkles count={52} scale={3.5} size={2.8} speed={paused ? 0 : .3} color={atmosphere.color} />;
  if (atmosphere.style === "dust") return <Sparkles count={26} scale={2.5} size={1.4} speed={paused ? 0 : .08} color={atmosphere.color} />;
  if (atmosphere.style === "storm") return <StormBands color={atmosphere.color} opacity={atmosphere.opacity * 1.6} />;
  if (atmosphere.style === "clouds") return <StormBands color="#e9f7ff" opacity={.12} />;
  if (atmosphere.style === "custom") return <Sparkles count={18} scale={2.7} size={1.5} speed={paused ? 0 : .12} color={atmosphere.color} />;
  return null;
}

/** Gök cismine özel dönen, titreşen ve parçacıklı atmosfer katmanını çizer. */
export function Atmosphere({ planet, paused }: AtmosphereProps) {
  const group = useRef<Group>(null);
  const { atmosphere } = planet;
  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    if (!paused) group.current.rotation.y += delta * atmosphere.speed;
    const time = paused ? 0 : clock.getElapsedTime();
    group.current.scale.setScalar(1 + Math.sin(time * 1.7) * atmosphere.pulse);
  });
  return <group ref={group}>
    <mesh scale={1.1}><sphereGeometry args={[1.05, 40, 40]} />
      <meshBasicMaterial color={atmosphere.color} side={BackSide} transparent opacity={atmosphere.opacity} blending={AdditiveBlending} /></mesh>
    <mesh scale={1.36}><sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color={atmosphere.color} transparent opacity={atmosphere.opacity * .24} blending={AdditiveBlending} /></mesh>
    <AtmosphericMotion planet={planet} paused={paused} />
  </group>;
}
