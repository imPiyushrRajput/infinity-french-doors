"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { videos } from "@/data/site";
import { PlayIcon } from "./Icons";
import { Reveal } from "./motion/Reveal";

/** YouTube embed URL that starts playing as soon as it loads. */
const autoplay = (embed: string) => `${embed}${embed.includes("?") ? "&" : "?"}autoplay=1&rel=0`;

/**
 * Videos page as a small cinema: one large featured player with an ambient
 * glow taken from its poster. The YouTube player only loads when someone
 * presses play. With more than one video a playlist rail appears beside it.
 */
export default function VideoShowcase() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const video = videos[current];
  const many = videos.length > 1;

  const pick = (i: number) => {
    setCurrent(i);
    setPlaying(true);
  };

  return (
    <section className="relative overflow-hidden bg-cream-100 py-16 text-navy-950 lg:py-24" aria-label="Infinity on video">
      {/* Ambient glow from the poster */}
      <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden>
        <Image src={video.thumb} alt="" fill sizes="100vw" className="scale-125 object-cover blur-[90px] saturate-150" />
      </div>
      <div className="absolute inset-0 bg-cream-100/60" />

      <div className="container-x relative">
        <Reveal>
          <div className="eyebrow">Watch</div>
          <h2 className="h-display mt-3 text-4xl sm:text-5xl">
            Infinity on <span className="italic text-gold-600">video</span>
          </h2>
        </Reveal>

        <div className={`mt-10 grid gap-6 ${many ? "lg:grid-cols-12" : ""}`}>
          <Reveal delay={0.1} className={many ? "lg:col-span-8" : "mx-auto w-full max-w-5xl"}>
            <figure>
              <div className="relative aspect-video overflow-hidden rounded-[1.75rem] bg-black shadow-[0_40px_100px_-30px_rgb(6_14_31_/_0.55)] ring-1 ring-navy-950/10">
                <AnimatePresence mode="wait" initial={false}>
                  {playing ? (
                    <motion.iframe
                      key={`play-${video.embed}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      src={autoplay(video.embed)}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  ) : (
                    <motion.button
                      key={`poster-${video.embed}`}
                      type="button"
                      onClick={() => setPlaying(true)}
                      exit={{ opacity: 0 }}
                      className="group absolute inset-0 block"
                      aria-label={`Play video: ${video.title}`}
                      data-cursor="Play"
                    >
                      <Image
                        src={video.thumb}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 66vw, 100vw"
                        className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent" />
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-gold-400/40" />
                        <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-gold-400 text-navy-950 shadow-[0_20px_50px_-10px_rgb(220_184_102_/_0.7)] transition-transform duration-500 group-hover:scale-110 sm:h-24 sm:w-24">
                          <PlayIcon className="ml-1 h-8 w-8" />
                        </span>
                      </span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
              <figcaption className="mt-5 flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-display text-2xl font-medium sm:text-3xl">{video.title}</h3>
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-500">
                  {String(current + 1).padStart(2, "0")} / {String(videos.length).padStart(2, "0")}
                </span>
              </figcaption>
            </figure>
          </Reveal>

          {many && (
            <Reveal delay={0.2} className="lg:col-span-4">
              <ul className="flex gap-3 overflow-x-auto pb-2 lg:max-h-[min(70vh,560px)] lg:flex-col lg:overflow-y-auto lg:overflow-x-visible lg:pb-0">
                {videos.map((v, i) => (
                  <li key={v.embed} className="w-64 shrink-0 lg:w-auto">
                    <button
                      type="button"
                      onClick={() => pick(i)}
                      aria-current={i === current}
                      className={`group flex w-full gap-3 rounded-2xl p-2 text-left transition-colors duration-300 ${
                        i === current ? "bg-white shadow-card ring-1 ring-gold-400/60" : "hover:bg-white/70"
                      }`}
                    >
                      <span className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-xl">
                        <Image src={v.thumb} alt="" fill sizes="112px" className="object-cover" />
                      </span>
                      <span className="text-sm font-medium leading-snug text-navy-950">{v.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
