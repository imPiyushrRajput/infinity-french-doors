"use client";

import dynamic from "next/dynamic";
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useRef, useState, type CSSProperties } from "react";
import { CheckIcon } from "./Icons";
import { scrollToY } from "./motion/SmoothScroll";
import { useNear } from "./three/useNear";
import { HEADER, STEP_LANDING, STEP_SVH, STORY_SPRING, pinnedScrollTarget, useShortViewport } from "./usePinned";

const AssemblyScene = dynamic(() => import("./three/AssemblyScene"), { ssr: false });

const stages = [
  { title: "Frame", text: "Galvanised steel sections are CO₂ welded into a square outer frame and finished smooth." },
  { title: "Leaves", text: "Door leaves are built to the opening and hung true on the frame." },
  { title: "Glazing", text: "Glass is set into the window grid in the layout you chose." },
  { title: "Hardware", text: "Hinges, handles and SS concealed tower bolts go on last, then the door is tested." },
];

/**
 * Pinned scroll story: the section locks under the header while a French door
 * assembles itself in 3D, one stage per scroll step, then the page moves on.
 */
export default function DoorAssembly() {
  const ref = useRef<HTMLElement>(null);
  const near = useNear(ref);
  const [stage, setStage] = useState(0);
  const short = useShortViewport();
  const pinned = !short;

  // Pinned: 0 when the section reaches the header, 1 when the frame is released.
  // Unpinned fallback: 0 as it enters the viewport, 1 once its middle reaches mid-screen.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: pinned ? [`start ${HEADER}px`, "end end"] : ["start 90%", "center 45%"],
  });
  const progress = useSpring(scrollYProgress, STORY_SPRING);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const i = Math.min(stages.length - 1, Math.max(0, Math.floor(p * stages.length)));
    setStage((s) => (s === i ? s : i));
  });

  const goTo = (i: number) => {
    if (!ref.current || !pinned) return;
    scrollToY(pinnedScrollTarget(ref.current, (i + STEP_LANDING) / stages.length));
  };

  return (
    <section
      ref={ref}
      className="pin-track relative bg-navy-950 text-white"
      style={{ "--pin-scroll": `${stages.length * STEP_SVH}svh` } as CSSProperties}
      aria-labelledby="assembly-title"
    >
      <div className="pin-frame overflow-hidden">
        <div className="grid-pattern absolute inset-0 opacity-50" />
        <div className="pointer-events-none absolute -right-24 top-1/4 h-[420px] w-[420px] rounded-full bg-gold-500/10 blur-3xl" />

        <div className="container-x relative flex h-full flex-col justify-center gap-4 py-4 sm:gap-6 lg:grid lg:grid-cols-12 lg:grid-rows-[auto_auto] lg:content-center lg:gap-x-14 lg:gap-y-6 lg:py-8">
          {/* Heading */}
          <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:self-end">
            <div className="eyebrow eyebrow-light">How it comes together</div>
            <h2 id="assembly-title" className="h-display mt-2 text-3xl text-white sm:text-4xl lg:mt-3 lg:text-5xl">
              From steel section to finished <span className="italic text-gold-400">doorway</span>
            </h2>
            <p className="mt-3 hidden max-w-md text-white/60 lg:block">
              Keep scrolling and watch a French door build itself, in the order it happens on our shop floor.
            </p>
          </div>

          {/* 3D stage */}
          <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:self-center">
            <div className="relative h-[30svh] min-h-[190px] overflow-hidden rounded-[1.75rem] bg-white/[0.03] ring-1 ring-white/10 sm:h-[42svh] lg:h-[min(70svh,600px)] lg:rounded-[2rem]">
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400/30 blur-[90px]" />
              <div
                className="absolute inset-0"
                role="img"
                aria-label="3D animation of a French door being assembled: frame, leaves, glazing, then hardware"
              >
                {near && <AssemblyScene progress={progress} />}
              </div>
              <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-4 lg:px-6 lg:pt-5">
                <div className="flex items-center gap-2" role="tablist" aria-label="Assembly stages">
                  {stages.map((s, i) => (
                    <button
                      key={s.title}
                      type="button"
                      role="tab"
                      aria-selected={i === stage}
                      onClick={() => goTo(i)}
                      aria-label={s.title}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        i === stage ? "w-8 bg-gold-400" : i < stage ? "w-3 bg-gold-400/50" : "w-2 bg-white/25 hover:bg-white/50"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-400 sm:text-[11px]">
                    {stages[stage].title}
                  </span>
                  <span className="font-display text-sm italic text-white/50 tabular-nums">
                    {String(stage + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-x-5 bottom-4 h-1 overflow-hidden rounded-full bg-white/10">
                <motion.div className="h-full origin-left bg-gold-400" style={{ scaleX: progress }} />
              </div>
            </div>
          </div>

          {/* Stages: revealed one by one */}
          <ol className="relative lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:self-start">
            {stages.map((s, i) => {
              const reached = !pinned || i <= stage;
              const open = !pinned || i === stage;
              const done = pinned && i < stage;
              return (
                <motion.li
                  key={s.title}
                  initial={false}
                  animate={{ opacity: reached ? 1 : 0, y: reached ? 0 : 24 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative ${pinned && !open ? "max-lg:sr-only" : ""} ${reached ? "" : "pointer-events-none"}`}
                >
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    className="group flex w-full items-center gap-4 py-1.5 text-left lg:py-2"
                    aria-current={open && pinned ? "step" : undefined}
                  >
                    <span
                      className={`relative z-10 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-base italic transition-all duration-500 ${
                        open
                          ? "bg-gold-400 text-navy-950 shadow-[0_0_0_6px_rgb(220_184_102_/_0.18)]"
                          : done
                            ? "bg-white/10 text-gold-400 ring-1 ring-gold-400/50"
                            : "bg-white/5 text-white/40 ring-1 ring-white/10"
                      }`}
                    >
                      {done ? <CheckIcon className="h-4 w-4" /> : String(i + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className={`font-display font-medium leading-tight transition-all duration-500 ${
                        open ? "text-2xl text-gold-400 sm:text-3xl" : "text-lg text-white/60 group-hover:text-white"
                      }`}
                    >
                      {s.title}
                    </h3>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden pl-[3.25rem]"
                  >
                    <p className="pb-3 pt-1 text-sm leading-relaxed text-white/65 sm:text-base lg:pb-4">{s.text}</p>
                  </motion.div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
