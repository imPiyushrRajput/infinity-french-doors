"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { heroSlides, products } from "@/data/site";
import { ArrowRight } from "./Icons";
import { Magnetic, TextMarquee } from "./motion/Interactive";

const DoorScene = dynamic(() => import("./three/DoorScene"), {
  ssr: false,
  loading: () => <div className="h-full w-full" />,
});

const INTERVAL = 8000;
const EASE = [0.16, 1, 0.3, 1] as const;

const chips = [
  { label: "Galvanised steel", sub: "Tata · Jindal · Pasco", pos: "left-0 top-[18%]", delay: 0 },
  { label: "Pure polyester", sub: "Powder coated", pos: "right-0 top-[38%]", delay: 1.2 },
  { label: "Maintenance free", sub: "No rust, no repaint", pos: "left-[4%] bottom-[16%]", delay: 2.4 },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const [progress, setProgress] = useState(0);

  // Background parallax + door opening tied to scroll
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const doorY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  useEffect(() => smooth.on("change", (v) => setProgress(Math.min(1, v * 1.8))), [smooth]);

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % heroSlides.length), INTERVAL);
    return () => clearInterval(t);
  }, []);

  const slide = heroSlides[i];
  const words = slide.heading.split(" ");

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-navy-950 text-white">
      {/* Background slideshow with parallax */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -bottom-[22%]">
        <AnimatePresence mode="sync">
          <motion.div
            key={slide.image}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.6, ease: "easeOut" }, scale: { duration: 9, ease: "linear" } }}
            className="absolute inset-0"
          >
            <Image src={slide.image} alt="" fill priority sizes="100vw" className="object-cover" />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/80 to-navy-950/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-navy-950/40" />
      <div className="grid-pattern absolute inset-0 opacity-40 [mask-image:radial-gradient(60%_60%_at_70%_40%,black,transparent)]" />

      <div className="container-x relative grid items-center gap-6 pb-32 pt-10 sm:pt-14 lg:min-h-[100svh] lg:grid-cols-12 lg:gap-6 lg:pb-36 lg:pt-20">
        {/* Copy */}
        <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 lg:col-span-7">
          <motion.span
            className="eyebrow eyebrow-light"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          >
            {slide.eyebrow}
          </motion.span>

          <h1 className="h-display mt-7 text-[2.9rem] leading-[0.98] sm:text-6xl lg:text-[5.4rem] xl:text-[6rem]" aria-label={slide.heading}>
            <AnimatePresence mode="wait">
              <motion.span key={slide.heading} className="block" aria-hidden>
                {words.map((w, idx) => {
                  const accent = idx >= words.length - 2;
                  return (
                    <span key={idx} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                      <motion.span
                        className={`inline-block ${accent ? "accent-italic" : ""}`}
                        initial={{ y: "110%", rotate: 3 }}
                        animate={{ y: 0, rotate: 0 }}
                        exit={{ y: "-110%", opacity: 0 }}
                        transition={{ duration: 1, ease: EASE, delay: 0.25 + idx * 0.06 }}
                      >
                        {w}
                      </motion.span>
                      {idx < words.length - 1 ? " " : ""}
                    </span>
                  );
                })}
              </motion.span>
            </AnimatePresence>
          </h1>

          <AnimatePresence mode="wait">
            <motion.p
              key={slide.text}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.7 }}
              className="mt-7 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg"
            >
              {slide.text}
            </motion.p>
          </AnimatePresence>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
          >
            <Magnetic>
              <Link href="/about-us" className="btn-gold !px-8 !py-4">
                Discover More <ArrowRight className="h-4 w-4" />
              </Link>
            </Magnetic>
            <Magnetic strength={0.25}>
              <Link href="/products/doors" className="btn-outline-light !px-8 !py-4">
                Explore Products
              </Link>
            </Magnetic>
          </motion.div>

          <motion.dl
            className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6 lg:mt-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            {[
              ["13+", "Years"],
              ["30k+", "Customers"],
              ["2", "Plants"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="font-display text-3xl font-medium text-gold-400 sm:text-4xl">{v}</dt>
                <dd className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">{l}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* 3D door */}
        <motion.div
          style={{ y: doorY }}
          className="relative z-0 mx-auto h-[360px] w-full max-w-[520px] sm:h-[480px] lg:col-span-5 lg:h-[620px] lg:max-w-none"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.4 }}
        >
          {/* Glow + rings behind the door */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/25 blur-[90px]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[92%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-400/20" />
          <div className="animate-spin-slow pointer-events-none absolute left-1/2 top-1/2 h-[104%] w-[104%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10" />
          <div className="animate-pulse-ring pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-400/30" />

          <div className="h-full w-full" role="img" aria-label="Interactive 3D model of an Infinity galvanised steel French door with a glazed transom">
            <DoorScene progress={progress} />
          </div>

          {/* Floating spec chips */}
          {chips.map((c) => (
            <motion.div
              key={c.label}
              className={`pointer-events-none absolute ${c.pos} hidden rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-md sm:block`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -10, 0] }}
              transition={{
                opacity: { duration: 1, delay: 1.4 + c.delay * 0.3 },
                y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: c.delay },
              }}
            >
              <div className="text-[13px] font-semibold text-white">{c.label}</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-gold-400">{c.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom bar: slide indicators + scroll hint */}
      <div className="container-x absolute inset-x-0 bottom-[4.5rem] z-10 flex items-center justify-between lg:bottom-24">
        <div className="flex items-center gap-3">
          {heroSlides.map((s, idx) => (
            <button
              key={s.heading}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className="relative h-px w-14 overflow-hidden bg-white/25"
            >
              {idx === i && (
                <motion.span
                  key={`${idx}-${i}`}
                  className="absolute inset-y-0 left-0 bg-gold-400"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: INTERVAL / 1000, ease: "linear" }}
                />
              )}
            </button>
          ))}
          <span className="ml-2 font-display text-sm italic text-white/60">
            {String(i + 1).padStart(2, "0")} — {String(heroSlides.length).padStart(2, "0")}
          </span>
        </div>
        <div className="hidden items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/40 sm:flex">
          Scroll
          <span className="relative h-10 w-px overflow-hidden bg-white/15">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-gold-400"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </div>
      </div>

      {/* Product ticker */}
      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-navy-950/60 py-4 backdrop-blur-md" aria-hidden>
        <TextMarquee items={products.map((p) => p.title)} light slow />
      </div>
    </section>
  );
}
