"use client";

/**
 * Small client wrappers that mount a 3D scene only when it is about to be seen.
 * Server components (CTA banner, 404 page) drop these in without becoming client code.
 */
import dynamic from "next/dynamic";
import { useRef } from "react";
import { useNear } from "./three/useNear";

const InfinityScene = dynamic(() => import("./three/InfinityScene"), { ssr: false });
const DoorScene = dynamic(() => import("./three/DoorScene"), { ssr: false });

/** Decorative infinity emblem behind the call-to-action banner (large screens only). */
export function CtaEmblem() {
  const ref = useRef<HTMLDivElement>(null);
  const near = useNear(ref);
  return (
    <div ref={ref} className="pointer-events-none absolute inset-y-0 right-0 hidden w-[56%] opacity-80 lg:block" aria-hidden>
      {near && <InfinityScene />}
    </div>
  );
}

/** The hero's French door, standing ajar, for the 404 page. */
export function NotFoundDoor() {
  const ref = useRef<HTMLDivElement>(null);
  const near = useNear(ref);
  return (
    <div
      ref={ref}
      role="img"
      aria-label="3D French door standing ajar"
      className="relative mx-auto h-[340px] w-full max-w-md overflow-hidden rounded-[2rem] bg-navy-950 ring-1 ring-navy-950/10 sm:h-[420px]"
    >
      <div className="grid-pattern absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/30 blur-[80px]" />
      <div className="absolute inset-0">{near && <DoorScene progress={0.55} />}</div>
    </div>
  );
}
