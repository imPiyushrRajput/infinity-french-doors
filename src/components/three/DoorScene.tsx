"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";

/* Palette */
const STEEL = "#141f38";
const STEEL_LIGHT = "#223253";
const GOLD = "#d4ad57";
const GLASS = "#cfe6ff";

/* Dimensions (metres-ish) */
const DOOR_W = 1.9; // clear opening width
const DOOR_H = 2.15;
const LEAF_W = DOOR_W / 2;
const FRAME_T = 0.09; // frame thickness
const DEPTH = 0.1;
const TRANSOM_H = 0.5;

function useMaterials() {
  return useMemo(() => {
    const steel = new THREE.MeshStandardMaterial({ color: STEEL, metalness: 0.75, roughness: 0.32 });
    const steelLight = new THREE.MeshStandardMaterial({ color: STEEL_LIGHT, metalness: 0.7, roughness: 0.35 });
    const gold = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.18 });
    const glass = new THREE.MeshPhysicalMaterial({
      color: GLASS,
      metalness: 0,
      roughness: 0.04,
      transparent: true,
      opacity: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      reflectivity: 1,
      envMapIntensity: 1.6,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    return { steel, steelLight, gold, glass };
  }, []);
}

type Mats = ReturnType<typeof useMaterials>;

/** A rectangular frame built from four bars. */
function Frame({
  w,
  h,
  t,
  d,
  material,
  position = [0, 0, 0],
}: {
  w: number;
  h: number;
  t: number;
  d: number;
  material: THREE.Material;
  position?: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh material={material} position={[0, h / 2 - t / 2, 0]} castShadow>
        <boxGeometry args={[w, t, d]} />
      </mesh>
      <mesh material={material} position={[0, -h / 2 + t / 2, 0]} castShadow>
        <boxGeometry args={[w, t, d]} />
      </mesh>
      <mesh material={material} position={[-w / 2 + t / 2, 0, 0]} castShadow>
        <boxGeometry args={[t, h, d]} />
      </mesh>
      <mesh material={material} position={[w / 2 - t / 2, 0, 0]} castShadow>
        <boxGeometry args={[t, h, d]} />
      </mesh>
    </group>
  );
}

/** Glass panel with a grid of slim muntins. */
function Glazing({
  w,
  h,
  rows,
  cols,
  mats,
  d = 0.03,
}: {
  w: number;
  h: number;
  rows: number;
  cols: number;
  mats: Mats;
  d?: number;
}) {
  const bars: React.ReactNode[] = [];
  for (let r = 1; r < rows; r++) {
    const y = -h / 2 + (h / rows) * r;
    bars.push(
      <mesh key={`r${r}`} material={mats.steelLight} position={[0, y, 0]}>
        <boxGeometry args={[w, 0.028, d + 0.02]} />
      </mesh>,
    );
  }
  for (let c = 1; c < cols; c++) {
    const x = -w / 2 + (w / cols) * c;
    bars.push(
      <mesh key={`c${c}`} material={mats.steelLight} position={[x, 0, 0]}>
        <boxGeometry args={[0.028, h, d + 0.02]} />
      </mesh>,
    );
  }
  return (
    <group>
      <mesh material={mats.glass}>
        <boxGeometry args={[w, h, d]} />
      </mesh>
      {bars}
    </group>
  );
}

