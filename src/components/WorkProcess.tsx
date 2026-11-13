"use client";

import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { aboutPage } from "@/data/site";
import { CheckIcon } from "./Icons";
import { SectionHeading } from "./Shared";
import { STORY_SPRING } from "./usePinned";

const { process } = aboutPage;
const steps = process.steps;

/**
 * 2.8 Work process as a path: a gold line draws itself down the page as you
 * scroll, and each numbered step lights up when the line reaches it. Steps
 * alternate sides on desktop and sit to the right of the line on phones.
 * It does not pin, so it never stacks a second locked section after the
 * door assembly story above it.
 */
export default function WorkProcess() {
  const list = useRef<HTMLOListElement>(null);
  const [reached, setReached] = useState(-1);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 65%", "end 55%"] });
  const line = useSpring(scrollYProgress, STORY_SPRING);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    // Step i sits at roughly (i + 0.5) / n along the line.
    const r = Math.floor(p * steps.length + 0.35) - 1;
    const next = Math.min(steps.length - 1, Math.max(-1, r));
    setReached((v) => (v === next ? v : next));
  });

  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      <div className="container-x">
        <SectionHeading eyebrow={process.eyebrow} title="Our Work Process" accent={["process"]} align="center" />

        <ol ref={list} className="relative mx-auto mt-16 max-w-5xl lg:mt-20">
          {/* The path */}
          <span className="absolute bottom-0 left-[22px] top-0 w-px bg-navy-950/10 lg:left-1/2" aria-hidden />
          <motion.span
            className="absolute bottom-0 left-[22px] top-0 w-[2px] origin-top -translate-x-[0.5px] bg-gradient-to-b from-gold-400 to-gold-600 lg:left-1/2"
            style={{ scaleY: line }}
            aria-hidden
          />

          {steps.map((s, i) => {
            const on = i <= reached;
            const right = i % 2 === 1;
            return (
              <li key={s.title} className="relative grid pb-12 last:pb-0 lg:grid-cols-2 lg:gap-16 lg:pb-16">
                {/* Node on the line */}
                <span
                  className={`absolute left-0 top-0 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full font-display text-base font-medium transition-all duration-500 lg:left-1/2 lg:-translate-x-1/2 ${
                    on
                      ? "bg-gold-500 text-navy-950 shadow-[0_0_0_8px_rgb(220_184_102_/_0.18)]"
                      : "bg-white text-ink-500 ring-1 ring-navy-950/15"
                  }`}
                >
                  {on ? <CheckIcon className="h-4 w-4" /> : String(i + 1).padStart(2, "0")}
                </span>

                <motion.div
                  initial={false}
                  animate={{ opacity: on ? 1 : 0.45, x: on ? 0 : right ? 16 : -16 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={`pl-16 lg:pl-0 ${right ? "lg:col-start-2" : "lg:col-start-1 lg:text-right"}`}
                >
                  <div
                    className={`rounded-[1.5rem] p-6 transition-colors duration-500 sm:p-7 ${
                      on ? "bg-white shadow-soft ring-1 ring-gold-400/40" : "bg-transparent ring-1 ring-navy-950/10"
                    }`}
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-gold-600">
                      Step {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 font-display text-2xl font-medium text-navy-950">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-500">{s.text}</p>
                  </div>
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
