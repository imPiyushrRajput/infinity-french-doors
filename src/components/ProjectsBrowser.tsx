"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { projectPages } from "@/data/site";
import { ImageGrid } from "./Lightbox";
import { withBase } from "@/lib/paths";

/** Keeps the tab title in sync with the client-side filter. */
function setTitle(t: string) {
  document.title = `${t} | Infinity French Doors`;
}

/** Switches between project stages on the client; URL updated without a route load. */
export default function ProjectsBrowser({ initial }: { initial: string }) {
  const [active, setActive] = useState(initial);
  const page = projectPages.find((p) => p.slug === active) ?? projectPages[0];

  const choose = (slug: string) => {
    setActive(slug);
    window.history.replaceState(window.history.state, "", withBase(`/projects/${slug}`));
    const title = projectPages.find((p) => p.slug === slug)?.title;
    if (title) setTitle(title);
  };

  return (
    <>
      <div className="mb-10 flex flex-wrap gap-2" role="tablist" aria-label="Project stages">
        {projectPages.map((p) => {
          const on = p.slug === active;
          return (
            <button
              key={p.slug}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => choose(p.slug)}
              className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300 ${
                on ? "text-white" : "text-ink-700 hover:text-navy-950"
              }`}
            >
              {on && (
                <motion.span
                  layoutId="projects-pill"
                  className="absolute inset-0 rounded-full bg-navy-950"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{p.title}</span>
              <span className={`relative ml-2 text-[10px] ${on ? "text-gold-400" : "text-ink-500"}`}>{p.items.length}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={page.slug}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          role="tabpanel"
        >
          <p className="mb-8 max-w-xl text-ink-500">{page.intro}</p>
          <ImageGrid items={page.items.map((i) => ({ src: i.image, caption: i.title, alt: i.title }))} />
        </motion.div>
      </AnimatePresence>
    </>
  );
}
