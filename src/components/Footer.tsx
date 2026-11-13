import Image from "next/image";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { business, directionsUrl, products } from "@/data/site";
import {
  ArrowRight,
  DownloadIcon,
  FacebookIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  TwitterIcon,
  WhatsappIcon,
  YoutubeIcon,
} from "./Icons";
import { FooterWordmark } from "./FooterParts";
import { Reveal } from "./motion/Reveal";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Projects", href: "/projects/completed-projects" },
  { label: "Gallery", href: "/gallery" },
  { label: "Videos", href: "/videos" },
  { label: "Contact Us", href: "/contact-us" },
];

const social = [
  { Icon: FacebookIcon, href: business.social.facebook, label: "Facebook" },
  { Icon: TwitterIcon, href: business.social.twitter, label: "Twitter" },
  { Icon: WhatsappIcon, href: business.social.whatsapp, label: "WhatsApp" },
  { Icon: YoutubeIcon, href: business.social.youtube, label: "YouTube" },
];

type Tile = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  href: string;
  external?: boolean;
};

const tiles: Tile[] = [
  { Icon: PhoneIcon, label: "Call us", value: business.phones[0].label, href: business.phones[0].href },
  { Icon: WhatsappIcon, label: "WhatsApp", value: "Chat with our team", href: business.social.whatsapp, external: true },
  { Icon: MailIcon, label: "Email", value: business.email, href: `mailto:${business.email}` },
  { Icon: DownloadIcon, label: "Brochure", value: "Download the PDF", href: business.brochure, external: true },
];

function ContactTile({ Icon, label, value, href, external }: Tile) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="group relative isolate flex h-full items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-500 hover:border-gold-400"
    >
      {/* Gold fill that rises on hover */}
      <span className="absolute inset-0 -z-10 translate-y-full bg-gold-400 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/5 text-gold-400 ring-1 ring-white/10 transition-colors duration-500 group-hover:bg-navy-950 group-hover:ring-navy-950">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50 transition-colors duration-500 group-hover:text-navy-950/70">
          {label}
        </span>
        <span className="mt-1 block text-sm font-medium text-white [overflow-wrap:anywhere] transition-colors duration-500 group-hover:text-navy-950">
          {value}
        </span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 -rotate-45 text-white/40 transition-all duration-500 group-hover:rotate-0 group-hover:text-navy-950" />
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-navy-900 via-navy-950 to-navy-950 text-white/70">
      {/* Gold hairline so the footer reads as its own block after a dark section */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" />
      <div className="grid-pattern pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-40 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />

      <div className="container-x relative pt-16 lg:pt-24">
        {/* Statement + ways to reach us */}
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <Reveal className="lg:col-span-5">
            <div className="inline-block rounded-xl bg-white px-4 py-3 transition-transform duration-500 hover:-translate-y-0.5">
              <Image src={business.logo} alt={business.brand} width={170} height={80} className="h-10 w-auto" />
            </div>
            <p className="h-display mt-8 text-4xl text-white sm:text-5xl">
              Doors that <span className="italic text-gold-400">open your emotions.</span>
            </p>
            <p className="mt-5 max-w-md text-sm leading-relaxed">
              Manufacturers of galvanised steel French doors, safety doors, French windows and XXL doors since 2012.
              Designed in Nashik, powder coated to last, and installed across Maharashtra and beyond.
            </p>
          </Reveal>
          <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
            {tiles.map((t, i) => (
              <li key={t.label}>
                <Reveal delay={0.08 * i} className="h-full">
                  <ContactTile {...t} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        {/* Links */}
        <div className="mt-14 grid gap-10 border-t border-white/10 pt-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-12">
          <Reveal className="lg:col-span-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-400">Explore</h3>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm sm:grid-cols-1">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-underline transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-400">Products</h3>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
              {products.map((p) => (
                <li key={p.slug}>
                  <Link href={`/products/${p.slug}`} className="link-underline transition-colors hover:text-white">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2} className="sm:col-span-2 lg:col-span-5">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-400">Our plants</h3>
            <ul className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
              {business.plants.map((pl) => (
                <li key={pl.name} className="flex gap-3">
                  <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  <div>
                    <a
                      href={directionsUrl(pl.address)}
                      target="_blank"
                      rel="noreferrer"
                      className="link-underline font-medium text-white hover:text-gold-400"
                    >
                      {pl.name}
                    </a>
                    <div className="mt-1 leading-relaxed">{pl.address}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-12 flex items-center gap-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">Follow us</span>
          <div className="flex items-center gap-3">
            {social.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-500 hover:-translate-y-1 hover:border-gold-400 hover:bg-gold-400 hover:text-navy-950"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mt-10 lg:mt-14">
        <FooterWordmark />
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-center text-xs text-white/50 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} {business.brand}. All Rights Reserved.
          </p>
          <p>
            {business.legalName} · Nashik · Jalgaon
            {process.env.NEXT_PUBLIC_BUILD_DATE && (
              <>
                {" "}
                · Last updated{" "}
                <time dateTime={process.env.NEXT_PUBLIC_BUILD_DATE}>
                  {new Date(process.env.NEXT_PUBLIC_BUILD_DATE).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
