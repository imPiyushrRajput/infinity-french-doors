"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useRef, useState, useSyncExternalStore } from "react";
import { CheckIcon } from "./Icons";
import { scrollToY } from "./motion/SmoothScroll";

const FeatureScene = dynamic(() => import("./three/FeatureScene"), {
  ssr: false,
  loading: () => <div className="h-full w-full" />,
});

/** Height of the sticky header once the page is scrolled (76px nav + 1px border). */
const HEADER = 77;

const steps = [
  {
    title: "Premium Quality Materials",
    text: "High-grade raw materials and advanced manufacturing techniques ensure durability and long-lasting performance.",
    caption: "Coating stack",
    specs: ["Galvanised sheet from Tata, Jindal & Pasco", "Pure polyester powder coating", "SS concealed tower bolts & safety knobs"],
    legend: ["Galvanised steel sheet", "Zinc layer", "Primer", "Polyester powder coat"],
  },
  {
    title: "Customization Options",
    text: "Tailored solutions for specific requirements, including size, design, and functionality.",
    caption: "Glazing configurator",
    specs: ["1, 2, 3 or 4 window placements per door", "Any opening size, combination or XXL", "Designer, safety or commercial grades"],
    legend: ["2 × 4 panes", "3 × 3 panes", "1 × 6 panes", "2 × 2 panes"],
  },
  {
    title: "Focus on Durability",
    text: "Every product is robust and built to withstand varied environmental conditions year after year.",
    caption: "Weather test",
    specs: ["Maintenance free: no rust, no repainting", "Non-combustible galvanised iron", "CO₂ welded bright bars, finished smooth"],
    legend: ["Rain & humidity", "Sun & heat", "Dust & salt air", "Decades of use"],
  },
  {
    title: "Timely Delivery",
    text: "Prompt and reliable delivery to meet customer timelines, from our plants in Nashik and Jalgaon.",
    caption: "On the road",
    specs: ["Two manufacturing plants, central Maharashtra", "Mumbai, Pune, Indore, Ahmedabad & more", "Fitted before tiling: no track needed"],
    legend: ["Nashik plant", "Jalgaon plant", "14+ experience centers", "Pan-India dispatch"],
  },
];

