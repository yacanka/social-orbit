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
  const material = useRef<MeshBasicMaterial>(null);
  useEffect(() => {
    progress.current = selected ? 0 : 1;
    if (group.current) group.current.visible = selected;
  }, [selected]);
  useFrame((_, delta) => {
    if (!selected || !group.current) return;
    progress.current = paused ? .35 : Math.min(1, progress.current + delta * 2.2);
    const eased = 1 - Math.pow(1 - progress.current, 3);
    group.current.scale.setScalar(1 + eased * 1.15);
    group.current.visible = progress.current < 1;
    if (material.current) material.current.opacity = Math.pow(1 - progress.current, 2) * .34;
  });
  return <group ref={group} visible={false}>
    <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.38, .012, 5, 56]} />
      <meshBasicMaterial ref={material} color={color} transparent opacity={0} blending={AdditiveBlending} depthWrite={false} side={DoubleSide} /></mesh>
  </group>;
}
