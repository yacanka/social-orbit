"use client";

import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import type { Placement, PlanetSkin } from "../domain/types";
import { AccessiblePeopleList } from "../components/AccessiblePeopleList";
import { AtomScene } from "./AtomScene";

interface OrbitSceneProps {
  ownerName: string;
  nucleusSkin: PlanetSkin;
  placements: Placement[];
  paused: boolean;
  onSelect: (id: string) => void;
}

function supportsWebGl(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** WebGL varsa 3D sahneyi, yoksa erişilebilir kişi listesini sunar. */
export function OrbitScene(props: OrbitSceneProps) {
  const [webGl] = useState(supportsWebGl);

  if (webGl === false) return <div className="webgl-fallback"><h2>Yörüngendeki kişiler</h2>
    <p>Bu tarayıcı 3D görünümü desteklemiyor. Tüm kişiler aşağıda erişilebilir.</p>
    <AccessiblePeopleList placements={props.placements} onSelect={props.onSelect} /></div>;
  return <Canvas camera={{ position: [0, 9, 22], fov: 48 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: false }}>
    <AtomScene {...props} />
  </Canvas>;
}
