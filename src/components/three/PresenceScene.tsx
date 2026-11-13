"use client";

/**
 * Presence "orbit": two tall gold door frames (the manufacturing plants) stand
 * on a rippling stage of light while a ring of small door portals (the
 * experience centers) circles them, a pulse of light running round the ring.
 * Deliberately abstract, so it reads differently from the Working Areas map.
 */
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { GOLD, RectFrame, SceneCanvas, Studio } from "./kit";

const FIELD_RADIUS = 3.4;
const RING_RADIUS = 2.25;
const PLANT_X = 0.62;
const PLANT_W = 0.78;
const PLANT_H = 1.55;

/* ---------- Stage: dot field, animated in the shader (one draw call) ---------- */

const fieldVertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uCenter;
  uniform float uSize;
  attribute float aSeed;
  varying float vGlow;
  varying float vEdge;
  void main() {
    vec3 p = position;
    float d = distance(p.xz, uCenter);
    float wave = sin(d * 5.0 - uTime * 2.2);
    float fall = exp(-d * 0.55);
    p.y += wave * 0.04 * fall + sin(uTime * 0.6 + aSeed * 6.2831) * 0.01;
    vGlow = smoothstep(0.55, 1.0, wave) * fall;
    vEdge = 1.0 - smoothstep(${(FIELD_RADIUS - 1.2).toFixed(2)}, ${FIELD_RADIUS.toFixed(2)}, length(p.xz));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * (1.0 + vGlow * 1.3) * (6.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fieldFragment = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uHot;
  varying float vGlow;
  varying float vEdge;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.15, r);
    gl_FragColor = vec4(mix(uBase, uHot, vGlow), a * vEdge * (0.45 + vGlow * 0.55));
  }
