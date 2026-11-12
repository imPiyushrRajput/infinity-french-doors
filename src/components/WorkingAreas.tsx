"use client";

import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { clientLogos } from "@/data/site";
import { Lightbox, useLightbox } from "./Lightbox";
import { SectionHeading } from "./Shared";

type Node = { id: string; name: string; x: number; y: number; hub?: "plant"; tag: string };

const nodes: Node[] = [
  { id: "nashik", name: "Nashik", x: 430, y: 330, hub: "plant", tag: "Plant 1 · HQ" },
  { id: "jalgaon", name: "Jalgaon", x: 590, y: 215, hub: "plant", tag: "Plant 2" },
  { id: "mumbai", name: "Mumbai", x: 290, y: 425, tag: "170 km from Nashik" },
  { id: "pune", name: "Pune", x: 405, y: 480, tag: "210 km from Nashik" },
  { id: "sambhajinagar", name: "Chhatrapati Sambhajinagar", x: 548, y: 345, tag: "180 km from Nashik" },
  { id: "indore", name: "Indore", x: 600, y: 75, tag: "250 km from Jalgaon" },
  { id: "vadodara", name: "Vadodara", x: 325, y: 170, tag: "360 km from Nashik" },
  { id: "ahmedabad", name: "Ahmedabad", x: 235, y: 85, tag: "470 km from Nashik" },
];

const routes: [string, string][] = [
  ["nashik", "mumbai"],
  ["nashik", "pune"],
  ["nashik", "sambhajinagar"],
  ["nashik", "vadodara"],
  ["vadodara", "ahmedabad"],
  ["nashik", "jalgaon"],
  ["jalgaon", "indore"],
  ["jalgaon", "sambhajinagar"],
];

const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

function curve(a: Node, b: Node) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  // Perpendicular bulge for a gentle arc
  const cx = mx - (dy / len) * len * 0.18;
  const cy = my + (dx / len) * len * 0.18;
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

