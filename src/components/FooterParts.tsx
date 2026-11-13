"use client";

import { useRef, type PointerEvent } from "react";

/**
 * Giant INFINITY wordmark. A gold spotlight sweeps across the outlined letters
 * on its own and follows the pointer while it is over the word.
 */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--wm-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--wm-y", `${e.clientY - r.top}px`);
    el.dataset.hover = "";
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.removeProperty("--wm-x");
    el.style.removeProperty("--wm-y");
    delete el.dataset.hover;
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="footer-wordmark relative select-none overflow-hidden"
      aria-hidden
    >
      <span className="text-outline block text-center font-display text-[24vw] font-semibold leading-[0.8] tracking-[-0.04em] lg:text-[21vw] 2xl:text-[19rem]">
        INFINITY
      </span>
      <span className="footer-wordmark-fill absolute inset-0 block text-center font-display text-[24vw] font-semibold leading-[0.8] tracking-[-0.04em] lg:text-[21vw] 2xl:text-[19rem]">
        INFINITY
      </span>
    </div>
  );
}
