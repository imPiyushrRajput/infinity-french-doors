"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { SectionHeading } from "./Shared";
import { finishes, productModels } from "./three/productModels";
import { useNear } from "./three/useNear";

const ProductScene = dynamic(() => import("./three/ProductScene"), { ssr: false });

/** "Explore in 3D" band on product pages: orbit the model, preview a finish, open it. */
export default function ProductViewer({ slug, title }: { slug: string; title: string }) {
  const model = productModels[slug];
  const stage = useRef<HTMLDivElement>(null);
  const near = useNear(stage);
  const [finish, setFinish] = useState(0);
  const [open, setOpen] = useState(false);
  if (!model) return null;

  return (
    <section className="relative overflow-hidden bg-navy-950 py-16 text-white lg:py-24" aria-label={`${title} in 3D`}>
      <div className="grid-pattern absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute -left-24 top-1/4 h-[420px] w-[420px] rounded-full bg-brand-500/15 blur-3xl" />

      <div className="container-x relative grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Stage */}
        <div className="lg:col-span-7">
          <div
            ref={stage}
            data-cursor="Drag"
            className="relative h-[340px] overflow-hidden rounded-[2rem] bg-white/[0.03] ring-1 ring-white/10 sm:h-[460px] lg:h-[540px]"
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400/35 blur-[90px]" />
            <div className="absolute inset-0" role="img" aria-label={`3D model: ${model.caption}`}>
              {near && <ProductScene slug={slug} color={finishes[finish].value} open={open} />}
            </div>
            <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-navy-950/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" /> 3D · Drag to rotate
            </div>
            <p className="pointer-events-none absolute inset-x-5 bottom-4 text-xs text-white/55">{model.caption}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Interactive 3D"
            title={`See the ${title} from every angle`}
            accent={["angle"]}
            text="Turn the model, try a finish and open it up to get a feel for the build before you visit an experience center."
            light
          />

          <div className="mt-8">
            <div className="flex items-baseline justify-between">
              <span id={`finish-${slug}`} className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
                Preview a finish
              </span>
              <span className="font-display text-lg italic text-gold-400" aria-live="polite">
                {finishes[finish].name}
              </span>
            </div>
            <div role="radiogroup" aria-labelledby={`finish-${slug}`} className="mt-3 flex flex-wrap gap-3">
              {finishes.map((f, i) => (
                <button
                  key={f.name}
                  type="button"
                  role="radio"
                  aria-checked={i === finish}
                  aria-label={f.name}
                  title={f.name}
                  onClick={() => setFinish(i)}
                  className={`h-10 w-10 rounded-full ring-2 ring-offset-2 ring-offset-navy-950 transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-gold-400 ${
                    i === finish ? "scale-110 ring-gold-400" : "ring-white/15"
                  }`}
                  style={{ backgroundColor: f.value }}
                />
              ))}
            </div>
          </div>

          {model.toggle && (
            <button
              type="button"
              aria-pressed={open}
              onClick={() => setOpen((o) => !o)}
              className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:border-gold-400 hover:text-gold-400"
            >
              <span
                className={`relative inline-block h-5 w-9 rounded-full transition-colors duration-300 ${open ? "bg-gold-400" : "bg-white/20"}`}
                aria-hidden
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all duration-300 ${open ? "left-[18px]" : "left-0.5"}`}
                />
              </span>
              {open ? model.toggle[1] : model.toggle[0]}
            </button>
          )}

          <p className="mt-8 border-t border-white/10 pt-5 text-xs leading-relaxed text-white/45">
            Illustrative model. Every order is made to measure, and colours on screen are a guide only; ask us for the
            current shade card.
          </p>
        </div>
      </div>
    </section>
  );
}
