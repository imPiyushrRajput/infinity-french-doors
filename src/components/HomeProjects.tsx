"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { homeProjects } from "@/data/site";
import { ArrowRight } from "./Icons";
import { Reveal } from "./motion/Reveal";
import { SectionHeading } from "./Shared";

/**
 * 1.11 Projects as expanding panels: on desktop the hovered or focused panel
 * widens and reveals its story while the others fold into slim strips. On
 * phones the panels become a swipeable carousel with everything visible.
 */
export default function HomeProjects() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-16 lg:py-24">
      <div className="container-x">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow="Our Projects" title="Transforming Spaces with Excellence" accent={["excellence"]} />
          <Reveal delay={0.3}>
            <Link href="/projects/completed-projects" className="btn-outline shrink-0">
              See all projects <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mt-12 lg:mt-14">
          <ul className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:h-[520px] md:snap-none md:overflow-visible md:px-0 md:pb-0 lg:h-[560px]">
            {homeProjects.map((p, i) => {
              const open = i === active;
              return (
                <li
                  key={p.title}
                  className="w-[82%] shrink-0 snap-center sm:w-[60%] md:w-auto md:shrink md:basis-0 md:transition-[flex-grow] md:duration-700 md:ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ flexGrow: open ? 3.2 : 1 }}
                >
                  <Link
                    href="/projects/completed-projects"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    data-cursor="View"
                    className="group relative block aspect-[4/5] h-full overflow-hidden rounded-[1.75rem] bg-navy-950 md:aspect-auto"
                  >
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(min-width: 768px) 60vw, 82vw"
                      className={`object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "md:scale-100" : "md:scale-110"} group-hover:scale-105`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/30 to-transparent" />
                    <div
                      className={`absolute inset-0 bg-navy-950/40 transition-opacity duration-700 ${open ? "opacity-0" : "opacity-0 md:opacity-100"}`}
                    />

                    {/* Folded label (desktop, collapsed panels) */}
                    <div
                      className={`absolute inset-x-0 bottom-8 hidden flex-col items-center gap-4 transition-opacity duration-500 md:flex ${
                        open ? "opacity-0" : "opacity-100 delay-200"
                      }`}
                      aria-hidden
                    >
                      <span className="font-display text-sm italic text-gold-400">{String(i + 1).padStart(2, "0")}</span>
                      <span className="whitespace-nowrap font-display text-xl font-medium text-white [writing-mode:vertical-rl] rotate-180">
                        {p.title}
                      </span>
                    </div>

                    {/* Story */}
                    <div
                      className={`absolute inset-x-0 bottom-0 p-6 transition-all duration-700 sm:p-8 ${
                        open ? "md:translate-y-0 md:opacity-100 md:delay-200" : "md:pointer-events-none md:translate-y-6 md:opacity-0"
                      }`}
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-400">
                        Project {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-2 font-display text-2xl font-medium text-white sm:text-3xl lg:text-4xl">{p.title}</h3>
                      <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75">{p.text}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                        View projects
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gold-400 text-navy-950 transition-transform duration-500 group-hover:translate-x-1">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
