"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { GOLD, Glazing, RectFrame, SceneCanvas, STEEL, Studio, makeGlass } from "./kit";
import { productModels, type DoorModel } from "./productModels";

/* Section sizes (metres-ish) */
const FT = 0.08; // outer frame thickness
const DEPTH = 0.1;
const STILE = 0.07; // leaf frame thickness
const WHITE = new THREE.Color("#ffffff");

/** Materials for one model; the frame colour eases towards the chosen finish. */
function useFinish(color: string) {
  const mats = useMemo(
    () => ({
      frame: new THREE.MeshStandardMaterial({ color: STEEL, metalness: 0.45, roughness: 0.38, envMapIntensity: 1.7 }),
      trim: new THREE.MeshStandardMaterial({ color: "#223253", metalness: 0.42, roughness: 0.4, envMapIntensity: 1.7 }),
      gold: new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.18 }),
      glass: makeGlass(),
      stone: new THREE.MeshStandardMaterial({ color: "#d9d2c3", metalness: 0, roughness: 0.85 }),
      wall: new THREE.MeshStandardMaterial({ color: "#a9a394", metalness: 0, roughness: 0.95 }),
      figure: new THREE.MeshStandardMaterial({ color: "#f3efe6", roughness: 0.9, transparent: true, opacity: 0.5 }),
    }),
    [],
  );
  const targets = useMemo(() => {
    const base = new THREE.Color(color);
    return { base, trim: base.clone().lerp(WHITE, 0.14) };
  }, [color]);
  useFrame(() => {
    mats.frame.color.lerp(targets.base, 0.09);
    mats.trim.color.lerp(targets.trim, 0.09);
  });
  return mats;
}
type Mats = ReturnType<typeof useFinish>;

/** One hinged leaf. Local origin sits at the hinge, on the floor line. */
function Leaf({
  side,
  pivotX,
  w,
  cfg,
  mats,
  open,
}: {
  side: 1 | -1;
  pivotX: number;
  w: number;
  cfg: DoorModel;
  mats: Mats;
  open: boolean;
}) {
  const pivot = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!pivot.current) return;
    pivot.current.rotation.y = THREE.MathUtils.lerp(pivot.current.rotation.y, open ? side * -1.15 : 0, 0.06);
  });

  const H = cfg.h;
  const iw = w - STILE * 2;
  const kick = cfg.kick ?? 0;
  const bottom = -H / 2;
  const yb = bottom + (kick > 0 ? STILE + kick + 0.07 : cfg.kickRail ? 0.35 : STILE);
  const yt = H / 2 - STILE;
  const gh = yt - yb;
  const gy = (yt + yb) / 2;
  const handleY = cfg.sill ? 0 : bottom + 1.0;
  const freeX = -side * (w / 2 - STILE - 0.045);
  const grillX = Array.from({ length: 5 }, (_, i) => -iw / 2 + (iw * (i + 1)) / 6);

  return (
    <group ref={pivot} position={[pivotX, 0, 0]}>
      <group position={[-side * (w / 2), H / 2, 0]}>
        <RectFrame w={w} h={H} t={STILE} d={DEPTH * 0.7} material={mats.frame} />

        {kick > 0 && (
          <>
            <mesh material={mats.frame} position={[0, bottom + STILE + kick / 2, 0]}>
              <boxGeometry args={[iw, kick, 0.03]} />
            </mesh>
            <mesh material={mats.frame} position={[0, bottom + STILE + kick + 0.035, 0]}>
              <boxGeometry args={[iw, 0.07, DEPTH * 0.7]} />
            </mesh>
          </>
        )}
        {kick === 0 && cfg.kickRail && (
          <>
            <mesh material={mats.frame} position={[0, bottom + (STILE + 0.25) / 2, 0]}>
              <boxGeometry args={[iw, 0.25 - STILE, 0.025]} />
            </mesh>
            <mesh material={mats.frame} position={[0, bottom + 0.3, 0]}>
              <boxGeometry args={[iw, 0.1, DEPTH * 0.7]} />
            </mesh>
          </>
        )}

        <group position={[0, gy, 0]}>
          <Glazing
            w={iw}
            h={gh}
            rows={cfg.rows}
            cols={cfg.cols}
            glass={mats.glass}
            trim={mats.trim}
            pattern={cfg.pattern}
            showGlass={cfg.glass !== false}
          />
          {cfg.grill && (
            <group position={[0, 0, 0.012]}>
              {grillX.map((x) => (
                <mesh key={`v${x}`} material={mats.trim} position={[x, 0, 0]}>
                  <cylinderGeometry args={[0.011, 0.011, gh, 10]} />
                </mesh>
              ))}
              {[0.25, 0.5, 0.75].map((f) => (
                <mesh key={`h${f}`} material={mats.trim} position={[0, -gh / 2 + gh * f, 0]}>
                  <boxGeometry args={[iw, 0.022, 0.012]} />
                </mesh>
              ))}
              {grillX.map((x) => (
                <mesh key={`g${x}`} material={mats.gold} position={[x, 0, 0.004]}>
                  <sphereGeometry args={[0.024, 16, 12]} />
                </mesh>
              ))}
            </group>
          )}
        </group>

        {cfg.pushBar ? (
          <group position={[0, bottom + 1.05, DEPTH * 0.35 + 0.05]}>
            <mesh material={mats.gold} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.018, 0.018, iw - 0.12, 16]} />
            </mesh>
            {[-1, 1].map((e) => (
              <mesh key={e} material={mats.gold} position={[e * (iw / 2 - 0.1), 0, -0.025]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.012, 0.012, 0.05, 12]} />
              </mesh>
            ))}
          </group>
        ) : (
          <group position={[freeX, handleY, DEPTH * 0.5]}>
            {cfg.grill && (
              <mesh material={mats.gold} position={[0, 0.13, -0.015]}>
                <boxGeometry args={[0.07, 0.17, 0.05]} />
              </mesh>
            )}
            <mesh material={mats.gold} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.016, 0.016, 0.07, 16]} />
            </mesh>
            <mesh material={mats.gold} position={[0, -0.09, 0.04]}>
              <capsuleGeometry args={[0.014, 0.2, 6, 12]} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
}

