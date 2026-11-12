"use client";

import { useState } from "react";
import { business } from "@/data/site";
import { ArrowRight, CheckIcon, MailIcon, PhoneIcon, PinIcon } from "./Icons";
import { SectionHeading } from "./Shared";
import CopyButton from "./CopyButton";

type Status = "idle" | "sending" | "sent" | "drafted" | "error";

/** Optional form service (Formspree, Web3Forms, Getform...). Without it the visitor's email app opens pre-filled. */
const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

const FIELD_LABELS: Record<string, string> = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  phone: "Phone",
  message: "Message",
};
type Errors = Partial<Record<"firstName" | "lastName" | "email" | "phone" | "message", string>>;

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
const UTM_STORAGE = "ifd-utm";

/** Read UTM parameters from the URL (first landing) or the session. Never rendered, so safe to differ from SSR. */
function readUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    UTM_KEYS.forEach((k) => {
      const v = params.get(k);
      if (v) found[k] = v;
    });
    if (Object.keys(found).length) {
      found.landing = window.location.pathname;
      found.referrer = document.referrer;
      sessionStorage.setItem(UTM_STORAGE, JSON.stringify(found));
      return found;
    }
    const stored = sessionStorage.getItem(UTM_STORAGE);
    return stored ? (JSON.parse(stored) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function useUtm() {
  const [utm] = useState<Record<string, string>>(readUtm);
  return utm;
}

function validate(data: Record<string, string>): Errors {
  const e: Errors = {};
  if (!data.firstName?.trim()) e.firstName = "Please enter your first name.";
  if (!data.lastName?.trim()) e.lastName = "Please enter your last name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email ?? "")) e.email = "Enter a valid email address.";
  if ((data.phone ?? "").replace(/\D/g, "").length < 10) e.phone = "Enter a phone number with at least 10 digits.";
  if ((data.message ?? "").trim().length < 10) e.message = "Tell us a little more (at least 10 characters).";
  return e;
}

export default function ContactBlock({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const utm = useUtm();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    if (!FORM_ENDPOINT) {
      const name = [data.firstName, data.lastName].filter(Boolean).join(" ");
      const body = Object.entries(data)
        .filter(([, v]) => v)
        .map(([k, v]) => `${FIELD_LABELS[k] ?? k}: ${v}`)
        .join("\n");
      const subject = `Website enquiry from ${name || "a visitor"}`;
      window.location.href = `mailto:${business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("drafted");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...data, utm, page: window.location.pathname }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const field = (
    name: keyof Errors,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-700">{label}</span>
      <input
        name={name}
        required
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        onChange={() => errors[name] && setErrors((prev) => ({ ...prev, [name]: undefined }))}
        className={`input ${errors[name] ? "!border-red-500 !ring-4 !ring-red-500/10" : ""}`}
        {...props}
      />
      {errors[name] && (
        <span id={`${name}-error`} role="alert" className="mt-1.5 block text-xs font-medium text-red-600">
          {errors[name]}
        </span>
      )}
    </label>
  );

  return (
    <section className={`relative overflow-hidden ${compact ? "py-16 lg:py-20" : "py-16 lg:py-24"}`}>
      <div className="pointer-events-none absolute -right-40 top-10 h-[480px] w-[480px] rounded-full bg-brand-100 blur-3xl" />
      <div className="container-x relative grid gap-12 lg:grid-cols-5 lg:gap-16">
        <div className="lg:col-span-3">
          <SectionHeading
            eyebrow="Our Contact"
            title="Reach Out to Us"
            accent={["us"]}
            text="Tell us about your project and our team will get back to you with options, sizes and a quote."
          />
          <form onSubmit={onSubmit} noValidate className="card mt-10 grid gap-5 p-6 sm:grid-cols-2 sm:p-8" aria-busy={status === "sending"}>
            {field("firstName", "First Name", { placeholder: "Priya", autoComplete: "given-name" })}
            {field("lastName", "Last Name", { placeholder: "Sharma", autoComplete: "family-name" })}
            {field("email", "Email Address", { type: "email", placeholder: "you@example.com", autoComplete: "email", inputMode: "email" })}
            {field("phone", "Phone Number", { type: "tel", placeholder: "+91 98765 43210", autoComplete: "tel", inputMode: "tel" })}
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-700">Write a Message</span>
              <textarea
                name="message"
                rows={5}
                required
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
                onChange={() => errors.message && setErrors((prev) => ({ ...prev, message: undefined }))}
                className={`input resize-y ${errors.message ? "!border-red-500 !ring-4 !ring-red-500/10" : ""}`}
                placeholder="Which product are you interested in? Approximate size and location help us respond faster."
              />
              {errors.message && (
                <span id="message-error" role="alert" className="mt-1.5 block text-xs font-medium text-red-600">
                  {errors.message}
                </span>
              )}
            </label>
            <div className="flex flex-wrap items-center gap-4 sm:col-span-2" aria-live="polite">
              <button type="submit" disabled={status === "sending"} className="btn-primary disabled:opacity-60">
                {status === "sending" ? "Sending…" : "Submit"} <ArrowRight className="h-4 w-4" />
              </button>
              {status === "sent" && (
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 ring-1 ring-emerald-200">
                  <CheckIcon className="h-4 w-4" /> Thank you! We&apos;ll be in touch within one working day.
                </span>
              )}
              {status === "drafted" && (
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 ring-1 ring-emerald-200">
                  <CheckIcon className="h-4 w-4" /> Your email app has opened with the enquiry ready. Just press send.
                </span>
              )}
              {status === "error" && (
                <span role="alert" className="rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-700 ring-1 ring-red-200">
                  Something went wrong. Please call us or email {business.email}.
                </span>
              )}
            </div>
          </form>
        </div>

        <aside className="lg:col-span-2">
          <div className="relative h-full overflow-hidden rounded-3xl bg-navy-950 p-8 text-white sm:p-10">
            <div className="grid-pattern absolute inset-0 opacity-70" />
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold-500/20 blur-2xl" />
            <div className="relative space-y-8">
              <div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-gold-400">
                    <PhoneIcon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-2xl font-medium">Call Us</h3>
                </div>
                <div className="mt-3 flex flex-col gap-2 pl-14 text-white/85">
                  {business.phones.map((p) => (
                    <div key={p.href} className="flex items-center gap-3">
                      <a href={p.href} className="hover:text-gold-400">
                        {p.label}
                      </a>
                      <CopyButton value={p.label.replace(/\s/g, "")} light />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-gold-400">
                    <MailIcon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-2xl font-medium">Send Email</h3>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 pl-14 text-white/85">
                  <a href={`mailto:${business.email}`} className="break-all hover:text-gold-400">
                    {business.email}
                  </a>
                  <CopyButton value={business.email} light />
                </div>
              </div>
              {business.plants.map((pl) => (
                <div key={pl.name}>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-gold-400">
                      <PinIcon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-2xl font-medium">{pl.name}</h3>
                  </div>
                  <p className="mt-3 pl-14 text-sm leading-relaxed text-white/85">{pl.address}</p>
                  <div className="mt-2 pl-14">
                    <CopyButton value={pl.address} label="Copy address" light />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
