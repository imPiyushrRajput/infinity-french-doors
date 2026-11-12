"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { faqs, galleryCategories, products, projectPages } from "@/data/site";
import { ArrowRight, CloseIcon } from "./Icons";

type Entry = { title: string; href: string; group: string; text?: string };

function buildIndex(): Entry[] {
  const pages: Entry[] = [
    { title: "Home", href: "/", group: "Pages" },
    { title: "About Us", href: "/about-us", group: "Pages", text: "company leadership vision mission journey" },
    { title: "All Doors & Windows", href: "/products/doors", group: "Pages" },
    { title: "Gallery", href: "/gallery", group: "Pages", text: "photos images" },
    { title: "Videos", href: "/videos", group: "Pages", text: "youtube" },
    { title: "Contact Us", href: "/contact-us", group: "Pages", text: "phone email address map enquiry quote" },
  ];
  const prod: Entry[] = products.flatMap((p) => [
    { title: p.title, href: `/products/${p.slug}`, group: "Products", text: p.description },
    ...p.subProducts.map((s) => ({ title: s.title, href: `/products/${p.slug}`, group: "Products", text: p.title })),
  ]);
  const proj: Entry[] = projectPages.flatMap((pg) => [
    { title: pg.title, href: `/projects/${pg.slug}`, group: "Projects", text: pg.intro },
    ...pg.items.map((i) => ({ title: i.title, href: `/projects/${pg.slug}`, group: "Projects" })),
  ]);
  const gal: Entry[] = galleryCategories
    .filter((c) => c.slug !== "all")
    .map((c) => ({ title: `Gallery: ${c.label}`, href: `/gallery/${c.slug}`, group: "Gallery" }));
  const faq: Entry[] = faqs.map((f) => ({ title: f.q, href: "/#faq", group: "FAQ", text: f.a }));
  return [...pages, ...prod, ...proj, ...gal, ...faq];
}

function score(e: Entry, q: string) {
  const t = e.title.toLowerCase();
  const body = (e.text ?? "").toLowerCase();
  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  if (t.includes(q)) return 60;
  const words = q.split(/\s+/).filter(Boolean);
  const hits = words.filter((w) => t.includes(w) || body.includes(w)).length;
  return hits ? 20 + hits * 10 : 0;
}

export function SearchButton({ onOpen, className = "" }: { onOpen: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Search the site"
      className={`inline-flex h-11 items-center gap-2 rounded-full border border-navy-950/10 px-3 text-navy-950 transition-all duration-500 hover:border-navy-950 hover:bg-navy-950 hover:text-white ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <span className="hidden text-[11px] font-semibold uppercase tracking-[0.14em] xl:inline">Search</span>
      <kbd className="hidden rounded-md border border-current/20 px-1.5 py-0.5 font-sans text-[10px] xl:inline">⌘K</kbd>
    </button>
  );
}

export default function SiteSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const index = useMemo(() => buildIndex(), []);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return index.filter((e) => e.group === "Pages" || e.group === "Products").slice(0, 8);
    return index
      .map((e) => ({ e, s: score(e, query) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 10)
      .map((r) => r.e);
  }, [q, index]);

  // Reset the query each time the palette opens (state adjustment during render).
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setQ("");
      setActive(0);
    }
  }

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      }
      if (e.key === "Enter" && results[active]) {
        router.push(results[active].href);
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, active, router, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-start justify-center bg-navy-950/70 p-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Site search"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-navy-950/10"
          >
            <div className="flex items-center gap-3 border-b border-navy-950/10 px-5 py-4">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-ink-500" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                placeholder="Search products, pages, FAQs…"
                className="flex-1 bg-transparent text-base text-ink-900 placeholder:text-ink-500/60 focus:outline-none"
                aria-label="Search"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-500 hover:bg-cream-100"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
            <ul className="max-h-[55vh] overflow-y-auto p-2" role="listbox">
              {results.length === 0 && (
                <li className="px-4 py-8 text-center text-sm text-ink-500">
                  No results for &ldquo;{q}&rdquo;. Try &ldquo;French windows&rdquo; or &ldquo;safety doors&rdquo;.
                </li>
              )}
              {results.map((r, i) => (
                <li key={r.group + r.title + r.href} role="option" aria-selected={i === active}>
                  <Link
                    href={r.href}
                    onClick={onClose}
                    onMouseEnter={() => setActive(i)}
                    className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3 transition-colors ${
                      i === active ? "bg-cream-100" : "hover:bg-cream-100"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-navy-950">{r.title}</div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-gold-600">{r.group}</div>
                    </div>
                    <ArrowRight className={`h-4 w-4 shrink-0 text-ink-500 transition-opacity ${i === active ? "opacity-100" : "opacity-0"}`} />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-navy-950/10 px-5 py-2.5 text-[11px] text-ink-500">
              <span>↑↓ to navigate · ↵ to open · esc to close</span>
              <span>{results.length} results</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
