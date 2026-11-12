/**
 * Path helpers for code that builds URLs by hand (history.replaceState).
 * next/link and next/navigation add the base path automatically.
 * On GitHub Pages the site lives under /<repo>/ and uses trailing slashes.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const TRAILING = process.env.NEXT_PUBLIC_TRAILING_SLASH === "1";

/** "/gallery/doors" -> "/infinity-french-doors/gallery/doors/" on Pages. */
export function withBase(path: string) {
  const p = TRAILING && !path.endsWith("/") ? `${path}/` : path;
  return `${BASE_PATH}${p}`;
}
