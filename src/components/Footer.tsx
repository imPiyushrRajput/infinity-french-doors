import Image from "next/image";
import Link from "next/link";
import { business, products } from "@/data/site";
import { FacebookIcon, MailIcon, PhoneIcon, PinIcon, TwitterIcon, WhatsappIcon, YoutubeIcon } from "./Icons";
import { Reveal } from "./motion/Reveal";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Projects", href: "/projects/completed-projects" },
  { label: "Gallery", href: "/gallery" },
  { label: "Videos", href: "/videos" },
  { label: "Contact Us", href: "/contact-us" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white/70">
      <div className="grid-pattern pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />
      <span className="text-outline pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[9rem] font-semibold leading-none tracking-tight sm:text-[14rem] lg:text-[20rem]">
        INFINITY
      </span>

      <div className="container-x relative grid gap-12 py-20 md:grid-cols-2 lg:grid-cols-12 lg:py-28">
        <Reveal className="lg:col-span-4">
          <div className="inline-block rounded-xl bg-white px-4 py-3 transition-transform duration-500 hover:-translate-y-0.5">
            <Image src={business.logo} alt={business.brand} width={170} height={80} className="h-11 w-auto" />
          </div>
          <p className="mt-6 max-w-sm text-sm leading-relaxed">
            Manufacturers of galvanised steel French doors, safety doors, French windows and XXL
            doors since 2012. Designed in Nashik, powder coated to last, and installed across
            Maharashtra and beyond.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {[
              { Icon: FacebookIcon, href: business.social.facebook, label: "Facebook" },
              { Icon: TwitterIcon, href: business.social.twitter, label: "Twitter" },
              { Icon: WhatsappIcon, href: business.social.whatsapp, label: "WhatsApp" },
              { Icon: YoutubeIcon, href: business.social.youtube, label: "YouTube" },
            ].map(({ Icon, href, label }) => (
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
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-2">
          <h3 className="font-display text-2xl font-medium text-white">Quick Links</h3>
          <ul className="mt-5 space-y-2.5 text-sm">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-underline transition-colors hover:text-gold-400">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.2} className="lg:col-span-3">
          <h3 className="font-display text-2xl font-medium text-white">Products</h3>
          <ul className="mt-5 space-y-2.5 text-sm">
            {products.map((p) => (
              <li key={p.slug}>
                <Link href={`/products/${p.slug}`} className="link-underline transition-colors hover:text-gold-400">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.3} className="lg:col-span-3">
          <h3 className="font-display text-2xl font-medium text-white">Contact Us</h3>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3">
              <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
              <div className="flex flex-col">
                {business.phones.map((p) => (
                  <a key={p.href} href={p.href} className="hover:text-white">
                    {p.label}
                  </a>
                ))}
              </div>
            </li>
            <li className="flex gap-3">
              <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
              <a href={`mailto:${business.email}`} className="break-all hover:text-white">
                {business.email}
              </a>
            </li>
            {business.plants.map((pl) => (
              <li key={pl.name} className="flex gap-3">
                <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-white/50">{pl.name}</div>
                  <div className="leading-relaxed">{pl.address}</div>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 sm:flex-row">
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
