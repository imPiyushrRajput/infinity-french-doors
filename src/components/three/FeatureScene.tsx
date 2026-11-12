"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const GOLD = "#d4ad57";
const STEEL = "#141f38";
const BLUE = "#1d6bc9";
const EASE = 0.07;

function useMats() {
  return useMemo(
    () => ({
      steel: new THREE.MeshStandardMaterial({ color: STEEL, metalness: 0.75, roughness: 0.32 }),
      zinc: new THREE.MeshStandardMaterial({ color: "#c9d2de", metalness: 0.95, roughness: 0.18 }),
      sheet: new THREE.MeshStandardMaterial({ color: "#7d8799", metalness: 0.85, roughness: 0.35 }),
      primer: new THREE.MeshStandardMaterial({ color: "#5a6a8a", metalness: 0.2, roughness: 0.7 }),
      coat: new THREE.MeshPhysicalMaterial({ color: BLUE, metalness: 0.1, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1 }),
      gold: new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.2 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: "#cfe6ff",
        transparent: true,
        opacity: 0.25,
        roughness: 0.05,
        clearcoat: 1,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
      shield: new THREE.MeshPhysicalMaterial({
        color: GOLD,
        transparent: true,
        opacity: 0.16,
        roughness: 0.1,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
      rain: new THREE.MeshStandardMaterial({ color: "#9cc4ff", metalness: 0.2, roughness: 0.2 }),
      road: new THREE.MeshStandardMaterial({ color: "#0f1a33", metalness: 0.2, roughness: 0.9 }),
      cab: new THREE.MeshStandardMaterial({ color: BLUE, metalness: 0.4, roughness: 0.35 }),
      cargo: new THREE.MeshStandardMaterial({ color: "#f3efe6", metalness: 0.1, roughness: 0.6 }),
      tyre: new THREE.MeshStandardMaterial({ color: "#0b0f1a", roughness: 0.9 }),
    }),
    [],
  );
}
type Mats = ReturnType<typeof useMats>;

/** Wraps a sub-scene: scales in when active, out when not. */
function Stage({ active, children, offset = 0 }: { active: boolean; children: React.ReactNode; offset?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    const t = active ? 1 : 0;
    const s = THREE.MathUtils.lerp(ref.current.scale.x, t, EASE);
    ref.current.scale.setScalar(Math.max(0.0001, s));
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, active ? 0 : -0.6 + offset, EASE);
    ref.current.visible = s > 0.01;
  });
  return (
    <group ref={ref} scale={0.0001}>
      {children}
    </group>
  );
}

/* 1 ▸ Materials: exploded coating stack */
function Layers({ mats, active }: { mats: Mats; active: boolean }) {
  const refs = useRef<THREE.Mesh[]>([]);
  const layers = [
    { m: mats.sheet, t: 0.08 },
    { m: mats.zinc, t: 0.03 },
    { m: mats.primer, t: 0.03 },
    { m: mats.coat, t: 0.035 },
  ];
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const spread = active ? 0.42 + Math.sin(t * 0.8) * 0.06 : 0.05;
    refs.current.forEach((m, i) => {
      if (!m) return;
      m.position.z = THREE.MathUtils.lerp(m.position.z, (i - 1.5) * spread, EASE);
      m.rotation.y = THREE.MathUtils.lerp(m.rotation.y, -0.35, EASE);
      m.rotation.x = THREE.MathUtils.lerp(m.rotation.x, 0.12, EASE);
    });
  });
  return (
    <group rotation={[0, 0, 0]}>
      {layers.map((l, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) refs.current[i] = el;
          }}
          material={l.m}
          position={[0, 0, 0]}
        >
          <boxGeometry args={[1.5, 2.1, l.t]} />
        </mesh>
      ))}
    </group>
  );
}

