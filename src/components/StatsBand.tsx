"use client";

import { animate, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { IMG, stats } from "@/data/site";
import { ParallaxImage } from "./motion/Parallax";

const EASE = [0.16, 1, 0.3, 1] as const;
const DURATION = 1.8;
const fmt = (n: number) => n.toLocaleString("en-IN");

/** One count drives both the outline and the gold fill, so their digits always match. */
function StatNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: DURATION,
      ease: [0.33, 1, 0.68, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  const text = `${fmt(n)}${suffix}`;
  return (
    <span ref={ref} className="relative block tabular-nums">
      {/* Reserves the final width so nothing shifts while counting */}
      <span className="invisible block" aria-hidden>
        {fmt(value)}
        {suffix}
      </span>
      <span className="sr-only">
        {fmt(value)}
        {suffix}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block [-webkit-text-stroke:1.5px_rgb(220_184_102_/_0.55)] [color:transparent]"
      >
        {text}
      </span>
      <motion.span
        aria-hidden
        className="absolute inset-0 block bg-gradient-to-t from-gold-500 to-gold-300 bg-clip-text [color:transparent]"
        initial={{ clipPath: "inset(100% 0 0 0)" }}
        animate={inView ? { clipPath: "inset(0% 0 0 0)" } : undefined}
        transition={{ duration: DURATION + 0.4, delay: 0.15, ease: EASE }}
      >
        {text}
      </motion.span>
    </span>
  );
}

/**
 * 1.8 Stats: oversized outlined numbers that fill with gold from the bottom as
 * they count up, laid out as a staggered two-column strip.
 */
export default function StatsBand() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 pb-20 pt-20 text-white sm:pb-32 lg:pb-40 lg:pt-28" aria-label="Infinity in numbers">
      <ParallaxImage src={`${IMG}resources/bannersog.png`} alt="" className="absolute inset-0" imgClassName="opacity-20" strength={22} />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950/80 to-navy-950" />

      <div className="container-x relative">
        <div className="eyebrow eyebrow-light">In numbers</div>
        <dl className="mt-8 grid gap-x-16 sm:grid-cols-2 lg:mt-10">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`group border-t border-white/10 py-8 sm:py-10 ${i % 2 === 1 ? "sm:translate-y-16 lg:translate-y-24" : ""}`}
            >
              <dt className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/60">
                <span className="font-display text-sm normal-case italic tracking-normal text-gold-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.label}
              </dt>
              <dd className="relative mt-3 font-display text-[clamp(3.2rem,8vw,7rem)] font-semibold leading-[0.9] tracking-tight">
                <StatNumber value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
