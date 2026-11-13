"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { aboutPage } from "@/data/site";
import { scrollToY } from "./motion/SmoothScroll";
import { HEADER, STEP_SVH, STORY_SPRING, pinnedScrollTarget, useShortViewport } from "./usePinned";

const { timeline } = aboutPage;
const items = timeline.items;

/**
 * 2.5 Timeline as a pinned horizontal story: the section locks under the
 * header and scrolling down slides the years sideways, one milestone at a
 * time, then the page moves on. Very short screens get a swipeable row.
 */
export default function Timeline() {
  const ref = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);
  const short = useShortViewport();
  const pinned = !short;

  // How far the row has to travel so the last card ends where the first began.
  useEffect(() => {
    const vp = viewport.current;
    const tr = track.current;
    if (!vp || !tr) return;
    const measure = () => setDistance(Math.max(0, tr.scrollWidth - tr.clientWidth));
    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    ro.observe(tr);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: [`start ${HEADER}px`, "end end"] });
  const progress = useSpring(scrollYProgress, STORY_SPRING);
  const x = useTransform(progress, (p) => (pinned ? -p * distance : 0));
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const i = Math.min(items.length - 1, Math.max(0, Math.round(p * (items.length - 1))));
    setActive((a) => (a === i ? a : i));
  });

  const goTo = (i: number) => {
    if (!ref.current || !pinned) return;
    scrollToY(pinnedScrollTarget(ref.current, i / (items.length - 1)));
  };

  return (
    <section
      ref={ref}
      className="pin-track relative bg-cream-100"
      style={{ "--pin-scroll": `${(items.length - 1) * STEP_SVH}svh` } as CSSProperties}
      aria-labelledby="timeline-title"
    >
      <div className="pin-frame overflow-hidden">
        {/* Big year behind everything */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-end overflow-hidden pr-4 lg:pr-10" aria-hidden>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={items[active].year}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -60 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="block select-none font-display text-[32vw] font-semibold leading-[0.75] tracking-tight text-navy-950/[0.05] lg:text-[22rem]"
            >
              {items[active].year}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="relative flex h-full flex-col justify-center gap-6 py-6 lg:gap-10">
          <div className="container-x">
            <div className="eyebrow">{timeline.eyebrow}</div>
            <h2 id="timeline-title" className="h-display mt-3 max-w-3xl text-3xl text-navy-950 sm:text-4xl lg:text-5xl">
              The remarkable journey of Infinity French Doors: from inception to <span className="italic text-gold-600">excellence</span>
            </h2>
          </div>

          {/* Year rail */}
          <div className="container-x">
            <div className="relative flex items-center justify-between">
              <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-navy-950/10" aria-hidden />
              <motion.span
                className="absolute left-0 right-0 top-1/2 h-px origin-left -translate-y-1/2 bg-gold-500"
                style={{ scaleX: pinned ? progress : 1 }}
                aria-hidden
              />
              {items.map((t, i) => (
                <button
                  key={t.year}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={i === active ? "step" : undefined}
                  className={`relative z-10 rounded-full px-3 py-1.5 font-display text-sm font-medium transition-all duration-500 sm:px-4 sm:text-base ${
                    i <= active || !pinned
                      ? "bg-navy-950 text-gold-400 shadow-soft"
                      : "bg-cream-100 text-ink-500 ring-1 ring-navy-950/15 hover:text-navy-950"
                  } ${i === active && pinned ? "scale-110" : ""}`}
                >
                  {t.year}
                </button>
              ))}
            </div>
          </div>

          {/* Sliding cards */}
          <div ref={viewport} className={pinned ? "overflow-visible" : "overflow-x-auto [scrollbar-width:none]"}>
            <motion.ol ref={track} style={{ x }} className="container-x flex gap-5 lg:gap-8">
              {items.map((t, i) => {
                const on = !pinned || i === active;
                return (
                  <li
                    key={t.year}
                    className={`w-[min(82vw,500px)] shrink-0 rounded-[1.75rem] p-6 transition-all duration-700 sm:p-8 ${
                      on ? "bg-navy-950 text-white shadow-soft" : "bg-white text-navy-950 opacity-60 ring-1 ring-navy-950/5"
                    }`}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className={`font-display text-5xl font-medium leading-none sm:text-6xl ${on ? "text-gold-400" : "text-navy-950/30"}`}>
                        {t.year}
                      </span>
                      <span className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${on ? "text-white/50" : "text-ink-500"}`}>
                        Chapter {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-2xl font-medium leading-tight">{t.title}</h3>
                    <p className={`mt-3 text-sm leading-relaxed ${on ? "text-white/70" : "text-ink-500"}`}>{t.text}</p>
                  </li>
                );
              })}
              {/* Spacer so the last card can travel to the left edge */}
              <li aria-hidden className="w-px shrink-0" />
            </motion.ol>
          </div>
        </div>
      </div>
    </section>
  );
}
