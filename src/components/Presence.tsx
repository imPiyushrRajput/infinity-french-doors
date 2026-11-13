"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { business, directionsUrl, networkStats, presenceMap } from "@/data/site";
import Counter from "./Counter";
import { ArrowRight, EyeIcon, PhoneIcon, PinIcon } from "./Icons";
import { Lightbox, useLightbox } from "./Lightbox";
import { Reveal } from "./motion/Reveal";
import { SectionHeading } from "./Shared";
import { useNear } from "./three/useNear";

const PresenceScene = dynamic(() => import("./three/PresenceScene"), { ssr: false });

const plants = business.plants.map((p, i) => ({ ...p, label: `${p.city} · Plant ${i + 1}` }));
const centers = networkStats.find((s) => /experience/i.test(s.label))?.value ?? 14;
const mapItems = [{ src: presenceMap, alt: "Map of Infinity French Doors locations" }];

/**
 * 1.14 Presence map + 1.15 network stats. An abstract 3D "orbit": the two
 * plants stand at the centre while a ring of experience-center portals circles
 * them. Choosing a plant (tabs or the door itself) brings up its address,
 * directions and phone. The original location map opens from "Full map".
 */
export default function Presence() {
  const ref = useRef<HTMLElement>(null);
  const near = useNear(ref);
  const [active, setActive] = useState(0);
  const lb = useLightbox(mapItems);
  const plant = plants[active];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-navy-950 py-20 text-white lg:py-28"
      aria-label="Our presence across key locations"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,rgb(21_87_168_/_0.28),transparent_60%)]" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[420px] w-[420px] rounded-full bg-gold-500/10 blur-3xl" />

      <div className="container-x relative grid gap-8 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-8">
        {/* Heading + stats */}
        <div className="lg:col-span-5 lg:row-start-1">
          <SectionHeading
            eyebrow="Widespread Network"
            title="Our Presence Across Key Locations"
            accent={["key", "locations"]}
            text="Two manufacturing plants and a growing network of experience centers put Infinity within reach across Maharashtra and neighbouring states."
            light
          />
          <Reveal delay={0.2}>
            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10">
              {networkStats.map((s) => (
                <div key={s.label} className="bg-navy-950/90 p-5 sm:p-6">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">{s.label}</dt>
                  <dd className="mt-2 font-display text-5xl font-medium leading-none text-gold-400 sm:text-6xl">
                    <Counter value={s.value} suffix={s.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* 3D orbit stage */}
        <Reveal delay={0.1} className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:self-center">
          <div className="relative h-[360px] overflow-hidden rounded-[2rem] bg-gradient-to-b from-white/[0.06] to-transparent ring-1 ring-white/10 sm:h-[460px] lg:h-[620px]">
            <div
              className="absolute inset-0"
              role="img"
              aria-label={`3D illustration: ${plants.length} manufacturing plants at the centre, circled by ${centers} experience centers`}
            >
              {near && <PresenceScene plants={plants} centers={centers} active={active} onSelect={setActive} />}
            </div>
            <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-3 p-4 sm:p-6">
              <ul className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70 sm:text-[11px]">
                <li className="inline-flex items-center gap-2 rounded-full bg-navy-950/60 px-3 py-1.5 ring-1 ring-white/10 backdrop-blur-sm">
                  <span className="h-2 w-2 rounded-sm bg-gold-400 shadow-[0_0_10px_rgb(212_173_87)]" /> Manufacturing plant
                </li>
                <li className="inline-flex items-center gap-2 rounded-full bg-navy-950/60 px-3 py-1.5 ring-1 ring-white/10 backdrop-blur-sm">
                  <span className="h-2 w-2 rounded-sm bg-[#5f9bff]" /> Experience center
                </li>
              </ul>
              <button
                type="button"
                onClick={() => lb.open(0)}
                className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white ring-1 ring-white/15 backdrop-blur-sm transition-colors duration-300 hover:bg-gold-400 hover:text-navy-950"
              >
                <EyeIcon className="h-4 w-4" /> Full map
              </button>
            </div>
            <p className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40 sm:bottom-6">
              Tap a plant to visit
            </p>
          </div>
        </Reveal>

        {/* Plant card */}
        <Reveal delay={0.25} className="lg:col-span-5 lg:row-start-2 lg:self-start">
          <div className="rounded-[1.5rem] bg-white/[0.04] p-5 ring-1 ring-white/10 sm:p-6">
            <div role="tablist" aria-label="Manufacturing plants" className="grid grid-cols-2 rounded-full bg-white/5 p-1 ring-1 ring-white/10">
              {plants.map((p, i) => (
                <button
                  key={p.name}
                  type="button"
                  role="tab"
                  id={`plant-tab-${i}`}
                  aria-selected={i === active}
                  aria-controls="plant-panel"
                  onClick={() => setActive(i)}
                  className={`relative rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-300 ${
                    i === active ? "text-navy-950" : "text-white/60 hover:text-white"
                  }`}
                >
                  {i === active && (
                    <motion.span
                      layoutId="plant-pill"
                      className="absolute inset-0 rounded-full bg-gold-400"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{p.city}</span>
                </button>
              ))}
            </div>

            <div id="plant-panel" role="tabpanel" aria-labelledby={`plant-tab-${active}`} className="mt-5 min-h-[160px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={plant.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-400">{plant.name}</div>
                  <p className="mt-2 flex gap-2.5 text-sm leading-relaxed text-white/75">
                    <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                    {plant.address}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <a href={directionsUrl(plant.address)} target="_blank" rel="noreferrer" className="btn-gold !px-5 !py-2.5 !text-[11px]">
                      Directions <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                    <a href={business.phones[0].href} className="btn-outline-light !px-5 !py-2.5 !text-[11px]">
                      <PhoneIcon className="h-3.5 w-3.5" /> {business.phones[0].label}
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>

      <Lightbox items={mapItems} index={lb.index} onClose={lb.close} onPrev={lb.prev} onNext={lb.next} />
    </section>
  );
}