/** Semi-circular fanlight that sits on the frame head. */
function Fanlight({ r, mats }: { r: number; mats: Mats }) {
  return (
    <group>
      <mesh material={mats.frame}>
        <torusGeometry args={[r + FT / 2, FT * 0.45, 12, 48, Math.PI]} />
      </mesh>
      <mesh material={mats.glass}>
        <circleGeometry args={[r, 48, 0, Math.PI]} />
      </mesh>
      <mesh material={mats.trim}>
        <torusGeometry args={[r * 0.38, 0.014, 8, 32, Math.PI]} />
      </mesh>
      {[Math.PI / 4, Math.PI / 2, (Math.PI * 3) / 4].map((a) => (
        <mesh key={a} material={mats.trim} position={[(Math.cos(a) * r) / 2, (Math.sin(a) * r) / 2, 0]} rotation={[0, 0, a]}>
          <boxGeometry args={[r, 0.028, 0.05]} />
        </mesh>
      ))}
    </group>
  );
}

function DoorBody({ cfg, mats, open }: { cfg: DoorModel; mats: Mats; open: boolean }) {
  const sideL = cfg.sideL ?? 0;
  const sideR = cfg.sideR ?? 0;
  const transom = cfg.arch ? 0 : (cfg.transom ?? 0);
  const innerW = cfg.w + (sideL ? sideL + FT : 0) + (sideR ? sideR + FT : 0);
  const outerW = innerW + FT * 2;
  const topExtra = transom ? transom + FT : 0;
  const frameH = cfg.h + topExtra + FT * 2;
  const x0 = -innerW / 2;
  const doorX0 = x0 + (sideL ? sideL + FT : 0);
  const archR = cfg.arch ? cfg.w / 2 : 0;

  // Fit the whole model to the view regardless of its real size.
  const top = cfg.h + topExtra + FT + (cfg.arch ? archR + FT : 0);
  const bottomY = -FT - (cfg.sill ? 0.6 : 0.03);
  const totalH = top - bottomY;
  const figureW = cfg.figure ? 0.8 : 0;
  const s = 2.7 / Math.max(totalH, (outerW + figureW) * 0.72);
  const cy = (top + bottomY) / 2;
  const leafW = cfg.w / cfg.leaves;
  const sideCols = cfg.sideCols ?? 1;

  return (
    <>
      <group scale={s} position={[(figureW / 2) * s, -cy * s, 0]}>
        <RectFrame w={outerW} h={frameH} t={FT} d={DEPTH} material={mats.frame} position={[0, (cfg.h + topExtra) / 2, 0]} />

        {/* Fixed side panels and their mullions */}
        {sideL > 0 && (
          <>
            <group position={[x0 + sideL / 2, cfg.h / 2, 0]}>
              <Glazing w={sideL} h={cfg.h} rows={cfg.rows} cols={sideCols} glass={mats.glass} trim={mats.trim} />
            </group>
            <mesh material={mats.frame} position={[doorX0 - FT / 2, cfg.h / 2, 0]}>
              <boxGeometry args={[FT, cfg.h, DEPTH]} />
            </mesh>
          </>
        )}
        {sideR > 0 && (
          <>
            <group position={[doorX0 + cfg.w + FT + sideR / 2, cfg.h / 2, 0]}>
              <Glazing w={sideR} h={cfg.h} rows={cfg.rows} cols={sideCols} glass={mats.glass} trim={mats.trim} />
            </group>
            <mesh material={mats.frame} position={[doorX0 + cfg.w + FT / 2, cfg.h / 2, 0]}>
              <boxGeometry args={[FT, cfg.h, DEPTH]} />
            </mesh>
          </>
        )}

        {/* Transom */}
        {transom > 0 && (
          <>
            <mesh material={mats.frame} position={[0, cfg.h + FT / 2, 0]}>
              <boxGeometry args={[outerW, FT, DEPTH]} />
            </mesh>
            <group position={[0, cfg.h + FT + transom / 2, 0]}>
              <Glazing
                w={innerW}
                h={transom}
                rows={1}
                cols={cfg.transomCols ?? Math.max(2, Math.round(innerW / 0.55))}
                glass={mats.glass}
                trim={mats.trim}
              />
            </group>
          </>
        )}
        {cfg.arch && (
          <group position={[doorX0 + cfg.w / 2, cfg.h + FT, 0]}>
            <Fanlight r={archR} mats={mats} />
          </group>
        )}

        {/* Threshold, or sill and wall apron for a window */}
        {cfg.sill ? (
          <>
            <mesh material={mats.stone} position={[0, -FT - 0.03, 0.08]}>
              <boxGeometry args={[outerW + 0.3, 0.06, 0.34]} />
            </mesh>
            <mesh material={mats.wall} position={[0, -FT - 0.06 - 0.27, 0]}>
              <boxGeometry args={[outerW + 0.12, 0.54, 0.12]} />
            </mesh>
          </>
        ) : (
          <mesh material={mats.gold} position={[0, -FT - 0.0125, DEPTH * 0.2]}>
            <boxGeometry args={[outerW + 0.08, 0.025, DEPTH * 1.4]} />
          </mesh>
        )}

        <Leaf side={-1} pivotX={doorX0} w={leafW} cfg={cfg} mats={mats} open={open} />
        {cfg.leaves === 2 && <Leaf side={1} pivotX={doorX0 + cfg.w} w={leafW} cfg={cfg} mats={mats} open={open} />}

        {/* 1.7 m figure for scale */}
        {cfg.figure && (
          <group position={[-outerW / 2 - 0.45, -FT, 0.45]}>
            <mesh material={mats.figure} position={[0, 0.71, 0]}>
              <capsuleGeometry args={[0.17, 1.08, 6, 16]} />
            </mesh>
            <mesh material={mats.figure} position={[0, 1.57, 0]}>
              <sphereGeometry args={[0.13, 20, 16]} />
            </mesh>
          </group>
        )}
      </group>
      <ContactShadows position={[0, -(totalH / 2) * s - 0.02, 0]} opacity={0.5} blur={2.6} scale={10} far={3.5} color="#060e1f" />
    </>
  );
}

