"use client";

import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { useEffect, useState } from "react";
import { testimonials } from "@/data/site";
import { ChevronLeft, ChevronRight, QuoteIcon } from "./Icons";
import { SectionHeading } from "./Shared";

const EASE = [0.16, 1, 0.3, 1] as const;
const SWIPE = 90;
const DEPTH = 3;

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("");

function Stars() {
  return (
    <div className="flex gap-0.5 text-gold-500" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, s) => (
        <svg
          key={s}
          viewBox="0 0 20 20"
          className="h-4 w-4 fill-current"
          aria-hidden
        >
          <path d="m10 1.5 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L10 14.9l-5.3 2.8 1.1-5.9L1.5 7.7l5.9-.8L10 1.5Z" />
        </svg>
      ))}
    </div>
  );
}

/**
 * 1.12 Testimonials as a deck of cards on a light background. Drag or swipe
 * the top card away (or use the arrows / avatars) to bring the next one up.
 */
export default function Testimonials() {
  const items = testimonials.items;
  const n = items.length;
  const [[i, dir], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setState(([k]) => [(k + 1) % n, 1]), 6500);
    return () => clearInterval(t);
  }, [paused, n]);

  const go = (k: number, d: number) => setState([(k + n) % n, d]);
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE || info.velocity.x < -500) go(i + 1, 1);
    else if (info.offset.x > SWIPE || info.velocity.x > 500) go(i - 1, -1);
  };

  const deck = Array.from({ length: Math.min(DEPTH, n) }, (_, k) => ({
    item: items[(i + k) % n],
    k,
  }));

  return (
    <section
      className="relative overflow-hidden bg-cream-100 py-20 lg:py-28"
      aria-label={testimonials.heading}
    >
      <div className="pointer-events-none absolute -right-32 top-10 h-[420px] w-[420px] rounded-full bg-gold-100 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-[360px] w-[360px] rounded-full bg-brand-100 blur-3xl" />

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow={testimonials.eyebrow}
            title={testimonials.heading}
            accent={["clients", "say"]}
            text={testimonials.intro}
          />

          {/* Who's speaking */}
          <ul
            className="mt-10 flex flex-wrap gap-3"
            aria-label="Choose a testimonial"
          >
            {items.map((t, idx) => (
              <li key={t.name}>
                <button
                  type="button"
                  onClick={() => go(idx, idx > i ? 1 : -1)}
                  aria-pressed={idx === i}
                  className={`group flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4 text-left ring-1 transition-all duration-500 ${
                    idx === i
                      ? "bg-navy-950 text-white ring-navy-950"
                      : "bg-white text-navy-950 ring-navy-950/10 hover:ring-gold-500"
                  }`}
                >
                  <span
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full font-display text-sm font-semibold transition-colors duration-500 ${
                      idx === i
                        ? "bg-gold-400 text-navy-950"
                        : "bg-gold-100 text-gold-600"
                    }`}
                  >
                    {initials(t.name)}
                  </span>
                  <span className="text-xs font-semibold">{t.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="relative lg:col-span-7"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {/* Deck */}
          <div
            className="relative mx-auto h-[470px] max-w-xl sm:h-[410px]"
            aria-live="polite"
          >
            <AnimatePresence initial={false} custom={dir}>
              {deck
                .slice()
                .reverse()
                .map(({ item, k }) => {
                  const top = k === 0;
                  return (
                    <motion.figure
                      key={item.name}
                      custom={dir}
                      initial={{ opacity: 0, scale: 0.85, y: 50 }}
                      animate={{
                        opacity: 1,
                        scale: 1 - k * 0.06,
                        y: k * 22,
                        rotate: top ? 0 : k % 2 ? 3 : -3,
                        x: 0,
                      }}
                      exit={{
                        opacity: 0,
                        x: dir * -380,
                        rotate: dir * -14,
                        transition: { duration: 0.5, ease: EASE },
                      }}
                      transition={{ duration: 0.6, ease: EASE }}
                      drag={top ? "x" : false}
                      dragSnapToOrigin
                      dragElastic={0.7}
                      onDragEnd={top ? onDragEnd : undefined}
                      whileDrag={{ cursor: "grabbing", scale: 1.02 }}
                      style={{ zIndex: DEPTH - k, touchAction: "pan-y" }}
                      className={`absolute inset-x-0 top-0 flex h-[420px] flex-col rounded-[2rem] bg-white p-7 shadow-soft ring-1 ring-navy-950/5 sm:h-[360px] sm:p-10 ${
                        top ? "cursor-grab" : "pointer-events-none"
                      }`}
                      aria-hidden={!top}
                      data-cursor={top ? "Drag" : undefined}
                    >
                      <div
                        className={`flex h-full flex-col transition-opacity duration-500 ${top ? "opacity-100" : "opacity-0"}`}
                      >
                        <div className="flex items-center justify-between">
                          <QuoteIcon className="h-10 w-10 text-gold-400" />
                          <Stars />
                        </div>
                        <blockquote className="mt-5 flex-1 font-display text-xl font-medium leading-snug text-navy-950 sm:text-2xl">
                          &ldquo;{item.quote}&rdquo;
                        </blockquote>
                        <figcaption className="mt-6 flex items-center gap-3 border-t border-navy-950/10 pt-5">
                          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-navy-950 font-display text-base font-semibold text-gold-400">
                            {initials(item.name)}
                          </span>
                          <div>
                            <div className="font-semibold text-navy-950">
                              {item.name}
                            </div>
                            <div className="text-sm text-ink-500">
                              {item.role}
                            </div>
                          </div>
                        </figcaption>
                      </div>
                    </motion.figure>
                  );
                })}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mx-auto flex max-w-xl items-center justify-between">
            <button
              type="button"
              onClick={() => go(i - 1, -1)}
              aria-label="Previous testimonial"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-navy-950 shadow-card ring-1 ring-navy-950/10 transition-all duration-500 hover:scale-105 hover:bg-gold-400"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-500">
              <span className="font-display text-base normal-case italic tracking-normal text-navy-950">
                {String(i + 1).padStart(2, "0")}
              </span>{" "}
              / {String(n).padStart(2, "0")} · drag to flip
            </span>
            <button
              type="button"
              onClick={() => go(i + 1, 1)}
              aria-label="Next testimonial"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-navy-950 shadow-card ring-1 ring-navy-950/10 transition-all duration-500 hover:scale-105 hover:bg-gold-400"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
