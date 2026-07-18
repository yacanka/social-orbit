"use client";

import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useCallback, useEffect, useRef } from "react";
import { AdditiveBlending, MathUtils, Vector3, type Group } from "three";
import { isScreenPointHovered, isVisibleDepth } from "./hover-proximity";
import { SelectionBurst } from "./SelectionBurst";

interface AtomicMarkerProps {
  color: string;
  free?: boolean;
  paused: boolean;
  selected: boolean;
  hovered: boolean;
  seed: number;
  onSelect: () => void;
  onHoverChange: (hovered: boolean) => void;
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

function ClickTarget({ onSelect }: Pick<AtomicMarkerProps, "onSelect">) {
  const select = (event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onSelect(); };
  return <mesh onClick={select}>
    <sphereGeometry args={[.48, 14, 14]} />
    <meshBasicMaterial transparent opacity={0} colorWrite={false} depthWrite={false} />
  </mesh>;
}

function usePointerPresence(canvas: HTMLCanvasElement, reset: () => void) {
  const active = useRef(false);
  useEffect(() => {
    const enter = () => { active.current = true; };
    const leave = () => { active.current = false; reset(); };
    canvas.addEventListener("pointermove", enter, { passive: true });
    canvas.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    return () => {
      canvas.removeEventListener("pointermove", enter);
      canvas.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
    };
  }, [canvas, reset]);
  return active;
}

function ScreenHoverSensor({ hovered, onHoverChange }: Pick<AtomicMarkerProps, "hovered" | "onHoverChange">) {
  const target = useRef<Group>(null);
  const current = useRef(hovered);
  const projected = useRef(new Vector3());
  const { camera, gl, pointer, size } = useThree();
  const update = useCallback((next: boolean) => {
    if (next === current.current) return;
    current.current = next;
    onHoverChange(next);
  }, [onHoverChange]);
  const reset = useCallback(() => update(false), [update]);
  const pointerActive = usePointerPresence(gl.domElement, reset);
  useFrame(() => {
    if (!target.current) return;
    target.current.getWorldPosition(projected.current).project(camera);
    const visible = isVisibleDepth(projected.current.z);
    const nearby = isScreenPointHovered(projected.current, pointer, { x: size.width, y: size.height }, current.current);
    update(pointerActive.current && visible && nearby);
  });
  return <group ref={target} />;
}

/** Kişi düğümünü çekirdek, halo ve elektron yörüngelerinden oluşan mini atom olarak çizer. */
export function AtomicMarker({ color, free, paused, selected, hovered, seed, onSelect, onHoverChange }: AtomicMarkerProps) {
  const atom = useRef<Group>(null);
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
  return <group ref={atom} scale={free ? .68 : .92}>
    <mesh><sphereGeometry args={[.17, 20, 20]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3.2} roughness={.24} /></mesh>
    <mesh scale={1.72}><sphereGeometry args={[.17, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={.09} blending={AdditiveBlending} depthWrite={false} /></mesh>
    {rings.map((rotation, index) => <ElectronRing color={color} rotation={rotation} index={index} key={index} />)}
    <SelectionBurst color={color} paused={paused} selected={selected} />
    <ScreenHoverSensor hovered={hovered} onHoverChange={onHoverChange} />
    <ClickTarget onSelect={onSelect} />
  </group>;
}
