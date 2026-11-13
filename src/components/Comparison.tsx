"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { comparison } from "@/data/site";
import { ChevronDown } from "./Icons";
import { Reveal } from "./motion/Reveal";
import { SectionHeading } from "./Shared";

const EASE = [0.16, 1, 0.3, 1] as const;
const INF = comparison.columns.length - 1;
const rivals = comparison.columns.slice(0, INF);
const EMPTY = "—";

function Value({ v, strong = false }: { v: string; strong?: boolean }) {
  if (v === EMPTY)
    return (
      <span className={strong ? "text-white/30" : "text-ink-500/40"} aria-label="Not stated">
        —
      </span>
    );
  return <span className={strong ? "font-medium text-white" : "text-ink-700"}>{v}</span>;
}

/**
 * 1.10 Comparison as a head-to-head: pick a rival and every attribute lines up
 * against Infinity. Rows with nothing stated on either side are left out. The
 * complete four-way table is still one click away.
 */
export default function Comparison() {
  const [rival, setRival] = useState(0);
  const [full, setFull] = useState(false);
  // Rows with something stated for Infinity come first; nothing is reworded.
  const rows = comparison.rows
    .filter((r) => r.values[rival] !== EMPTY || r.values[INF] !== EMPTY)
    .sort((a, b) => Number(a.values[INF] === EMPTY) - Number(b.values[INF] === EMPTY));

  return (
    <section className="bg-cream-100 py-16 lg:py-24" aria-label="How Infinity compares">
      <div className="container-x">
        <SectionHeading
          eyebrow="Know the difference"
          title="How Infinity compares"
          accent={["compares"]}
          text="Why galvanised steel French doors outperform aluminium sliders, fabricated channel gates and wooden doors."
          align="center"
        />

        {/* Rival picker */}
        <Reveal delay={0.15} className="mt-10 flex justify-center">
          <div
            role="tablist"
            aria-label="Compare Infinity with"
            className="inline-flex flex-wrap justify-center gap-1 rounded-[1.5rem] bg-white p-1.5 shadow-card ring-1 ring-navy-950/5 sm:rounded-full"
          >
            {rivals.map((r, i) => (
              <button
                key={r}
                type="button"
                role="tab"
                aria-selected={i === rival}
                onClick={() => setRival(i)}
                className={`relative rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-300 sm:px-5 ${
                  i === rival ? "text-white" : "text-ink-500 hover:text-navy-950"
                }`}
              >
                {i === rival && (
                  <motion.span
                    layoutId="rival-pill"
                    className="absolute inset-0 rounded-full bg-navy-950"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">vs {r}</span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* Head-to-head board */}
        <Reveal delay={0.25} className="mx-auto mt-10 max-w-5xl">
          <div className="grid grid-cols-2 gap-x-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] sm:gap-x-4">
            {/* Column headers */}
            <div className="hidden sm:block" />
            <div className="relative flex items-end pb-4">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={rival}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-500">The usual choice</div>
                  <div className="mt-1 font-display text-xl font-medium leading-tight text-navy-950 sm:text-2xl">{rivals[rival]}</div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="relative rounded-[1.25rem] bg-navy-950 px-4 pb-4 pt-5 sm:rounded-b-none sm:rounded-t-[1.5rem] sm:px-6">
              <span className="absolute -left-3 top-5 hidden h-7 w-7 items-center justify-center rounded-full bg-gold-500 font-display text-xs font-semibold italic text-navy-950 shadow-soft sm:-left-[1.15rem] sm:inline-flex">
                vs
              </span>
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-400">Infinity</div>
              <div className="mt-1 font-display text-xl font-medium leading-tight text-white sm:text-2xl">{comparison.columns[INF]}</div>
            </div>

            {/* Rows */}
            {rows.map((r, ri) => {
              const last = ri === rows.length - 1;
              return (
                <div key={r.type} className="contents">
                  <div className="col-span-2 pt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-600 sm:col-span-1 sm:border-t sm:border-navy-950/10 sm:py-4 sm:text-xs sm:normal-case sm:tracking-normal sm:text-navy-950">
                    {r.type}
                  </div>
                  <div className="rounded-xl bg-white px-3 py-3 text-sm sm:rounded-none sm:border-t sm:border-navy-950/10 sm:bg-transparent sm:px-0 sm:py-4">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={`${rival}-${r.type}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.25, delay: Math.min(ri * 0.02, 0.2), ease: EASE }}
                      >
                        <Value v={r.values[rival]} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div
                    className={`rounded-xl bg-navy-950 px-3 py-3 text-sm sm:rounded-none sm:px-6 sm:py-4 ${last ? "sm:rounded-b-[1.5rem] sm:pb-5" : ""} ${
                      ri > 0 ? "sm:border-t sm:border-white/10" : ""
                    }`}
                  >
                    <span className="flex gap-2">
                      {r.values[INF] !== EMPTY && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />}
                      <Value v={r.values[INF]} strong />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full table */}
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setFull((f) => !f)}
              aria-expanded={full}
              aria-controls="compare-full"
              className="btn-outline"
            >
              {full ? "Hide full table" : "See the full four-way table"}
              <ChevronDown className={`h-4 w-4 transition-transform duration-500 ${full ? "rotate-180" : ""}`} />
            </button>
          </div>
          <AnimatePresence initial={false}>
            {full && (
              <motion.div
                id="compare-full"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="card mt-8 overflow-x-auto">
                  <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-navy-950 text-white">
                        <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-white/60">Type</th>
                        {comparison.columns.map((c, i) => (
                          <th
                            key={c}
                            className={`px-5 py-4 text-[11px] font-semibold uppercase tracking-wider ${
                              i === INF ? "bg-brand-600 text-white" : "text-white/80"
                            }`}
                          >
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.rows.map((r) => (
                        <tr key={r.type} className="border-t border-navy-950/5 odd:bg-white even:bg-cream-50">
                          <td className="px-5 py-3 font-semibold text-navy-950">{r.type}</td>
                          {r.values.map((v, vi) => (
                            <td
                              key={vi}
                              className={`px-5 py-3 align-top ${vi === INF ? "bg-brand-100/60 font-medium text-navy-950" : "text-ink-700"}`}
                            >
                              {v}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
