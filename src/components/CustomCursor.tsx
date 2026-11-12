"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useState } from "react";

const INTERACTIVE = 'a[href], button, [role="button"], [role="tab"], summary, input, textarea, select, label[for], [data-cursor]';

/**
 * A soft ring that trails the pointer and reacts to interactive elements.
 * Desktop pointers only (pointer: fine), skipped for reduced-motion users.
 * The native cursor stays visible so nothing depends on JavaScript.
 */
export default function CustomCursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<{ hover: boolean; label: string; down: boolean }>({ hover: false, label: "", down: false });

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.5 });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const sync = () => setEnabled(mq.matches && !reduce);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reduce]);

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as Element | null)?.closest?.(INTERACTIVE) as HTMLElement | null;
      const label = el?.dataset.cursor ?? "";
      setState((s) => (s.hover === !!el && s.label === label ? s : { ...s, hover: !!el, label }));
    };
    const down = () => setState((s) => ({ ...s, down: true }));
    const up = () => setState((s) => ({ ...s, down: false }));
    const leave = () => {
      x.set(-100);
      y.set(-100);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = state.label ? 72 : state.hover ? 52 : 36;
  return (
    <div className="pointer-events-none fixed inset-0 z-[90] print:hidden" aria-hidden>
      {/* dot */}
      <motion.div
        className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400"
        style={{ x, y }}
      />
      {/* ring */}
      <motion.div
        className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold-400/70 text-[9px] font-bold uppercase tracking-[0.2em] text-navy-950 mix-blend-difference"
        style={{ x: ringX, y: ringY }}
        animate={{
          width: size,
          height: size,
          scale: state.down ? 0.85 : 1,
          backgroundColor: state.label ? "rgba(220,184,102,1)" : state.hover ? "rgba(220,184,102,0.18)" : "rgba(220,184,102,0)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        {state.label && <span className="text-navy-950 mix-blend-normal">{state.label}</span>}
      </motion.div>
    </div>
  );
}