export default function WorkingAreas() {
  const [active, setActive] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const logos = clientLogos.map((src, i) => ({ src, alt: `Client ${i + 1}` }));
  const lb = useLightbox(logos);

  const isLit = (id: string) => !active || active === id || routes.some(([a, b]) => (a === active && b === id) || (b === active && a === id));

  return (
    <section className="relative overflow-hidden bg-navy-950 py-16 text-white lg:py-24">
      <div className="grid-pattern absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-[480px] w-[480px] rounded-full bg-brand-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-[380px] w-[380px] rounded-full bg-gold-500/10 blur-3xl" />

      <div className="container-x relative grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Successful Projects"
            title="Working areas of Infinity French Doors"
            accent={["infinity", "french", "doors"]}
            text="Two plants in the centre of Maharashtra put every major western city within a day's dispatch. Hover a city to trace its route."
            light
          />
          <ul className="mt-8 flex flex-wrap gap-2" onMouseLeave={() => setActive(null)}>
            {nodes.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(n.id)}
                  onFocus={() => setActive(n.id)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive(active === n.id ? null : n.id)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
                    active === n.id
                      ? "border-gold-400 bg-gold-400 text-navy-950"
                      : n.hub
                        ? "border-gold-400/50 text-gold-300 hover:bg-gold-400/10"
                        : "border-white/15 text-white/70 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {n.hub && <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current align-middle" />}
                  {n.name}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
            {[
              ["2", "Plants"],
              ["14+", "Experience centers"],
              ["8", "Major cities"],
            ].map(([v, l]) => (
              <div key={l}>
                <div className="font-display text-3xl font-medium text-gold-400">{v}</div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div ref={ref} className="relative lg:col-span-7">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-2 backdrop-blur-sm">
            <svg viewBox="0 0 800 560" className="h-auto w-full" role="img" aria-label="Distribution network from Nashik and Jalgaon to Mumbai, Pune, Chhatrapati Sambhajinagar, Indore, Vadodara and Ahmedabad">
              <defs>
                <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.12)" />
                </pattern>
                <radialGradient id="hubGlow">
                  <stop offset="0%" stopColor="#dcb866" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#dcb866" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="routeGrad" x1="0" x2="1">
                  <stop offset="0%" stopColor="#dcb866" />
                  <stop offset="100%" stopColor="#4a8fdc" />
                </linearGradient>
              </defs>
              <rect width="800" height="560" fill="url(#dots)" />

              {/* soft landmass blob */}
              <path
                d="M190 60 C 320 20, 560 10, 660 90 C 720 150, 700 300, 640 380 C 590 450, 500 530, 400 530 C 300 530, 230 470, 220 380 C 210 300, 150 170, 190 60 Z"
                fill="rgba(255,255,255,0.025)"
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray="4 6"
              />

              {/* routes */}
              {routes.map(([a, b], i) => {
                const d = curve(byId[a], byId[b]);
                const lit = !active || active === a || active === b;
                return (
                  <g key={`${a}-${b}`} opacity={lit ? 1 : 0.18} style={{ transition: "opacity .4s" }}>
                    <motion.path
                      id={`route-${i}`}
                      d={d}
                      fill="none"
                      stroke="url(#routeGrad)"
                      strokeWidth={lit && active ? 2.2 : 1.4}
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                      transition={{ duration: 1.4, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    />
                    {inView && (
                      <circle r={3.2} fill="#fff">
                        <animateMotion dur={`${3.2 + (i % 3) * 0.8}s`} begin={`${i * 0.4}s`} repeatCount="indefinite">
                          <mpath href={`#route-${i}`} />
                        </animateMotion>
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* nodes */}
              {nodes.map((n, i) => {
                const on = active === n.id;
                const lit = isLit(n.id);
                return (
                  <motion.g
                    key={n.id}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={inView ? { opacity: lit ? 1 : 0.3, scale: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 + i * 0.08 }}
                    style={{ transformOrigin: `${n.x}px ${n.y}px`, cursor: "pointer" }}
                    onMouseEnter={() => setActive(n.id)}
                    onMouseLeave={() => setActive(null)}
                  >
                    {n.hub && (
                      <>
                        <circle cx={n.x} cy={n.y} r={46} fill="url(#hubGlow)" />
                        <circle cx={n.x} cy={n.y} r={14} fill="none" stroke="#dcb866" strokeOpacity="0.5">
                          <animate attributeName="r" values="12;30" dur="2.4s" repeatCount="indefinite" />
                          <animate attributeName="stroke-opacity" values="0.6;0" dur="2.4s" repeatCount="indefinite" />
                        </circle>
                      </>
                    )}
                    <circle cx={n.x} cy={n.y} r={on ? 10 : n.hub ? 8 : 5.5} fill={n.hub ? "#dcb866" : on ? "#fff" : "#4a8fdc"} stroke="#060e1f" strokeWidth="2" style={{ transition: "r .3s" }} />
                    <text
                      x={n.x + (n.x > 520 ? -14 : 14)}
                      y={n.y + (n.y < 120 ? 28 : -14)}
                      textAnchor={n.x > 520 ? "end" : "start"}
                      className="font-sans"
                      fontSize={on ? 15 : 13}
                      fontWeight={n.hub || on ? 700 : 500}
                      fill={n.hub ? "#dcb866" : "rgba(255,255,255,0.85)"}
                    >
                      {n.name}
                    </text>
                    {on && (
                      <g>
                        <rect
                          x={n.x + (n.x > 520 ? -150 : 14)}
                          y={n.y + (n.y < 120 ? 34 : 4)}
                          width="136"
                          height="24"
                          rx="12"
                          fill="#dcb866"
                        />
                        <text
                          x={n.x + (n.x > 520 ? -82 : 82)}
                          y={n.y + (n.y < 120 ? 50 : 20)}
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="700"
                          fill="#060e1f"
                        >
                          {n.tag}
                        </text>
                      </g>
                    )}
                  </motion.g>
                );
              })}
            </svg>
            <div className="pointer-events-none absolute bottom-4 left-5 flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-gold-400" /> Plant
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-brand-400" /> Served city
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Clients */}
      <div className="container-x relative mt-14">
        <div className="flex items-center gap-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/50">Trusted by</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {logos.map((l, i) => (
            <li key={l.src}>
              <button
                type="button"
                onClick={() => lb.open(i)}
                aria-label={`View ${l.alt}`}
                className="group flex h-20 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/90 p-3 transition-all duration-500 hover:-translate-y-1 hover:border-gold-400 hover:bg-white"
              >
                <Image
                  src={l.src}
                  alt={l.alt}
                  width={160}
                  height={70}
                  className="max-h-12 w-auto object-contain grayscale transition-all duration-500 group-hover:grayscale-0"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <Lightbox items={logos} index={lb.index} onClose={lb.close} onPrev={lb.prev} onNext={lb.next} />
    </section>
  );
}
