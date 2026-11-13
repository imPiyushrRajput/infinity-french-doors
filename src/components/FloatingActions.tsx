"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { business } from "@/data/site";
import { CloseIcon, MailIcon, PhoneIcon, WhatsappIcon } from "./Icons";
import { scrollToY } from "./motion/SmoothScroll";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => scrollToY(0);

  const actions = [
    {
      label: "WhatsApp",
      href: business.social.whatsapp,
      Icon: WhatsappIcon,
      cls: "bg-[#25D366] text-white",
      external: true,
    },
    { label: "Call us", href: business.phones[0].href, Icon: PhoneIcon, cls: "bg-brand-600 text-white" },
    { label: "Email us", href: `mailto:${business.email}`, Icon: MailIcon, cls: "bg-navy-950 text-white" },
  ];

  return (
    <div className="print:hidden fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      {/* Back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            onClick={toTop}
            aria-label="Back to top"
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy-950/10 bg-white/90 text-navy-950 shadow-soft backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:border-gold-500 hover:bg-gold-500"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5m0 0-6 6m6-6 6 6" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Contact speed dial */}
      <div className="relative flex flex-col items-end gap-3">
        <AnimatePresence>
          {open &&
            actions.map((a, i) => (
              <motion.a
                key={a.label}
                href={a.href}
                target={a.external ? "_blank" : undefined}
                rel={a.external ? "noreferrer" : undefined}
                initial={{ opacity: 0, y: 16, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.8 }}
                transition={{ duration: 0.35, ease: EASE, delay: (actions.length - 1 - i) * 0.05 }}
                className="group flex items-center gap-3"
              >
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-navy-950 shadow-card ring-1 ring-navy-950/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {a.label}
                </span>
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-full shadow-soft transition-transform duration-300 hover:scale-110 ${a.cls}`}
                >
                  <a.Icon className="h-5 w-5" />
                </span>
              </motion.a>
            ))}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close contact options" : "Contact us"}
          className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 text-navy-950 shadow-[0_18px_40px_-12px_rgb(201_162_74_/_0.7)] transition-all duration-500 hover:-translate-y-0.5 hover:bg-gold-400"
        >
          {!open && <span className="animate-pulse-ring absolute inset-0 rounded-full border-2 border-gold-500" />}
          <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.3 }} className="relative">
            {open ? <CloseIcon className="h-6 w-6" /> : <PhoneIcon className="h-6 w-6" />}
          </motion.span>
        </button>
      </div>
    </div>
  );
}
