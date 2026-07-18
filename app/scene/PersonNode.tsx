"use client";

import { Html } from "@react-three/drei/web/Html.js";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Group } from "three";
import type { Placement } from "../domain/types";
import { AtomicMarker } from "./AtomicMarker";
import { advanceMotionTime, freePosition } from "./motion";

interface PersonNodeProps {
  placement: Placement;
  paused: boolean;
  selected: boolean;
  onSelect: (id: string) => void;
}

const RADII = { 1: 4.4, 2: 8.1, 3: 12.1 } as const;
const COLORS = { 1: "#f9c87b", 2: "#a98dff", 3: "#72d9ff" } as const;
const ROTATIONS = { 1: [0.28, 0, 0.18], 2: [-0.42, 0.16, -0.12], 3: [0.38, -0.22, 0.26] } as const;

function OrbitalNode({ placement, paused, selected, onSelect }: PersonNodeProps) {
  const group = useRef<Group>(null);
  const angle = useRef((placement.seed % 1000) / 1000 * Math.PI * 2);
  const [hovered, setHovered] = useState(false);
  const shell = placement.shell as 1 | 2 | 3;
  const speed = 0.13 - shell * 0.022;

  useFrame((_, delta) => {
    if (!group.current) return;
    angle.current = advanceMotionTime(angle.current, delta * speed, paused, hovered);
    group.current.position.set(Math.cos(angle.current) * RADII[shell], 0, Math.sin(angle.current) * RADII[shell]);
  });

  return <group rotation={ROTATIONS[shell]}>
    <NodeVisual ref={group} placement={placement} color={COLORS[shell]} paused={paused} selected={selected}
      hovered={hovered} onHoverChange={setHovered} onSelect={onSelect} />
  </group>;
}

function FreeNode({ placement, paused, selected, onSelect }: PersonNodeProps) {
  const group = useRef<Group>(null);
  const motionTime = useRef(0);
  const [hovered, setHovered] = useState(false);
  useFrame((_, delta) => {
    if (!group.current) return;
    motionTime.current = advanceMotionTime(motionTime.current, delta, paused, hovered);
    const position = freePosition(placement.seed, motionTime.current);
    group.current.position.set(...position);
  });
  return <NodeVisual ref={group} placement={placement} color="#8a9bb7" paused={paused} selected={selected}
    hovered={hovered} onHoverChange={setHovered} onSelect={onSelect} free />;
}

interface NodeVisualProps {
  ref: React.Ref<Group>;
  placement: Placement;
  color: string;
  paused: boolean;
  selected: boolean;
  hovered: boolean;
  free?: boolean;
  onSelect: (id: string) => void;
  onHoverChange: (hovered: boolean) => void;
}

function NodeVisual({ ref, placement, color, paused, selected, hovered, free, onSelect, onHoverChange }: NodeVisualProps) {
  const select = () => onSelect(placement.person.id);
  return <group ref={ref}>
    <AtomicMarker color={color} free={free} paused={paused} selected={selected} hovered={hovered}
      seed={placement.seed} onSelect={select} onHoverChange={onHoverChange} />
    <pointLight color={color} intensity={free ? .28 : .8} distance={3.4} />
    <Html center position={[0, free ? -.54 : -.68, 0]} distanceFactor={14} zIndexRange={[20, 0]}>
      <button className={`person-label${free ? " person-label--free" : ""}${selected ? " person-label--selected" : ""}`}
        onClick={select}>
        {placement.person.name}<span>{placement.person.score}</span>
      </button>
    </Html>
  </group>;
}

/** Yerleşime göre orbital veya serbest kişi düğümü oluşturur. */
export function PersonNode(props: PersonNodeProps) {
  return props.placement.shell === "free" ? <FreeNode {...props} /> : <OrbitalNode {...props} />;
}
