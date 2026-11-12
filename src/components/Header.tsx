"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { business, nav } from "@/data/site";
import {
  ChevronDown,
  CloseIcon,
  FacebookIcon,
  LinkedinIcon,
  MailIcon,
  MenuIcon,
  PhoneIcon,
  TwitterIcon,
} from "./Icons";
import SiteSearch, { SearchButton } from "./SiteSearch";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // Cmd/Ctrl+K opens search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer whenever the route changes (state adjustment during render).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("/").slice(0, 2).join("/"));

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div
        className={`hidden bg-navy-950 text-white/80 transition-all duration-300 lg:block ${
          scrolled ? "max-h-0 overflow-hidden opacity-0" : "max-h-12 opacity-100"
        }`}
      >
        <div className="container-x flex h-10 items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <PhoneIcon className="h-3.5 w-3.5 text-gold-400" />
              <span className="text-white/60">Call Us</span>
              {business.phones.map((p, i) => (
                <span key={p.href} className="flex items-center gap-2">
                  {i > 0 && <span className="text-white/30">·</span>}
                  <a href={p.href} className="hover:text-white">
                    {p.label}
                  </a>
                </span>
              ))}
            </span>
            <span className="flex items-center gap-2">
              <MailIcon className="h-3.5 w-3.5 text-gold-400" />
              <span className="text-white/60">Send Email</span>
              <a href={`mailto:${business.email}`} className="hover:text-white">
                {business.email}
              </a>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/50">Follow us</span>
            <a href={business.social.facebook} aria-label="Facebook" className="hover:text-gold-400">
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a href={business.social.twitter} aria-label="Twitter" className="hover:text-gold-400">
              <TwitterIcon className="h-3.5 w-3.5" />
            </a>
            <a href={business.social.linkedin} aria-label="LinkedIn" className="hover:text-gold-400">
              <LinkedinIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div
        className={`border-b transition-all duration-300 ${
          scrolled
            ? "border-navy-950/10 bg-white/90 shadow-[0_8px_30px_-16px_rgb(7_18_38_/_0.35)] backdrop-blur-xl"
            : "border-transparent bg-white"
        }`}
      >
        <div className="container-x flex h-[76px] items-center justify-between gap-6">
          <Link href="/" className="relative flex shrink-0 items-center" aria-label={business.brand}>
            <Image
              src={business.logo}
              alt={business.brand}
              width={180}
              height={84}
              priority
              className="h-12 w-auto object-contain transition-transform duration-500 hover:scale-[1.03]"
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {nav.map((item) => (
              <div key={item.label} className="group relative focus-within:z-30">
                <Link
                  href={item.href}
                  data-active={isActive(item.href)}
                  className={`link-underline mx-2 flex shrink-0 items-center gap-1 whitespace-nowrap py-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 xl:mx-3 xl:text-[13px] xl:tracking-[0.14em] ${
                    isActive(item.href) ? "text-brand-600" : "text-ink-700 hover:text-navy-950"
                  }`}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
                  )}
                </Link>
                {item.children && (
                  <div className="invisible absolute left-1/2 top-full z-20 w-60 -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <div className="overflow-hidden rounded-2xl border border-navy-950/5 bg-white p-2 shadow-soft">
                      {item.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className={`block rounded-xl px-4 py-2.5 text-[13.5px] font-medium transition hover:bg-cream-100 hover:text-brand-600 ${
                            pathname === c.href ? "text-brand-600" : "text-ink-700"
                          }`}
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <SearchButton onOpen={() => setSearchOpen(true)} />
            <Link href="/contact-us" className="btn-primary hidden shrink-0 whitespace-nowrap !px-5 !py-2.5 sm:inline-flex xl:!px-7">
              Enquiry Now
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy-950/10 text-navy-950 lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[60] lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
        inert={!open}
      >
        <div
          className={`absolute inset-0 bg-navy-950/60 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-navy-950/10 px-5 py-4">
            <Image src={business.logo} alt={business.brand} width={140} height={66} className="h-10 w-auto" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy-950/10"
              aria-label="Close menu"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile">
            {nav.map((item) => (
              <div key={item.label} className="border-b border-navy-950/5 last:border-0">
                {item.children ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                      className="flex w-full items-center justify-between px-3 py-3.5 text-left text-[15px] font-semibold text-navy-950"
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${expanded === item.label ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      className={`grid transition-all duration-300 ${
                        expanded === item.label ? "grid-rows-[1fr] pb-2" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        {item.children.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            className="block rounded-lg px-6 py-2.5 text-sm text-ink-700 hover:bg-cream-100 hover:text-brand-600"
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-3 py-3.5 text-[15px] font-semibold text-navy-950"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
          <div className="space-y-3 border-t border-navy-950/10 p-5">
            <Link href="/contact-us" className="btn-primary w-full">
              Enquiry Now
            </Link>
            <div className="flex flex-col gap-1 text-sm text-ink-700">
              {business.phones.map((p) => (
                <a key={p.href} href={p.href} className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4 text-brand-600" /> {p.label}
                </a>
              ))}
              <a href={`mailto:${business.email}`} className="flex items-center gap-2">
                <MailIcon className="h-4 w-4 text-brand-600" /> {business.email}
              </a>
            </div>
          </div>
        </div>
      </div>
      <SiteSearch open={searchOpen} onClose={closeSearch} />
    </header>
  );
}
