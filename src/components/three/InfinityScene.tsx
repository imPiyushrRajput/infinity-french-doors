"use client";

import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { GOLD, SceneCanvas, STEEL, Studio, makeGlass } from "./kit";

/** Figure-eight (lemniscate) that passes over itself at the crossing. */
class InfinityCurve extends THREE.Curve<THREE.Vector3> {
  constructor(
    private readonly size = 1.7,
    private readonly lift = 0.2,
  ) {
    super();
  }
  getPoint(t: number, target = new THREE.Vector3()) {
    const a = t * Math.PI * 2;
    const d = 1 + Math.sin(a) ** 2;
    return target.set((this.size * Math.cos(a)) / d, (this.size * Math.sin(a) * Math.cos(a)) / d, this.lift * Math.sin(a));
  }
}

const PANES: { p: [number, number, number]; r: [number, number, number]; s: number }[] = [
  { p: [-2.1, 0.9, -0.6], r: [0.2, 0.5, 0.1], s: 0.55 },
  { p: [2.2, -0.7, -0.4], r: [-0.1, -0.6, -0.15], s: 0.65 },
  { p: [0.3, 1.25, -1], r: [0.3, 0.2, 0.25], s: 0.45 },
  { p: [-0.9, -1.2, 0.3], r: [-0.25, 0.35, -0.1], s: 0.4 },
];

function Emblem() {
  const group = useRef<THREE.Group>(null);
  const { tube, thread, gold, steel, glass, edges, edge } = useMemo(() => {
    const curve = new InfinityCurve();
    return {
      tube: new THREE.TubeGeometry(curve, 220, 0.085, 20, true),
      thread: new THREE.TubeGeometry(new InfinityCurve(1.7, -0.2), 220, 0.022, 10, true),
      gold: new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.16 }),
      steel: new THREE.MeshStandardMaterial({ color: STEEL, metalness: 0.8, roughness: 0.3 }),
      glass: makeGlass(),
      edges: new THREE.EdgesGeometry(new THREE.BoxGeometry(0.7, 1, 0.02)),
      edge: new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.7 }),
    };
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.35) * 0.55;
    group.current.rotation.x = Math.sin(t * 0.22) * 0.18;
  });

  return (
    <group ref={group}>
      <mesh geometry={tube} material={gold} />
      <mesh geometry={thread} material={steel} />
      {PANES.map((pane, i) => (
        <Float key={i} speed={1 + i * 0.2} rotationIntensity={0.5} floatIntensity={0.7}>
          <group position={pane.p} rotation={pane.r} scale={pane.s}>
            <mesh material={glass}>
              <boxGeometry args={[0.7, 1, 0.02]} />
            </mesh>
            <lineSegments geometry={edges} material={edge} />
          </group>
        </Float>
      ))}
    </group>
  );
}

/** Decorative gold infinity emblem with drifting glass panes. */
export default function InfinityScene() {
  return (
    <SceneCanvas camera={{ position: [0, 0, 6.2], fov: 34 }}>
      <Studio />
      <Emblem />
    </SceneCanvas>
  );
}
