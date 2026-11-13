"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { whyChooseUs } from "@/data/site";
import { ChevronDown, LayersIcon, PinIcon, ShieldIcon, SlidersIcon } from "./Icons";
import { ParallaxImage } from "./motion/Parallax";
import { Item, Reveal, Stagger } from "./motion/Reveal";
import { SectionHeading } from "./Shared";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Each point is taken from the two "Why choose us" paragraphs; the full text stays below. */
const reasons = [
  {
    Icon: PinIcon,
    title: "Centrally placed",
    text: "Plants at Nashik and Jalgaon put every major city in the region within easy reach.",
  },
  {
    Icon: SlidersIcon,
    title: "Customised, fairly priced",
    text: "An unmatched range in customised options, at reasonable prices.",
  },
  {
    Icon: ShieldIcon,
    title: "Ethical and skilled",
    text: "Ethical business dealings and highly skilled workers across Maharashtra and other states.",
  },
  {
    Icon: LayersIcon,
    title: "Perfect in dimension",
    text: "Galvanised steel doors and windows with great looks, aesthetics and stability.",
  },
];

export default function WhyChooseUs() {
  const [more, setMore] = useState(false);

  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        {/* Image with clip reveal and floating facts */}
        <div className="relative lg:col-span-5">
          <motion.div
            initial={{ clipPath: "inset(12% 12% 12% 12% round 2rem)", opacity: 0.4 }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0% round 2rem)", opacity: 1 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 1.2, ease: EASE }}
          >
            <ParallaxImage
              src={whyChooseUs.image}
              alt="Infinity French Doors showroom"
              className="aspect-[4/5] rounded-[2rem]"
              strength={10}
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.7, ease: EASE }}
            className="absolute -left-2 top-8 rounded-2xl bg-white/95 px-4 py-3 shadow-soft ring-1 ring-navy-950/5 backdrop-blur sm:-left-6"
          >
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-500">Two plants</div>
            <div className="font-display text-lg font-medium text-navy-950">Nashik · Jalgaon</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.7, ease: EASE }}
            className="absolute -right-2 bottom-10 rounded-2xl bg-navy-950 px-4 py-3 text-white shadow-soft sm:-right-6"
          >
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-400">Built in</div>
            <div className="font-display text-lg font-medium">Galvanised steel</div>
          </motion.div>
        </div>

        {/* Reasons */}
        <div className="lg:col-span-7">
          <SectionHeading eyebrow={whyChooseUs.eyebrow} title={whyChooseUs.heading} accent={["beautiful"]} />
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2" stagger={0.08}>
            {reasons.map(({ Icon, title, text }, i) => (
              <Item key={title} className="h-full">
                <div className="group relative h-full overflow-hidden rounded-2xl border border-navy-950/10 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:border-gold-400 hover:shadow-soft">
                  <span className="absolute right-5 top-4 font-display text-4xl italic text-navy-950/[0.06] transition-colors duration-500 group-hover:text-gold-500/20">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold-100 text-gold-600 transition-all duration-500 group-hover:rotate-[-8deg] group-hover:bg-navy-950 group-hover:text-gold-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-medium text-navy-950">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{text}</p>
                </div>
              </Item>
            ))}
          </Stagger>

          <Reveal delay={0.2} className="mt-6">
            <button
              type="button"
              onClick={() => setMore((m) => !m)}
              aria-expanded={more}
              aria-controls="why-more"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-navy-950 hover:text-gold-600"
            >
              {more ? "Show less" : "Read the full story"}
              <ChevronDown className={`h-4 w-4 transition-transform duration-500 ${more ? "rotate-180" : ""}`} />
            </button>
            <motion.div
              id="why-more"
              initial={false}
              animate={{ height: more ? "auto" : 0, opacity: more ? 1 : 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="overflow-hidden"
              aria-hidden={!more}
              inert={!more}
            >
              <div className="prose-site space-y-4 pt-4 text-sm leading-relaxed text-ink-500">
                {whyChooseUs.paragraphs.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
