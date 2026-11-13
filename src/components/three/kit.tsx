"use client";

/**
 * Shared building blocks for the newer 3D scenes (product viewer, door assembly,
 * infinity emblem). The hero door and the Key Features scene predate this file
 * and keep their own setup.
 */
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import * as THREE from "three";

export const GOLD = "#d4ad57";
export const STEEL = "#141f38";
export const GLASS = "#cfe6ff";

/** Canvas that only renders frames while it is on screen. */
export function SceneCanvas({
  children,
  camera,
  className = "",
}: {
  children: ReactNode;
  camera: ComponentProps<typeof Canvas>["camera"];
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className={`scene-pan-y h-full w-full ${className}`}>
      <Canvas
        dpr={[1, 1.5]}
        frameloop={visible ? "always" : "never"}
        camera={camera}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}

/** Lights plus a procedural studio environment (no network HDR). */
export function Studio() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 6]} intensity={1.8} />
      <pointLight position={[-4, 2, 3]} intensity={14} color={GOLD} />
      <pointLight position={[3, -1, -3]} intensity={10} color="#4a8fdc" />
      <Environment resolution={128}>
        <Lightformer intensity={3} position={[0, 4, -4]} scale={[12, 3, 1]} color="#ffffff" />
        <Lightformer intensity={2} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} color={GOLD} />
        <Lightformer intensity={1.5} position={[5, 0, 2]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} color="#9cc4ff" />
        <Lightformer intensity={0.8} position={[0, -4, 3]} scale={[10, 2, 1]} color="#ffffff" />
      </Environment>
    </>
  );
}

/** A rectangular frame built from four bars, centred on its position. */
export function RectFrame({
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
      <mesh material={material} position={[0, h / 2 - t / 2, 0]}>
        <boxGeometry args={[w, t, d]} />
      </mesh>
      <mesh material={material} position={[0, -h / 2 + t / 2, 0]}>
        <boxGeometry args={[w, t, d]} />
      </mesh>
      <mesh material={material} position={[-w / 2 + t / 2, 0, 0]}>
        <boxGeometry args={[t, h, d]} />
      </mesh>
      <mesh material={material} position={[w / 2 - t / 2, 0, 0]}>
        <boxGeometry args={[t, h, d]} />
      </mesh>
    </group>
  );
}

/** A glazed panel with a muntin grid; "diamond" adds a rhombus inside every cell. */
export function Glazing({
  w,
  h,
  rows,
  cols,
  glass,
  trim,
  pattern = "grid",
  showGlass = true,
  d = 0.03,
}: {
  w: number;
  h: number;
  rows: number;
  cols: number;
  glass: THREE.Material;
  trim: THREE.Material;
  pattern?: "grid" | "diamond";
  showGlass?: boolean;
  d?: number;
}) {
  const bars: ReactNode[] = [];
  const bar = 0.028;
  for (let r = 1; r < rows; r++) {
    bars.push(
      <mesh key={`r${r}`} material={trim} position={[0, -h / 2 + (h / rows) * r, 0]}>
        <boxGeometry args={[w, bar, d + 0.02]} />
      </mesh>,
    );
  }
  for (let c = 1; c < cols; c++) {
    bars.push(
      <mesh key={`c${c}`} material={trim} position={[-w / 2 + (w / cols) * c, 0, 0]}>
        <boxGeometry args={[bar, h, d + 0.02]} />
      </mesh>,
    );
  }
  if (pattern === "diamond") {
    const cw = w / cols;
    const ch = h / rows;
    const len = Math.hypot(cw / 2, ch / 2);
    const angle = Math.atan2(ch / 2, cw / 2);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = -w / 2 + cw * (c + 0.5);
        const cy = -h / 2 + ch * (r + 0.5);
        [
          [cw / 4, ch / 4, -angle],
          [-cw / 4, ch / 4, angle],
          [-cw / 4, -ch / 4, -angle],
          [cw / 4, -ch / 4, angle],
        ].forEach(([dx, dy, rot], i) => {
          bars.push(
            <mesh key={`d${r}-${c}-${i}`} material={trim} position={[cx + dx, cy + dy, 0]} rotation={[0, 0, rot]}>
              <boxGeometry args={[len, bar * 0.8, d + 0.016]} />
            </mesh>,
          );
        });
      }
    }
  }
  return (
    <group>
      {showGlass && (
        <mesh material={glass}>
          <boxGeometry args={[w, h, d]} />
        </mesh>
      )}
      {bars}
    </group>
  );
}

/** Standard glass used across the newer scenes. */
export function makeGlass() {
  return new THREE.MeshPhysicalMaterial({
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
}
