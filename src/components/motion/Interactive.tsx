"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Card that tilts toward the cursor in 3D and exposes --mx/--my for a spotlight.
 */
export function TiltCard({
  children,
  className = "",
  max = 8,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 180, damping: 18, mass: 0.4 });
  const ry = useSpring(0, { stiffness: 180, damping: 18, mass: 0.4 });
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const spot = useMotionTemplate`${mx}% ${my}%`;
  const glareBg = useMotionTemplate`radial-gradient(600px circle at ${spot}, rgb(255 255 255 / 0.14), transparent 40%)`;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    mx.set(px * 100);
    my.set(py * 100);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div className="perspective-1200 h-full">
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className={`spotlight will-change-transform ${className}`}
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden
            style={{ background: glareBg }}
            className="pointer-events-none absolute inset-0 z-[2] rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
      </motion.div>
    </div>
  );
}

/** Wrapper that pulls its child gently toward the cursor. */
export function Magnetic({
  children,
  className = "",
  strength = 0.35,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 160, damping: 15, mass: 0.3 });
  const y = useSpring(0, { stiffness: 160, damping: 15, mass: 0.3 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x, y }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

/** Endless horizontal ticker of text items. */
export function TextMarquee({
  items,
  className = "",
  slow = false,
  light = false,
}: {
  items: string[];
  className?: string;
  slow?: boolean;
  light?: boolean;
}) {
  const row = [...items, ...items];
  return (
    <div className={`mask-fade-x overflow-hidden ${className}`}>
      <div
        className={`flex w-max items-center gap-10 whitespace-nowrap ${
          slow ? "animate-marquee-slow" : "animate-marquee"
        } hover:[animation-play-state:paused]`}
      >
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            <span
              className={`font-display text-3xl font-medium italic sm:text-4xl ${
                light ? "text-white/80" : "text-navy-950"
              }`}
            >
              {t}
            </span>
            <span className={`h-2 w-2 rotate-45 ${light ? "bg-gold-400" : "bg-gold-500"}`} />
          </span>
        ))}
      </div>
    </div>
  );
}
