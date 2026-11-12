"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, CloseIcon } from "./Icons";

export type LightboxItem = { src: string; alt?: string; caption?: string };

export function useLightbox(items: LightboxItem[]) {
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  const open = useCallback((i: number) => setIndex(i), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length)),
    [items.length],
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? null : (i + 1) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, prev, next]);

  return { index, open, close, prev, next };
}

export function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (index === null || typeof document === "undefined") return null;
  const item = items[index];
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/95 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        aria-label="Close"
      >
        <CloseIcon className="h-5 w-5" />
      </button>
      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
      <figure
        className="relative flex max-h-[90vh] w-full max-w-5xl flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-[75vh] w-full">
          <Image
            key={item.src}
            src={item.src}
            alt={item.alt ?? ""}
            fill
            sizes="100vw"
            className="animate-fade-up object-contain"
          />
        </div>
        {(item.caption || items.length > 1) && (
          <figcaption className="mt-4 flex items-center gap-4 text-sm text-white/70">
            {item.caption && <span className="font-display text-lg text-white">{item.caption}</span>}
            {items.length > 1 && (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                {index + 1} / {items.length}
              </span>
            )}
          </figcaption>
        )}
      </figure>
    </div>,
    document.body,
  );
}

/* Generic clickable image grid with lightbox */
export function ImageGrid({
  items,
  columns = "sm:grid-cols-2 lg:grid-cols-3",
  aspect = "aspect-[4/3]",
}: {
  items: LightboxItem[];
  columns?: string;
  aspect?: string;
}) {
  const lb = useLightbox(items);
  return (
    <>
      <div className={`grid gap-6 ${columns}`}>
        {items.map((it, i) => (
          <button data-cursor="View"
            type="button"
            key={it.src + i}
            onClick={() => lb.open(i)}
            className="group card overflow-hidden text-left transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-soft"
          >
            <div className={`relative ${aspect} overflow-hidden`}>
              <Image
                src={it.src}
                alt={it.alt ?? it.caption ?? ""}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-navy-950/0 transition group-hover:bg-navy-950/20" />
            </div>
            {it.caption && (
              <div className="flex items-center justify-between gap-3 px-5 py-4">
                <h3 className="font-display text-lg text-navy-950">{it.caption}</h3>
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">View</span>
              </div>
            )}
          </button>
        ))}
      </div>
      <Lightbox items={items} index={lb.index} onClose={lb.close} onPrev={lb.prev} onNext={lb.next} />
    </>
  );
}
