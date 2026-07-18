"use client";

import { Html } from "@react-three/drei/web/Html.js";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import type { Placement } from "../domain/types";
import { AtomicMarker } from "./AtomicMarker";
import { freePosition } from "./motion";

interface PersonNodeProps {
  placement: Placement;
  paused: boolean;
  onSelect: (id: string) => void;
}

const RADII = { 1: 4.4, 2: 8.1, 3: 12.1 } as const;
const COLORS = { 1: "#f9c87b", 2: "#a98dff", 3: "#72d9ff" } as const;
const ROTATIONS = { 1: [0.28, 0, 0.18], 2: [-0.42, 0.16, -0.12], 3: [0.38, -0.22, 0.26] } as const;

function OrbitalNode({ placement, paused, onSelect }: PersonNodeProps) {
  const group = useRef<Group>(null);
  const shell = placement.shell as 1 | 2 | 3;
  const phase = (placement.seed % 1000) / 1000 * Math.PI * 2;
  const speed = 0.13 - shell * 0.022;

  useFrame(({ clock }) => {
    if (!group.current) return;
    const time = paused ? 0 : clock.getElapsedTime();
    const angle = phase + time * speed;
    group.current.position.set(Math.cos(angle) * RADII[shell], 0, Math.sin(angle) * RADII[shell]);
  });

  return <group rotation={ROTATIONS[shell]}>
    <NodeVisual ref={group} placement={placement} color={COLORS[shell]} paused={paused} onSelect={onSelect} />
  </group>;
}

function FreeNode({ placement, paused, onSelect }: PersonNodeProps) {
  const group = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const position = freePosition(placement.seed, paused ? 0 : clock.getElapsedTime());
    group.current.position.set(...position);
  });
  return <NodeVisual ref={group} placement={placement} color="#8a9bb7" paused={paused} onSelect={onSelect} free />;
}

interface NodeVisualProps {
  ref: React.Ref<Group>;
  placement: Placement;
  color: string;
  paused: boolean;
  free?: boolean;
  onSelect: (id: string) => void;
}

function NodeVisual({ ref, placement, color, paused, free, onSelect }: NodeVisualProps) {
  const select = () => onSelect(placement.person.id);
  return <group ref={ref}>
    <AtomicMarker color={color} free={free} paused={paused} seed={placement.seed} onSelect={select} />
    <pointLight color={color} intensity={free ? .28 : .8} distance={3.4} />
    <Html center distanceFactor={14} zIndexRange={[20, 0]}>
      <button className={`person-label${free ? " person-label--free" : ""}`} onClick={select} onPointerDown={select}>
        {placement.person.name}<span>{placement.person.score}</span>
      </button>
    </Html>
  </group>;
}

/** Yerleşime göre orbital veya serbest kişi düğümü oluşturur. */
export function PersonNode(props: PersonNodeProps) {
  return props.placement.shell === "free" ? <FreeNode {...props} /> : <OrbitalNode {...props} />;
}