`;

function DotField({ center }: { center: number }) {
  const dpr = useThree((s) => s.viewport.dpr);
  const geometry = useMemo(() => {
    const pos: number[] = [];
    const seed: number[] = [];
    const step = 0.12;
    let n = 0;
    for (let x = -FIELD_RADIUS; x <= FIELD_RADIUS; x += step) {
      for (let z = -FIELD_RADIUS; z <= FIELD_RADIUS; z += step) {
        if (x * x + z * z > FIELD_RADIUS * FIELD_RADIUS) continue;
        pos.push(x, 0, z);
        // Deterministic pseudo-random phase per dot
        seed.push((((Math.sin(++n * 12.9898) * 43758.5453) % 1) + 1) % 1);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.Float32BufferAttribute(seed, 1));
    return g;
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: fieldVertex,
        fragmentShader: fieldFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uCenter: { value: new THREE.Vector2() },
          uSize: { value: 2.6 },
          uBase: { value: new THREE.Color("#4f86d8") },
          uHot: { value: new THREE.Color(GOLD) },
        },
      }),
    [],
  );

  const points = useRef<THREE.Points>(null);
  useFrame((_, dt) => {
    const m = points.current?.material as THREE.ShaderMaterial | undefined;
    if (!m) return;
    const u = m.uniforms;
    u.uTime.value += dt;
    u.uSize.value = 2.6 * dpr;
    const c = u.uCenter.value as THREE.Vector2;
    c.x = THREE.MathUtils.damp(c.x, center, 3, dt);
  });

  return <points ref={points} geometry={geometry} material={material} />;
}

/* ---------- Labels: text drawn to a canvas texture, shown as a sprite ---------- */

type LabelStyle = "plant" | "plant-active";

function makeLabel(text: string, style: LabelStyle) {
  const ratio = 3;
  const font = typeof document === "undefined" ? "sans-serif" : getComputedStyle(document.body).fontFamily;
  const size = 11;
  const tracking = 2;
  const label = text.toUpperCase();
  const padX = 12;
  const h = 26;

  const measure = document.createElement("canvas").getContext("2d")!;
  measure.font = `600 ${size}px ${font}`;
  const w = Math.ceil(measure.measureText(label).width + tracking * (label.length - 1) + padX * 2);

  const canvas = document.createElement("canvas");
  canvas.width = w * ratio;
  canvas.height = h * ratio;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(ratio, ratio);
  ctx.beginPath();
  ctx.roundRect(0.5, 0.5, w - 1, h - 1, h / 2);
  ctx.fillStyle = style === "plant-active" ? "#dcb866" : "rgba(6, 14, 31, 0.85)";
  ctx.fill();
  if (style === "plant") {
    ctx.strokeStyle = "rgba(220, 184, 102, 0.55)";
    ctx.stroke();
  }
  ctx.font = `600 ${size}px ${font}`;
  ctx.textBaseline = "middle";
  ctx.fillStyle = style === "plant-active" ? "#060e1f" : "#ead9a6";
  let x = padX;
  for (const ch of label) {
    ctx.fillText(ch, x, h / 2 + 0.5);
    x += ctx.measureText(ch).width + tracking;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return { texture, aspect: w / h };
}

function Label({ text, style, height, position }: { text: string; style: LabelStyle; height: number; position: [number, number, number] }) {
  const { texture, aspect } = useMemo(() => makeLabel(text, style), [text, style]);
  return (
    <sprite position={position} scale={[height * aspect, height, 1]} renderOrder={10}>
      <spriteMaterial map={texture} transparent depthTest={false} depthWrite={false} toneMapped={false} />
    </sprite>
  );
}

/* ---------- Plant: a tall gold French door frame ---------- */

/** Vertical fade (bright at the floor, gone at the top) for the light beam. */
function makeBeamTexture() {
  const c = document.createElement("canvas");
  c.width = 4;
  c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, 128);
  g.addColorStop(0, "rgba(255,255,255,0)");
  g.addColorStop(0.55, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,1)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 4, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function PlantDoor({
  x,
  label,
  active,
  onSelect,
  gold,
  glass,
}: {
  x: number;
  label: string;
  active: boolean;
  onSelect: () => void;
  gold: THREE.Material;
  glass: THREE.Material;
}) {
  const body = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  const pane = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  const beam = useMemo(() => makeBeamTexture(), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const g = body.current;
    if (g) {
      const lift = active ? 0.12 + Math.sin(t * 1.4) * 0.03 : hover ? 0.06 : 0;
      g.position.y = THREE.MathUtils.damp(g.position.y, lift, 4, dt);
      const s = THREE.MathUtils.damp(g.scale.x, active ? 1 : 0.86, 4, dt);
      g.scale.setScalar(s);
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, active ? Math.sin(t * 0.5) * 0.18 : 0, 3, dt);
    }
    const hm = halo.current?.material as THREE.MeshBasicMaterial | undefined;
    if (hm) hm.opacity = THREE.MathUtils.damp(hm.opacity, active ? 0.5 : 0, 4, dt);
    const pm = pane.current?.material as THREE.MeshBasicMaterial | undefined;
    if (pm) pm.opacity = THREE.MathUtils.damp(pm.opacity, active ? 0.28 + Math.sin(t * 2) * 0.05 : 0.06, 4, dt);
  });

  const leafW = PLANT_W / 2 - 0.03;

  return (
    <group position={[x, 0, 0]}>
      {/* Light column behind the selected plant */}
      <mesh ref={halo} position={[0, 1.4, -0.05]}>
        <cylinderGeometry args={[0.28, 0.6, 2.8, 32, 1, true]} />
        <meshBasicMaterial color={GOLD} map={beam} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.FrontSide} />
      </mesh>

      <group ref={body}>
        <group position={[0, PLANT_H / 2, 0]}>
          <RectFrame w={PLANT_W} h={PLANT_H} t={0.06} d={0.08} material={gold} />
          {/* Two leaves with a centre stile */}
          {[-1, 1].map((side) => (
            <group key={side} position={[(side * PLANT_W) / 4, 0, 0]}>
              <RectFrame w={leafW} h={PLANT_H - 0.14} t={0.03} d={0.05} material={gold} />
              <mesh material={glass}>
                <boxGeometry args={[leafW - 0.05, PLANT_H - 0.2, 0.012]} />
              </mesh>
              {[1, 2, 3].map((r) => (
                <mesh key={r} material={gold} position={[0, -PLANT_H / 2 + 0.07 + ((PLANT_H - 0.14) / 4) * r, 0]}>
                  <boxGeometry args={[leafW - 0.04, 0.016, 0.03]} />
                </mesh>
              ))}
            </group>
          ))}
          {/* Inner glow */}
          <mesh ref={pane} position={[0, 0, -0.02]}>
            <planeGeometry args={[PLANT_W - 0.12, PLANT_H - 0.12]} />
            <meshBasicMaterial color="#ffd98a" transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        </group>
      </group>

      {/* Glow pool on the floor */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.005}>
        <circleGeometry args={[0.7, 48]} />
        <meshBasicMaterial color={GOLD} transparent opacity={active ? 0.18 : 0.05} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Generous invisible hit area */}
      <mesh
        position={[0, PLANT_H / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <boxGeometry args={[PLANT_W + 0.2, PLANT_H + 0.3, 0.4]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <Label text={label} style={active ? "plant-active" : "plant"} height={0.17} position={[0, PLANT_H + 0.38, 0]} />
    </group>
  );
}

/* ---------- Experience centers: a revolving ring of small door portals ---------- */

function PortalRing({ count, frame }: { count: number; frame: THREE.Material }) {
  const ring = useRef<THREE.Group>(null);
  const panes = useRef<(THREE.Mesh | null)[]>([]);
  const doors = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2;
        return {
          a,
          pos: [Math.cos(a) * RING_RADIUS, 0, Math.sin(a) * RING_RADIUS] as [number, number, number],
          rotY: Math.atan2(-Math.cos(a), -Math.sin(a)),
        };
      }),
    [count],
  );

  useFrame((state, dt) => {
    if (ring.current) ring.current.rotation.y += dt * 0.12;
    // A pulse of light runs round the ring
    const head = (state.clock.elapsedTime * 2.2) % count;
    panes.current.forEach((m, i) => {
      if (!m) return;
      const d = Math.min(Math.abs(i - head), count - Math.abs(i - head));
      const glow = Math.max(0, 1 - d / 2.2);
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.12 + glow * 0.55;
      mat.color.lerpColors(BLUE, WARM, glow);
    });
  });

  return (
    <group ref={ring}>
      {/* Orbit path */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.01}>
        <ringGeometry args={[RING_RADIUS - 0.012, RING_RADIUS + 0.012, 128]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {doors.map((d, i) => (
        <group key={i} position={d.pos} rotation-y={d.rotY}>
          <RectFrame w={0.26} h={0.46} t={0.022} d={0.03} material={frame} position={[0, 0.23, 0]} />
          <mesh
            ref={(m) => {
              panes.current[i] = m;
            }}
            position={[0, 0.23, 0]}
          >
            <planeGeometry args={[0.22, 0.42]} />
            <meshBasicMaterial color={BLUE} transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

const BLUE = new THREE.Color("#5f9bff");
const WARM = new THREE.Color("#ffd98a");

/* ---------- Rig: fits the stage to the canvas and follows the pointer ---------- */

function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const aspect = useThree((s) => s.viewport.aspect);
  const fit = Math.min(1, Math.max(0.7, aspect / 1.1));

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, state.pointer.x * 0.3, 2, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * 0.05, 2, dt);
  });

  return (
    <group ref={group} scale={fit} position={[0, -0.75, 0]}>
      {children}
    </group>
  );
}

export default function PresenceScene({
  plants,
  centers,
  active,
  onSelect,
}: {
  plants: { label: string }[];
  centers: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  const gold = useMemo(
    () => new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.85, roughness: 0.28, envMapIntensity: 1.6 }),
    [],
  );
  const steel = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#c7d3e6", metalness: 0.7, roughness: 0.35, envMapIntensity: 1.4 }),
    [],
  );
  const glass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#cfe6ff",
        transparent: true,
        opacity: 0.18,
        roughness: 0.05,
        clearcoat: 1,
        envMapIntensity: 1.6,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [],
  );
  const xs = plants.map((_, i) => (plants.length === 1 ? 0 : (i - (plants.length - 1) / 2) * 2 * PLANT_X));

  return (
    <SceneCanvas camera={{ position: [0, 2.3, 5.4], fov: 40 }}>
      <Studio />
      <Rig>
        <DotField center={xs[active]} />
        <PortalRing count={centers} frame={steel} />
        {plants.map((p, i) => (
          <PlantDoor
            key={p.label}
            x={xs[i]}
            label={p.label}
            active={i === active}
            onSelect={() => onSelect(i)}
            gold={gold}
            glass={glass}
          />
        ))}
      </Rig>
    </SceneCanvas>
  );
}
