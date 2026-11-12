import Image from "next/image";
import Link from "next/link";
import { IMG, business } from "@/data/site";
import type { ReactNode } from "react";
import { PhoneIcon, WhatsappIcon } from "./Icons";
import { ArrowRight } from "./Icons";
import { ParallaxImage } from "./motion/Parallax";
import { Reveal, WordReveal } from "./motion/Reveal";
import { Magnetic, TiltCard } from "./motion/Interactive";

/* ---------- Section heading ---------- */
export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  light = false,
  className = "",
  accent = [],
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
  accent?: string[];
}) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-2xl ${className}`}>
      {eyebrow && (
        <Reveal>
          <span className={`eyebrow ${light ? "eyebrow-light" : ""} ${align === "center" ? "justify-center" : ""}`}>
            {eyebrow}
          </span>
        </Reveal>
      )}
      <WordReveal
        text={title}
        accent={accent}
        className={`h-display mt-4 text-4xl sm:text-5xl lg:text-[3.4rem] ${light ? "text-white" : "text-navy-950"}`}
      />
      {text && (
        <Reveal delay={0.2}>
          <p className={`mt-5 text-base leading-relaxed ${light ? "text-white/65" : "text-ink-500"}`}>{text}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ---------- Inner page header ---------- */
/* ---------- Page header ---------- */
const glance = [
  { v: "2012", l: "Established" },
  { v: "2", l: "Plants" },
  { v: "14+", l: "Experience centers" },
];

export function PageHeader({
  title,
  subtitle,
  image = `${IMG}backgrounds/page-header-bg.jpg`,
  crumbs,
  aside,
}: {
  title: string;
  subtitle?: string;
  image?: string;
  crumbs?: { label: string; href?: string }[];
  /** Optional custom content for the right column; defaults to the at-a-glance panel. */
  aside?: ReactNode;
}) {
  const phone = business.phones[0];
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      <ParallaxImage src={image} alt="" className="absolute inset-0" imgClassName="opacity-40" strength={20} priority />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/80 to-navy-950/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
      <div className="grid-pattern absolute inset-0 opacity-30" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />

      <div className="container-x relative grid items-center gap-10 py-14 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <div className="lg:col-span-7">
          {crumbs && (
            <Reveal>
              <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
                <Link href="/" className="link-underline hover:text-gold-400">
                  Home
                </Link>
                {crumbs.map((c) => (
                  <span key={c.label} className="flex items-center gap-2">
                    <span className="text-gold-400">/</span>
                    {c.href ? (
                      <Link href={c.href} className="link-underline hover:text-gold-400">
                        {c.label}
                      </Link>
                    ) : (
                      <span className="text-white" aria-current="page">
                        {c.label}
                      </span>
                    )}
                  </span>
                ))}
              </nav>
            </Reveal>
          )}
          <WordReveal as="h1" text={title} className="h-display text-5xl sm:text-6xl lg:text-7xl" once />
          {subtitle && (
            <Reveal delay={0.3}>
              <p className="mt-6 max-w-xl text-base text-white/65 sm:text-lg">{subtitle}</p>
            </Reveal>
          )}
        </div>

        <div className="relative lg:col-span-5 lg:justify-self-end">
          {aside ?? (
            <Reveal delay={0.25} className="relative w-full max-w-md">
              {/* rotating badge */}
              <div className="pointer-events-none absolute -right-4 -top-10 z-10 hidden h-28 w-28 sm:block" aria-hidden>
                <svg viewBox="0 0 100 100" className="h-full w-full animate-spin-slow">
                  <defs>
                    <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                  </defs>
                  <text fill="#dcb866" fontSize="9.5" fontWeight="700" letterSpacing="2.2">
                    <textPath href="#badge-circle">MADE IN NASHIK · SINCE 2012 · GALVANISED STEEL ·</textPath>
                  </text>
                </svg>
                <div className="absolute inset-0 m-auto h-10 w-10 rounded-full border border-gold-400/50 bg-navy-950/60 backdrop-blur-sm" />
                <div className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-gold-400" />
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-md">
                <div className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/50">At a glance</div>
                <dl className="mt-4 grid grid-cols-3 divide-x divide-white/10">
                  {glance.map((g) => (
                    <div key={g.l} className="px-3 first:pl-0 last:pr-0">
                      <dt className="order-2 mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">{g.l}</dt>
                      <dd className="font-display text-3xl font-medium leading-none text-gold-400">{g.v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-6 flex flex-wrap gap-2">
                  <a
                    href={`tel:${phone.label.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-navy-950 transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <PhoneIcon className="h-3.5 w-3.5" /> {phone.label}
                  </a>
                  <a
                    href={business.social.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white transition-colors duration-300 hover:border-gold-400 hover:text-gold-400"
                  >
                    <WhatsappIcon className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                  <Link
                    href="/contact-us"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white transition-colors duration-300 hover:border-gold-400 hover:text-gold-400"
                  >
                    Get a quote <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- CTA banner (G3) ---------- */
export function CtaBanner() {
  return (
    <section className="relative isolate overflow-hidden">
      <ParallaxImage src={`${IMG}backgrounds/leading-bg.jpg`} alt="" className="absolute inset-0" strength={18} />
      <div className="absolute inset-0 bg-navy-950/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-600/40 via-transparent to-gold-500/10" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border border-gold-400/20" />
      <div className="pointer-events-none absolute -bottom-32 -right-8 h-96 w-96 rounded-full border border-gold-400/10" />
      <div className="container-x relative flex flex-col items-start justify-between gap-10 py-20 lg:flex-row lg:items-center lg:py-28">
        <div className="max-w-2xl">
          <Reveal>
            <span className="eyebrow eyebrow-light">Let&apos;s build together</span>
          </Reveal>
          <WordReveal
            text="Ready to Transform Your Space?"
            accent={["space"]}
            className="h-display mt-4 text-4xl text-white sm:text-5xl lg:text-6xl"
          />
          <Reveal delay={0.25}>
            <p className="mt-5 text-lg text-white/70">
              Contact us now and bring elegance and security to your doors and windows.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.35}>
          <Magnetic>
            <Link href="/contact-us" className="btn-gold !px-9 !py-4.5 text-sm">
              Contact Now <ArrowRight className="h-4 w-4" />
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Product card ---------- */
export function ProductCard({
  title,
  image,
  href,
  index,
}: {
  title: string;
  image: string;
  href: string;
  index?: number;
}) {
  return (
    <TiltCard className="group relative h-full overflow-hidden rounded-[1.4rem] bg-navy-900 shadow-card ring-1 ring-navy-950/5" max={6}>
      <Link href={href} className="block h-full" data-cursor="View">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/35 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
          <div className="absolute inset-0 bg-gold-500/0 transition-colors duration-700 group-hover:bg-gold-500/10" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-6 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2">
          {index !== undefined && (
            <span className="mb-2 block font-display text-base italic text-gold-400">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          <h3 className="font-display text-[1.7rem] font-medium leading-tight text-white">{title}</h3>
          <span className="mt-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-400 opacity-0 transition-all duration-700 group-hover:translate-x-1 group-hover:opacity-100">
            View More <ArrowRight className="h-4 w-4" />
          </span>
        </div>
        <span className="absolute right-5 top-5 inline-flex h-10 w-10 -translate-y-2 items-center justify-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur-md transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowRight className="h-4 w-4 -rotate-45" />
        </span>
      </Link>
    </TiltCard>
  );
}
