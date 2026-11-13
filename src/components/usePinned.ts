"use client";

import { useSyncExternalStore } from "react";

/** Height of the sticky header once the page is scrolled (76px nav + 1px border). */
export const HEADER = 77;

/* Very short viewports (landscape phones) cannot fit a pinned layout; they get a normal stacked section. */
const SHORT_QUERY = "(max-height: 540px)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(SHORT_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** True when the viewport is too short for a pinned scroll story (matches the CSS fallback). */
export const useShortViewport = () =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(SHORT_QUERY).matches,
    () => false,
  );

/** Scroll distance each step of a pinned story gets, in svh. */
export const STEP_SVH = 80;
/** How far into a step a "jump to step" click lands (0..1). */
export const STEP_LANDING = 0.4;
/** Spring that smooths scroll progress for rails, bars and 3D scenes. */
export const STORY_SPRING = { stiffness: 140, damping: 30, mass: 0.4 } as const;

/** Scroll position (px) that puts a pinned track at `fraction` (0..1) of its story. */
export function pinnedScrollTarget(track: HTMLElement, fraction: number) {
  const start = track.getBoundingClientRect().top + window.scrollY - HEADER;
  const distance = track.offsetHeight - (window.innerHeight - HEADER);
  return start + fraction * distance;
}