function Bench({ mats }: { mats: Mats }) {
  const L = 1.8;
  const s = 1.7;
  const lean = -0.14;
  return (
    <>
      <group scale={s} position={[0, -0.5 * s, 0]}>
        {/* Seat slats */}
        {[-0.19, -0.095, 0, 0.095, 0.19].map((z) => (
          <mesh key={z} material={mats.frame} position={[0, 0.45, z]}>
            <boxGeometry args={[L, 0.03, 0.078]} />
          </mesh>
        ))}
        {/* Back slats, leaning */}
        <group position={[0, 0, -0.27]} rotation={[lean, 0, 0]}>
          {[0.6, 0.71, 0.82, 0.93].map((y) => (
            <mesh key={y} material={mats.frame} position={[0, y, 0]}>
              <boxGeometry args={[L, 0.078, 0.026]} />
            </mesh>
          ))}
        </group>
        {/* Side frames */}
        {[-1, 1].map((side) => (
          <group key={side} position={[side * (L / 2 - 0.06), 0, 0]}>
            <mesh material={mats.trim} position={[0, 0.33, 0.24]}>
              <boxGeometry args={[0.05, 0.66, 0.05]} />
            </mesh>
            <group position={[0, 0, -0.27]} rotation={[lean, 0, 0]}>
              <mesh material={mats.trim} position={[0, 0.5, -0.035]}>
                <boxGeometry args={[0.05, 1.0, 0.05]} />
              </mesh>
            </group>
            <mesh material={mats.trim} position={[0, 0.675, -0.02]}>
              <boxGeometry args={[0.07, 0.035, 0.6]} />
            </mesh>
            <mesh material={mats.trim} position={[0, 0.41, 0]}>
              <boxGeometry args={[0.045, 0.05, 0.5]} />
            </mesh>
            <mesh material={mats.trim} position={[0, 0.12, 0]}>
              <boxGeometry args={[0.04, 0.04, 0.5]} />
            </mesh>
            <mesh material={mats.gold} position={[0, 0.675, 0.28]}>
              <sphereGeometry args={[0.034, 18, 14]} />
            </mesh>
          </group>
        ))}
        <mesh material={mats.trim} position={[0, 0.12, 0]}>
          <boxGeometry args={[L - 0.12, 0.035, 0.035]} />
        </mesh>
      </group>
      <ContactShadows position={[0, -0.5 * s - 0.01, 0]} opacity={0.5} blur={2.6} scale={10} far={3.5} color="#060e1f" />
    </>
  );
}

