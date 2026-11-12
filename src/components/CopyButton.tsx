"use client";

import { useState } from "react";
import { CheckIcon } from "./Icons";

export default function CopyButton({ value, label = "Copy", light = false }: { value: string; label?: string; light?: boolean }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {
      /* clipboard blocked: do nothing */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${label}: ${value}`}
      className={`inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all duration-300 ${
        light
          ? "border-white/15 text-white/60 hover:border-gold-400 hover:text-gold-400"
          : "border-navy-950/10 text-ink-500 hover:border-navy-950 hover:text-navy-950"
      } ${done ? "!border-emerald-400 !text-emerald-400" : ""}`}
    >
      {done ? (
        <>
          <CheckIcon className="h-3 w-3" /> Copied
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V5a1 1 0 0 1 1-1h10" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
