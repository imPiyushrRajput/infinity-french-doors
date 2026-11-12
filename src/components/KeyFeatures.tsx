"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CheckIcon } from "./Icons";
import { SectionHeading } from "./Shared";

const FeatureScene = dynamic(() => import("./three/FeatureScene"), {
  ssr: false,
  loading: () => <div className="h-full w-full" />,
});

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

function Step({ index, active, onEnter, step }: { index: number; active: boolean; onEnter: (i: number) => void; step: (typeof steps)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onEnter(index);
  }, [inView, index, onEnter]);
  return (
    <div ref={ref} className="scroll-mt-32 py-10 lg:min-h-[62vh] lg:py-14">
      <motion.div
        animate={{ opacity: active ? 1 : 0.4, x: active ? 0 : -6 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative pl-16"
      >
        <span className="absolute left-0 top-0 font-display text-5xl font-medium italic text-gold-500">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={`absolute left-[18px] top-16 h-[calc(100%-3rem)] w-px transition-colors duration-700 ${
            active ? "bg-gold-500" : "bg-navy-950/10"
          }`}
        />
        <h3 className="font-display text-3xl font-medium leading-tight text-navy-950 sm:text-4xl">{step.title}</h3>
        <p className="mt-3 max-w-md leading-relaxed text-ink-500">{step.text}</p>
        <ul className="mt-5 space-y-2">
          {step.specs.map((s) => (
            <li key={s} className="flex items-start gap-3 text-sm text-ink-700">
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-600">
                <CheckIcon className="h-3 w-3" />
              </span>
              {s}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

export default function KeyFeatures() {
  const [active, setActive] = useState(0);
  const step = steps[active];

  return (
    <section className="relative overflow-hidden py-16 lg:py-24" id="features">
      <div className="container-x">
        <SectionHeading
          eyebrow="Style Meets Strength"
          title="Our Key Features"
          accent={["features"]}
          text="Scroll through the four things every Infinity door is built on. Drag the model to look around."
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Sticky 3D panel */}
          <div className="lg:col-span-6">
            <div className="sticky top-[88px] z-10">
              <div className="relative overflow-hidden rounded-[2rem] bg-navy-950 ring-1 ring-white/10">
                <div className="grid-pattern absolute inset-0 opacity-60" />
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/25 blur-[80px]" />

                <div className="relative flex items-center justify-between px-6 pt-5">
                  <div className="flex items-center gap-2">
                    {steps.map((s, i) => (
                      <button
                        key={s.title}
                        type="button"
                        onClick={() => {
                          setActive(i);
                          document.getElementById(`feature-${i}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }}
                        aria-label={`Show ${s.title}`}
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          i === active ? "w-8 bg-gold-400" : "w-2 bg-white/25 hover:bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={step.caption}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-400"
                    >
                      {step.caption}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <div className="relative h-[300px] sm:h-[380px] lg:h-[440px]" data-cursor="Drag">
                  <FeatureScene step={active} />
                </div>

                {/* Legend */}
                <div className="relative grid min-h-[6.5rem] grid-cols-2 gap-2 px-6 pb-6 sm:min-h-[3.75rem] sm:grid-cols-4">
                  {step.legend.map((l, i) => (
                    <motion.div
                      key={step.title + l}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-medium text-white/80 backdrop-blur-sm"
                    >
                      <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-gold-400" />
                      {l}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="lg:col-span-6">
            {steps.map((s, i) => (
              <div key={s.title} id={`feature-${i}`}>
                <Step index={i} step={s} active={active === i} onEnter={setActive} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