/* Very short viewports (landscape phones) cannot fit the pinned layout; they get a normal stacked section. */
const SHORT_QUERY = "(max-height: 540px)";
const subscribeShort = (cb: () => void) => {
  const mq = window.matchMedia(SHORT_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const useShortViewport = () =>
  useSyncExternalStore(
    subscribeShort,
    () => window.matchMedia(SHORT_QUERY).matches,
    () => false,
  );

export default function KeyFeatures() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const short = useShortViewport();
  const pinned = !short;

  // 0 when the section reaches the header, 1 when the pinned frame is released.
  const { scrollYProgress } = useScroll({ target: ref, offset: [`start ${HEADER}px`, "end end"] });
  const rail = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const i = Math.min(steps.length - 1, Math.max(0, Math.floor(p * steps.length)));
    setActive((a) => (a === i ? a : i));
  });

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    if (!pinned) {
      setActive(i);
      return;
    }
    const start = el.getBoundingClientRect().top + window.scrollY - HEADER;
    const distance = el.offsetHeight - (window.innerHeight - HEADER);
    scrollToY(start + ((i + 0.4) / steps.length) * distance);
  };

  const step = steps[active];

  return (
    <section ref={ref} id="features" className="features-track relative" aria-labelledby="features-title">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-to-b from-transparent via-cream-100/60 to-transparent" />

      <div className="features-frame overflow-hidden">
        <div className="container-x relative flex h-full flex-col justify-center gap-4 py-4 sm:gap-6 lg:grid lg:grid-cols-12 lg:grid-rows-[auto_auto] lg:content-center lg:gap-x-14 lg:gap-y-6 lg:py-8">
          {/* Heading */}
          <div className="lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:self-end">
            <div className="eyebrow">Style Meets Strength</div>
            <h2 id="features-title" className="h-display mt-2 text-3xl sm:text-4xl lg:mt-3 lg:text-5xl">
              Our Key <span className="italic text-gold-600">Features</span>
            </h2>
            <p className="mt-3 hidden max-w-md text-ink-500 lg:block">
              Keep scrolling to walk through the four things every Infinity door is built on. Drag the model to look around.
            </p>
          </div>

          {/* 3D panel */}
          <div className="lg:col-span-6 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-center">
            <div className="relative flex h-[30svh] min-h-[190px] flex-col overflow-hidden rounded-[1.75rem] bg-navy-950 ring-1 ring-white/10 sm:h-[42svh] lg:h-[min(70svh,600px)] lg:rounded-[2rem]">
              <div className="grid-pattern absolute inset-0 opacity-60" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/25 blur-[80px]" />

              <div className="relative flex items-center justify-between px-5 pt-4 lg:px-6 lg:pt-5">
                <div className="flex items-center gap-2" role="tablist" aria-label="Key features">
                  {steps.map((s, i) => (
                    <button
                      key={s.title}
                      type="button"
                      role="tab"
                      aria-selected={i === active}
                      onClick={() => goTo(i)}
                      aria-label={s.title}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        i === active ? "w-8 bg-gold-400" : i < active ? "w-3 bg-gold-400/50" : "w-2 bg-white/25 hover:bg-white/50"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={step.caption}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-400 sm:text-[11px]"
                    >
                      {step.caption}
                    </motion.span>
                  </AnimatePresence>
                  <span className="font-display text-sm italic text-white/50 tabular-nums">
                    {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                  </span>
                </div>
              </div>

              <div className="relative min-h-0 flex-1" data-cursor="Drag">
                <FeatureScene step={active} />
              </div>

              {/* Legend */}
              <div className="relative hidden grid-cols-4 gap-2 px-6 pb-5 sm:grid">
                {step.legend.map((l, i) => (
                  <motion.div
                    key={step.title + l}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className="truncate rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-medium text-white/80 backdrop-blur-sm"
                  >
                    <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-gold-400" />
                    {l}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Steps: revealed one by one as the page scrolls */}
          <ol className="relative lg:col-span-6 lg:col-start-7 lg:row-start-2 lg:self-start">
            {pinned && (
              <span className="absolute bottom-3 left-[17px] top-3 hidden w-px bg-navy-950/10 lg:block" aria-hidden>
                <motion.span className="absolute inset-0 origin-top bg-gold-500" style={{ scaleY: rail }} />
              </span>
            )}
            {steps.map((s, i) => {
              const reached = !pinned || i <= active;
              const open = !pinned || i === active;
              const done = pinned && i < active;
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
                          ? "bg-gold-500 text-navy-950 shadow-[0_0_0_6px_rgb(220_184_102_/_0.18)]"
                          : done
                            ? "bg-white text-gold-600 ring-1 ring-gold-400/60"
                            : "bg-white text-ink-500 ring-1 ring-navy-950/10"
                      }`}
                    >
                      {done ? <CheckIcon className="h-4 w-4" /> : String(i + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className={`font-display font-medium leading-tight transition-all duration-500 ${
                        open ? "text-2xl text-navy-950 sm:text-3xl" : "text-lg text-ink-500 group-hover:text-navy-950"
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
                    <p className="pt-1 text-sm leading-relaxed text-ink-500 sm:text-base">{s.text}</p>
                    <ul className="mt-3 space-y-1.5 pb-3 lg:mt-4 lg:space-y-2 lg:pb-4">
                      {s.specs.map((sp) => (
                        <li key={sp} className="flex items-start gap-2.5 text-[13px] text-ink-700 sm:text-sm">
                          <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-600">
                            <CheckIcon className="h-2.5 w-2.5" />
                          </span>
                          {sp}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>

      {pinned && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden justify-center pb-4 lg:flex" aria-hidden>
          <motion.span
            animate={{ opacity: active === steps.length - 1 ? 0 : 1 }}
            className="text-[10px] font-semibold uppercase tracking-[0.3em] text-ink-500"
          >
            Scroll
          </motion.span>
        </div>
      )}
    </section>
  );
}