function Model({ slug, color, open }: { slug: string; color: string; open: boolean }) {
  const mats = useFinish(color);
  // Narrow (phone) stages see less width, so shrink the model to keep it inside the frame.
  const aspect = useThree((state) => state.size.width / state.size.height);
  const fit = Math.min(1, aspect / 1.25);
  const cfg = productModels[slug];
  if (!cfg) return null;
  return (
    <group scale={fit}>
      {cfg.kind === "bench" ? <Bench mats={mats} /> : <DoorBody cfg={cfg} mats={mats} open={open} />}
    </group>
  );
}

/** Interactive product model: drag to orbit, recolour and open from the page UI. */
export default function ProductScene({ slug, color, open }: { slug: string; color: string; open: boolean }) {
  const [auto, setAuto] = useState(true);
  const reduce = useReducedMotion();
  return (
    <SceneCanvas camera={{ position: [2.6, 0.5, 6.9], fov: 30 }} className="scene-pan-y cursor-grab active:cursor-grabbing">
      <Studio />
      <Model slug={slug} color={color} open={open} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={auto && !reduce}
        autoRotateSpeed={0.9}
        minPolarAngle={1.2}
        maxPolarAngle={1.62}
        onStart={() => setAuto(false)}
      />
    </SceneCanvas>
  );
}
