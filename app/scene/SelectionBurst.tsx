"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { AdditiveBlending, DoubleSide, type Group, type MeshBasicMaterial } from "three";

interface SelectionBurstProps {
  color: string;
  paused: boolean;
  selected: boolean;
}

/** Atom seçildiğinde dışarı yayılan tek seferlik enerji şok dalgasını çizer. */
export function SelectionBurst({ color, paused, selected }: SelectionBurstProps) {
  const group = useRef<Group>(null);
  const progress = useRef(1);
  const firstMaterial = useRef<MeshBasicMaterial>(null);
  const secondMaterial = useRef<MeshBasicMaterial>(null);
  const sphereMaterial = useRef<MeshBasicMaterial>(null);
  useEffect(() => {
    progress.current = selected ? 0 : 1;
    if (group.current) group.current.visible = selected;
  }, [selected]);
  useFrame((_, delta) => {
    if (!selected || !group.current) return;
    progress.current = paused ? .32 : Math.min(1, progress.current + delta * 1.15);
    const eased = 1 - Math.pow(1 - progress.current, 3);
    group.current.scale.setScalar(1 + eased * 3.8);
    group.current.visible = progress.current < 1;
    const opacity = Math.pow(1 - progress.current, 2) * .72;
    if (firstMaterial.current) firstMaterial.current.opacity = opacity;
    if (secondMaterial.current) secondMaterial.current.opacity = opacity;
    if (sphereMaterial.current) sphereMaterial.current.opacity = opacity * .48;
  });
  return <group ref={group} visible={false}>
    <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.42, .018, 6, 72]} />
      <meshBasicMaterial ref={firstMaterial} color={color} transparent opacity={0} blending={AdditiveBlending} depthWrite={false} side={DoubleSide} /></mesh>
    <mesh rotation={[.65, .35, -.48]}><torusGeometry args={[.36, .012, 5, 64]} />
      <meshBasicMaterial ref={secondMaterial} color={color} transparent opacity={0} blending={AdditiveBlending} depthWrite={false} side={DoubleSide} /></mesh>
    <mesh scale={.34}><sphereGeometry args={[1, 20, 20]} />
      <meshBasicMaterial ref={sphereMaterial} color={color} transparent opacity={0} blending={AdditiveBlending} depthWrite={false} side={DoubleSide} /></mesh>
  </group>;
}
