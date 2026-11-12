"use client";

import { useState } from "react";
import { faqs } from "@/data/site";
import { ChevronDown } from "./Icons";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-navy-950/10 rounded-3xl bg-white shadow-card ring-1 ring-navy-950/5">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-5 px-6 py-5 text-left sm:px-8"
            >
              <span className="font-display text-sm text-gold-600">{String(i + 1).padStart(2, "0")}</span>
              <span className={`flex-1 text-base font-semibold ${isOpen ? "text-brand-600" : "text-navy-950"}`}>
                {f.q}
              </span>
              <span
                className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition ${
                  isOpen ? "rotate-180 border-brand-600 bg-brand-600 text-white" : "border-navy-950/10 text-navy-950"
                }`}
              >
                <ChevronDown className="h-4 w-4" />
              </span>
            </button>
            <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <p className="px-6 pb-6 pl-[3.75rem] text-[15px] leading-relaxed text-ink-500 sm:px-8 sm:pl-[4.25rem]">
                  {f.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
