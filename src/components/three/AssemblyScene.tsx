"use client";

import { useFrame } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
import type { MotionValue } from "motion/react";
import { useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { GOLD, Glazing, RectFrame, SceneCanvas, STEEL, Studio, makeGlass } from "./kit";

const W = 1.9;
const H = 2.15;
const FT = 0.09;
const DEPTH = 0.1;
const STILE = 0.075;
const LEAF_W = W / 2;

type Vec = [number, number, number];

/**
 * A group that flies from `from` to its home position while scroll progress
 * moves through [a, b]. `pop` scales it up from nothing instead.
 */
function Part({
  progress,
  a,
  b,
  from = [0, 0, 0],
  pop = false,
  children,
}: {
  progress: MotionValue<number>;
  a: number;
  b: number;
  from?: Vec;
  pop?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const t = THREE.MathUtils.clamp((progress.get() - a) / (b - a), 0, 1);
    const e = 1 - Math.pow(1 - t, 3);
    g.position.set(from[0] * (1 - e), from[1] * (1 - e), from[2] * (1 - e));
    if (pop) g.scale.setScalar(Math.max(0.0001, e));
    g.visible = t > 0.001;
  });
  return (
    <group ref={ref} visible={false}>
      {children}
    </group>
  );
}

function Door({ progress }: { progress: MotionValue<number> }) {
  const mats = useMemo(
    () => ({
      steel: new THREE.MeshStandardMaterial({ color: STEEL, metalness: 0.75, roughness: 0.32 }),
      trim: new THREE.MeshStandardMaterial({ color: "#223253", metalness: 0.7, roughness: 0.35 }),
      gold: new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.18 }),
      glass: makeGlass(),
    }),
    [],
  );
  const root = useRef<THREE.Group>(null);
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);

  useFrame((state) => {
    const p = progress.get();
    if (root.current) {
      root.current.rotation.y = -0.6 + p * 0.32 + Math.sin(state.clock.elapsedTime * 0.3) * 0.03;
    }
    // Once everything is fitted, the finished door swings open a little.
    const swing = THREE.MathUtils.clamp((p - 0.93) / 0.07, 0, 1) * 0.55;
    if (left.current) left.current.rotation.y = THREE.MathUtils.lerp(left.current.rotation.y, swing, 0.08);
    if (right.current) right.current.rotation.y = THREE.MathUtils.lerp(right.current.rotation.y, -swing, 0.08);
  });

  const outerW = W + FT * 2;
  const outerH = H + FT * 2;
  const inner = LEAF_W - STILE * 2;
  const glassH = H - STILE - 0.37;
  const glassY = (H / 2 - STILE + (-H / 2 + 0.37)) / 2;

  const leaf = (side: 1 | -1, ref: React.RefObject<THREE.Group | null>, delay: number) => (
    <group ref={ref} position={[side * (W / 2), 0, 0]}>
      <group position={[-side * (LEAF_W / 2), 0, 0]}>
        {/* 2 ▸ leaf frame */}
        <Part progress={progress} a={0.27 + delay} b={0.46 + delay} from={[side * 2.4, 0, 1.4]}>
          <RectFrame w={LEAF_W} h={H} t={STILE} d={DEPTH * 0.7} material={mats.steel} />
          <mesh material={mats.steel} position={[0, -H / 2 + 0.3, 0]}>
            <boxGeometry args={[inner, 0.11, DEPTH * 0.7]} />
          </mesh>
        </Part>
        {/* 3 ▸ glazing */}
        <Part progress={progress} a={0.51 + delay} b={0.7 + delay} from={[0, 0.4, 2.8]}>
          <group position={[0, glassY, 0]}>
            <Glazing w={inner} h={glassH} rows={4} cols={2} glass={mats.glass} trim={mats.trim} />
          </group>
        </Part>
        {/* 4 ▸ handle and hinges */}
        <Part progress={progress} a={0.75 + delay} b={0.86 + delay} pop>
          <group position={[-side * (LEAF_W / 2 - STILE - 0.05), -0.05, DEPTH * 0.5]}>
            <mesh material={mats.gold} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.016, 0.016, 0.07, 16]} />
            </mesh>
            <mesh material={mats.gold} position={[0, -0.09, 0.04]}>
              <capsuleGeometry args={[0.014, 0.2, 6, 12]} />
            </mesh>
          </group>
        </Part>
        {[-0.75, 0, 0.75].map((y, i) => (
          <Part key={y} progress={progress} a={0.79 + i * 0.025} b={0.9 + i * 0.025} pop>
            <mesh material={mats.gold} position={[side * (LEAF_W / 2), y, DEPTH * 0.3]}>
              <cylinderGeometry args={[0.022, 0.022, 0.16, 14]} />
            </mesh>
          </Part>
        ))}
      </group>
    </group>
  );

  return (
    <group ref={root} position={[0, -0.05, 0]}>
      {/* 1 ▸ outer frame, bar by bar */}
      <Part progress={progress} a={0.02} b={0.13} from={[0, -2.4, 0]}>
        <mesh material={mats.steel} position={[0, -outerH / 2 + FT / 2, 0]}>
          <boxGeometry args={[outerW, FT, DEPTH]} />
        </mesh>
      </Part>
      <Part progress={progress} a={0.06} b={0.17} from={[-3, 0, 0]}>
        <mesh material={mats.steel} position={[-outerW / 2 + FT / 2, 0, 0]}>
          <boxGeometry args={[FT, outerH, DEPTH]} />
        </mesh>
      </Part>
      <Part progress={progress} a={0.1} b={0.21} from={[3, 0, 0]}>
        <mesh material={mats.steel} position={[outerW / 2 - FT / 2, 0, 0]}>
          <boxGeometry args={[FT, outerH, DEPTH]} />
        </mesh>
      </Part>
      <Part progress={progress} a={0.14} b={0.25} from={[0, 2.4, 0]}>
        <mesh material={mats.steel} position={[0, outerH / 2 - FT / 2, 0]}>
          <boxGeometry args={[outerW, FT, DEPTH]} />
        </mesh>
      </Part>

      {leaf(-1, left, 0)}
      {leaf(1, right, 0.04)}

      {/* Gold threshold closes the job */}
      <Part progress={progress} a={0.86} b={0.94} from={[0, -0.8, 0.6]}>
        <mesh material={mats.gold} position={[0, -outerH / 2 - 0.0125, DEPTH * 0.2]}>
          <boxGeometry args={[outerW + 0.08, 0.025, DEPTH * 1.4]} />
        </mesh>
      </Part>
    </group>
  );
}

/** A French door that builds itself as `progress` runs from 0 to 1. */
export default function AssemblyScene({ progress }: { progress: MotionValue<number> }) {
  return (
    <SceneCanvas camera={{ position: [0, 0.2, 7.4], fov: 30 }}>
      <Studio />
      <Float speed={1} rotationIntensity={0.08} floatIntensity={0.25} floatingRange={[-0.04, 0.04]}>
        <Door progress={progress} />
      </Float>
      <ContactShadows position={[0, -1.3, 0]} opacity={0.5} blur={2.6} scale={9} far={3.5} color="#060e1f" />
    </SceneCanvas>
  );
}