/* 2 ▸ Customisation: frame whose glazing grid reconfigures */
const CONFIGS: [number, number][] = [
  [2, 4],
  [3, 3],
  [1, 6],
  [2, 2],
];
function Configurator({ mats, active }: { mats: Mats; active: boolean }) {
  const groups = useRef<THREE.Group[]>([]);
  const idx = useRef(0);
  const last = useRef(0);
  const w = 1.5;
  const h = 2.1;
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (active && t - last.current > 2.2) {
      last.current = t;
      idx.current = (idx.current + 1) % CONFIGS.length;
    }
    groups.current.forEach((g, i) => {
      if (!g) return;
      const target = i === idx.current ? 1 : 0;
      const s = THREE.MathUtils.lerp(g.scale.x, target, 0.12);
      g.scale.set(Math.max(0.0001, s), Math.max(0.0001, s), 1);
      g.visible = s > 0.01;
    });
  });
  return (
    <group rotation={[0.1, -0.5, 0]}>
      {/* frame */}
      {[
        [0, h / 2, w + 0.12, 0.1],
        [0, -h / 2, w + 0.12, 0.1],
      ].map(([x, y, bw, bh], i) => (
        <mesh key={`r${i}`} material={mats.steel} position={[x, y, 0]}>
          <boxGeometry args={[bw, bh, 0.1]} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={`c${s}`} material={mats.steel} position={[s * (w / 2 + 0.01), 0, 0]}>
          <boxGeometry args={[0.1, h + 0.1, 0.1]} />
        </mesh>
      ))}
      <mesh material={mats.glass}>
        <boxGeometry args={[w, h, 0.02]} />
      </mesh>
      {CONFIGS.map(([cols, rows], ci) => (
        <group
          key={ci}
          ref={(el) => {
            if (el) groups.current[ci] = el;
          }}
        >
          {Array.from({ length: rows - 1 }).map((_, r) => (
            <mesh key={`r${r}`} material={mats.gold} position={[0, -h / 2 + (h / rows) * (r + 1), 0.02]}>
              <boxGeometry args={[w, 0.03, 0.05]} />
            </mesh>
          ))}
          {Array.from({ length: cols - 1 }).map((_, c) => (
            <mesh key={`c${c}`} material={mats.gold} position={[-w / 2 + (w / cols) * (c + 1), 0, 0.02]}>
              <boxGeometry args={[0.03, h, 0.05]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/* 3 ▸ Durability: rain bouncing off a coated panel under a shield */
const DROPS = 160;
/** Deterministic pseudo-random sequence so renders stay pure and SSR-stable. */
function makeSeeds() {
  let t = 0x2f6e2b1;
  const rnd = () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: DROPS }, () => ({
    x: (rnd() - 0.5) * 2.6,
    y: rnd() * 3,
    z: 0.3 + rnd() * 0.9,
    v: 1.6 + rnd() * 1.4,
  }));
}
function Weather({ mats, active }: { mats: Mats; active: boolean }) {
  const inst = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(() => makeSeeds(), []);
  const shield = useRef<THREE.Mesh>(null);
  useFrame((state, dt) => {
    if (inst.current) {
      seeds.forEach((s, i) => {
        if (active) s.y -= s.v * dt;
        if (s.y < -1.3) s.y = 1.8 + Math.random();
        dummy.position.set(s.x, s.y, s.z);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        inst.current!.setMatrixAt(i, dummy.matrix);
      });
      inst.current.instanceMatrix.needsUpdate = true;
    }
    if (shield.current) {
      shield.current.rotation.y = state.clock.elapsedTime * 0.35;
      const m = shield.current.material as THREE.MeshPhysicalMaterial;
      m.opacity = 0.12 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });
  return (
    <group rotation={[0.08, -0.45, 0]}>
      <mesh material={mats.coat}>
        <boxGeometry args={[1.5, 2.1, 0.08]} />
      </mesh>
      <mesh material={mats.gold} position={[0, 0, 0.045]}>
        <boxGeometry args={[1.56, 2.16, 0.01]} />
      </mesh>
      <mesh ref={shield} material={mats.shield} position={[0, 0, 0.1]}>
        <sphereGeometry args={[1.45, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      <instancedMesh ref={inst} args={[undefined, undefined, DROPS]} material={mats.rain}>
        <capsuleGeometry args={[0.012, 0.08, 3, 6]} />
      </instancedMesh>
    </group>
  );
}

/* 4 ▸ Delivery: truck travelling a loop */
function Truck({ mats, active }: { mats: Mats; active: boolean }) {
  const truck = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Mesh[]>([]);
  const x = useRef(-2.2);
  useFrame((_, dt) => {
    if (!truck.current) return;
    if (active) {
      x.current += dt * 1.1;
      if (x.current > 2.4) x.current = -2.4;
    }
    truck.current.position.x = x.current;
    truck.current.position.y = -0.55 + Math.sin(x.current * 9) * 0.01;
    wheels.current.forEach((w) => w && (w.rotation.x += dt * 6));
  });
  return (
    <group rotation={[0.25, 0.35, 0]}>
      <mesh material={mats.road} position={[0, -0.78, 0]} receiveShadow>
        <boxGeometry args={[5.2, 0.04, 1.2]} />
      </mesh>
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} material={mats.gold} position={[-2.4 + i * 0.6, -0.755, 0]}>
          <boxGeometry args={[0.3, 0.005, 0.04]} />
        </mesh>
      ))}
      <group ref={truck}>
        <mesh material={mats.cargo} position={[-0.25, 0.1, 0]}>
          <boxGeometry args={[1.2, 0.7, 0.62]} />
        </mesh>
        <mesh material={mats.cab} position={[0.62, -0.02, 0]}>
          <boxGeometry args={[0.5, 0.46, 0.6]} />
        </mesh>
        <mesh material={mats.glass} position={[0.88, 0.06, 0]}>
          <boxGeometry args={[0.02, 0.26, 0.5]} />
        </mesh>
        <mesh material={mats.gold} position={[-0.25, 0.1, 0.315]}>
          <boxGeometry args={[0.9, 0.08, 0.005]} />
        </mesh>
        {[
          [-0.62, 0.22],
          [-0.62, -0.22],
          [0.5, 0.22],
          [0.5, -0.22],
        ].map(([wx, wz], i) => (
          <mesh
            key={i}
            ref={(el) => {
              if (el) wheels.current[i] = el;
            }}
            material={mats.tyre}
            position={[wx, -0.3, wz]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.13, 0.13, 0.1, 18]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Scene({ step }: { step: number }) {
  const mats = useMats();
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 6]} intensity={1.6} />
      <pointLight position={[-4, 2, 3]} intensity={12} color={GOLD} />
      <pointLight position={[3, -1, -3]} intensity={8} color="#4a8fdc" />

      <Stage active={step === 0}>
        <Layers mats={mats} active={step === 0} />
      </Stage>
      <Stage active={step === 1}>
        <Configurator mats={mats} active={step === 1} />
      </Stage>
      <Stage active={step === 2}>
        <Weather mats={mats} active={step === 2} />
      </Stage>
      <Stage active={step === 3}>
        <Truck mats={mats} active={step === 3} />
      </Stage>

      <ContactShadows position={[0, -1.3, 0]} opacity={0.5} blur={2.4} scale={8} far={3} color="#060e1f" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} minPolarAngle={1.1} maxPolarAngle={1.8} />
      <Environment resolution={128}>
        <Lightformer intensity={3} position={[0, 4, -4]} scale={[12, 3, 1]} />
        <Lightformer intensity={2} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} color={GOLD} />
        <Lightformer intensity={1.5} position={[5, 0, 2]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} color="#9cc4ff" />
      </Environment>
    </>
  );
}

export default function FeatureScene({ step }: { step: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={wrap} className="h-full w-full cursor-grab active:cursor-grabbing">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0.3, 5.2], fov: 32 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene step={step} />
        </Suspense>
      </Canvas>
    </div>
  );
}
