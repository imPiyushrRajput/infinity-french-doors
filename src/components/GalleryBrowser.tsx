"use client";

import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useMemo, useState } from "react";
import { galleryCategories, galleryItems } from "@/data/site";
import { Lightbox, useLightbox } from "./Lightbox";
import { withBase } from "@/lib/paths";

/** Keeps the tab title in sync with the client-side filter. */
function setTitle(t: string) {
  document.title = `${t} | Infinity French Doors`;
}

/**
 * Filters the gallery instantly on the client and keeps the URL in sync
 * (history.replaceState), so switching filters never triggers a route load.
 */
export default function GalleryBrowser({ initial }: { initial: string }) {
  const [active, setActive] = useState(initial);
  const items = useMemo(
    () => (active === "all" ? galleryItems : galleryItems.filter((g) => g.category === active)),
    [active],
  );
  const lb = useLightbox(items.map((g) => ({ src: g.src, alt: g.alt })));

  const choose = (slug: string) => {
    setActive(slug);
    const href = slug === "all" ? "/gallery" : `/gallery/${slug}`;
    window.history.replaceState(window.history.state, "", withBase(href));
    const label = galleryCategories.find((c) => c.slug === slug)?.label;
    setTitle(slug === "all" || !label ? "Gallery" : `${label} Gallery`);
  };

  return (
    <>
      <div className="mb-10 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Gallery filters">
        {galleryCategories.map((c) => {
          const on = c.slug === active;
          return (
            <button
              key={c.slug}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => choose(c.slug)}
              className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300 ${
                on ? "text-white" : "text-ink-700 hover:text-navy-950"
              }`}
            >
              {on && (
                <motion.span
                  layoutId="gallery-pill"
                  className="absolute inset-0 rounded-full bg-navy-950"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{c.label}</span>
              <span className={`relative ml-2 text-[10px] ${on ? "text-gold-400" : "text-ink-500"}`}>
                {c.slug === "all" ? galleryItems.length : galleryItems.filter((g) => g.category === c.slug).length}
              </span>
            </button>
          );
        })}
      </div>

      <LayoutGroup>
        <motion.div layout className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3" role="tabpanel">
          <AnimatePresence mode="popLayout">
            {items.map((g, i) => (
              <motion.button
                key={g.src}
                layout
                type="button"
                data-cursor="View"
                onClick={() => lb.open(i)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="group card relative aspect-square overflow-hidden text-left"
                aria-label={`Open ${g.alt}`}
              >
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="text-sm font-semibold text-white">{g.alt}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-gold-400">
                    {galleryCategories.find((c) => c.slug === g.category)?.label}
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      <Lightbox
        items={items.map((g) => ({ src: g.src, alt: g.alt, caption: g.alt }))}
        index={lb.index}
        onClose={lb.close}
        onPrev={lb.prev}
        onNext={lb.next}
      />
    </>
  );
}
