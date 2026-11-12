"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { testimonials } from "@/data/site";
import { ChevronLeft, ChevronRight, QuoteIcon } from "./Icons";
import { SectionHeading } from "./Shared";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Testimonials() {
  const items = testimonials.items;
  const [[i, dir], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setState(([n]) => [(n + 1) % items.length, 1]), 6500);
    return () => clearInterval(t);
  }, [paused, items.length]);

  const go = (n: number, d: number) => setState([(n + items.length) % items.length, d]);
  const current = items[i];
  const initials = current.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <section className="relative overflow-hidden bg-navy-950 py-24 text-white lg:py-36">
      <div className="grid-pattern absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[420px] w-[420px] rounded-full bg-gold-500/10 blur-3xl" />
      <span className="text-outline pointer-events-none absolute -right-6 top-10 select-none font-display text-[12rem] italic leading-none lg:text-[18rem]">
        Trust
      </span>

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow={testimonials.eyebrow}
            title={testimonials.heading}
            accent={["clients", "say"]}
            text={testimonials.intro}
            light
          />
          <div className="mt-10 flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(i - 1, -1)}
              aria-label="Previous testimonial"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 transition-all duration-500 hover:scale-105 hover:border-gold-400 hover:bg-gold-400 hover:text-navy-950"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(i + 1, 1)}
              aria-label="Next testimonial"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 transition-all duration-500 hover:scale-105 hover:border-gold-400 hover:bg-gold-400 hover:text-navy-950"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="ml-4 flex items-center gap-2">
              {items.map((t, idx) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => go(idx, idx > i ? 1 : -1)}
                  aria-label={`Testimonial ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx === i ? "w-10 bg-gold-400" : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          className="relative lg:col-span-7"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait" custom={dir}>
            <motion.figure
              key={i}
              custom={dir}
              initial={{ opacity: 0, x: dir * 60, rotateY: dir * 6 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: dir * -60, rotateY: dir * -6 }}
              transition={{ duration: 0.8, ease: EASE }}
              style={{ transformPerspective: 1200 }}
              className="relative rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 backdrop-blur-md sm:p-12"
            >
              <QuoteIcon className="absolute -top-7 left-8 h-14 w-14 text-gold-400" />
              <blockquote className="font-display text-3xl font-medium leading-snug text-white sm:text-[2.4rem]">
                &ldquo;{current.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 font-display text-lg font-semibold text-navy-950">
                  {initials}
                </span>
                <div>
                  <div className="font-semibold">{current.name}</div>
                  <div className="text-sm text-white/55">{current.role}</div>
                </div>
                <div className="ml-auto flex gap-0.5 text-gold-400" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg key={s} viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                      <path d="m10 1.5 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L10 14.9l-5.3 2.8 1.1-5.9L1.5 7.7l5.9-.8L10 1.5Z" />
                    </svg>
                  ))}
                </div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