/** One door leaf, hinged on its outer edge. */
function Leaf({
  side,
  open,
  mats,
}: {
  side: 1 | -1;
  open: MutableRefObject<number>;
  mats: Mats;
}) {
  const pivot = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!pivot.current) return;
    const target = side * -open.current;
    pivot.current.rotation.y = THREE.MathUtils.lerp(pivot.current.rotation.y, target, 0.07);
  });

  const stile = 0.075;
  const inner = LEAF_W - stile * 2;
  const innerH = DOOR_H - stile * 2 - 0.05;

  return (
    <group ref={pivot} position={[side * (DOOR_W / 2), 0, 0]}>
      <group position={[-side * (LEAF_W / 2), 0, 0]}>
        <Frame w={LEAF_W} h={DOOR_H} t={stile} d={DEPTH * 0.7} material={mats.steel} />
        {/* Kick rail */}
        <mesh material={mats.steel} position={[0, -DOOR_H / 2 + 0.3, 0]} castShadow>
          <boxGeometry args={[LEAF_W, 0.11, DEPTH * 0.7]} />
        </mesh>
        <group position={[0, 0.17, 0]}>
          <Glazing w={inner} h={innerH - 0.3} rows={4} cols={2} mats={mats} />
        </group>
        {/* Handle on the inner (meeting) edge */}
        <group position={[side * (LEAF_W / 2 - stile - 0.05), -0.05, DEPTH * 0.5]}>
          <mesh material={mats.gold} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.016, 0.016, 0.07, 16]} />
          </mesh>
          <mesh material={mats.gold} position={[0, -0.09, 0.04]}>
            <capsuleGeometry args={[0.014, 0.2, 6, 12]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function Door({ open, mats }: { open: MutableRefObject<number>; mats: Mats }) {
  const root = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!root.current) return;
    const t = state.clock.elapsedTime;
    const targetY = -0.42 + pointer.x * 0.28 + Math.sin(t * 0.25) * 0.03;
    const targetX = -pointer.y * 0.12;
    root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, targetY, 0.05);
    root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, targetX, 0.05);
  });

  const outerW = DOOR_W + FRAME_T * 2;
  const totalH = DOOR_H + TRANSOM_H + FRAME_T * 2;
  const centerY = (TRANSOM_H + FRAME_T) / 2 - FRAME_T / 2;

  return (
    <group ref={root} position={[0, -0.15, 0]}>
      {/* Outer frame around door + transom */}
      <Frame
        w={outerW}
        h={totalH}
        t={FRAME_T}
        d={DEPTH}
        material={mats.steel}
        position={[0, centerY, 0]}
      />
      {/* Transom bar */}
      <mesh material={mats.steel} position={[0, DOOR_H / 2 + FRAME_T / 2, 0]} castShadow>
        <boxGeometry args={[outerW, FRAME_T, DEPTH]} />
      </mesh>
      {/* Transom glazing */}
      <group position={[0, DOOR_H / 2 + FRAME_T + TRANSOM_H / 2, 0]}>
        <Glazing w={DOOR_W} h={TRANSOM_H} rows={1} cols={4} mats={mats} />
      </group>
      {/* Threshold */}
      <mesh material={mats.gold} position={[0, -DOOR_H / 2 - FRAME_T / 2, DEPTH * 0.2]}>
        <boxGeometry args={[outerW + 0.08, 0.025, DEPTH * 1.4]} />
      </mesh>

      <Leaf side={-1} open={open} mats={mats} />
      <Leaf side={1} open={open} mats={mats} />
    </group>
  );
}

function Scene({ openRef }: { openRef: MutableRefObject<number> }) {
  const mats = useMaterials();
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 6]} intensity={1.8} />
      <pointLight position={[-4, 2, 3]} intensity={14} color={GOLD} />
      <pointLight position={[3, -1, -3]} intensity={10} color="#4a8fdc" />

      <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.35} floatingRange={[-0.06, 0.06]}>
        <Door open={openRef} mats={mats} />
      </Float>

      <ContactShadows position={[0, -1.62, 0]} opacity={0.55} blur={2.6} scale={9} far={3.5} color="#060e1f" />

      {/* Procedural studio environment: no network fetch needed. */}
      <Environment resolution={256}>
        <Lightformer intensity={3} position={[0, 4, -4]} scale={[12, 3, 1]} color="#ffffff" />
        <Lightformer intensity={2} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} color={GOLD} />
        <Lightformer intensity={1.5} position={[5, 0, 2]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} color="#9cc4ff" />
        <Lightformer intensity={0.8} position={[0, -4, 3]} scale={[10, 2, 1]} color="#ffffff" />
      </Environment>
    </>
  );
}

/**
 * Interactive 3D French door.
 * `progress` (0..1) opens the leaves; hovering opens them further.
 */
export default function DoorScene({ progress = 0 }: { progress?: number }) {
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);
  const openRef = useRef(0.1);
  useEffect(() => {
    openRef.current = Math.max(hover ? 0.75 : 0, 0.12 + progress * 0.85);
  }, [hover, progress]);

  // Only render frames while the canvas is on screen (saves CPU/GPU further down the page).
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrap}
      className="h-full w-full cursor-grab active:cursor-grabbing"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0.25, 6.4], fov: 30 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene openRef={openRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
