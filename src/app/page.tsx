import Link from "next/link";
import Hero from "@/components/Hero";
import Counter from "@/components/Counter";
import KeyFeatures from "@/components/KeyFeatures";
import WorkingAreas from "@/components/WorkingAreas";
import Presence from "@/components/Presence";
import Comparison from "@/components/Comparison";
import WhyChooseUs from "@/components/WhyChooseUs";
import HomeProjects from "@/components/HomeProjects";
import StatsBand from "@/components/StatsBand";
import { JsonLd, faqLd } from "@/lib/seo";
import type { Metadata } from "next";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import ContactBlock from "@/components/ContactBlock";
import { CtaBanner, ProductCard, SectionHeading } from "@/components/Shared";
import { ParallaxImage, ParallaxLayer } from "@/components/motion/Parallax";
import { Item, Reveal, Stagger, scaleIn } from "@/components/motion/Reveal";
import { Magnetic, TextMarquee } from "@/components/motion/Interactive";
import { ArrowRight, CheckIcon } from "@/components/Icons";
import {
  aboutHome,
  products,
} from "@/data/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqLd()} />
      <Hero />

      {/* 1.2 About */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="pointer-events-none absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-brand-100/70 blur-3xl" />
        <div className="container-x grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="relative">
            <ParallaxLayer distance={30} className="absolute -left-8 -top-8 h-44 w-44 rounded-full border border-gold-400/50" />
            <ParallaxLayer distance={-40} className="absolute -bottom-10 -right-10 h-72 w-72 rounded-[2rem] bg-brand-100" />
            <Reveal variants={scaleIn} className="relative">
              <ParallaxImage
                src={aboutHome.image}
                alt="Infinity French Doors installation"
                className="aspect-[4/5] rounded-[2rem] shadow-soft"
                strength={10}
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </Reveal>
            <Reveal delay={0.4} className="absolute -bottom-8 left-6 sm:left-10">
              <div className="rounded-2xl bg-navy-950 px-7 py-6 text-white shadow-soft ring-1 ring-white/10">
                <div className="font-display text-5xl font-medium text-gold-400">
                  <Counter value={aboutHome.counter.value} suffix="+" />
                </div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">
                  {aboutHome.counter.label}
                </div>
              </div>
            </Reveal>
          </div>

          <div>
            <SectionHeading eyebrow={aboutHome.eyebrow} title={aboutHome.heading} accent={["window", "solutions"]} />
            <Reveal delay={0.2}>
              <p className="mt-7 font-display text-2xl italic text-navy-900">{aboutHome.intro}</p>
            </Reveal>
            <Stagger className="mt-7 grid gap-3 sm:grid-cols-2" delay={0.2}>
              {aboutHome.points.map((p) => (
                <Item key={p}>
                  <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-card ring-1 ring-navy-950/5 transition-transform duration-500 hover:-translate-y-0.5">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-600">
                      <CheckIcon className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm font-semibold text-navy-950">{p}</span>
                  </div>
                </Item>
              ))}
            </Stagger>
            <Reveal delay={0.3}>
              <p className="mt-7 leading-relaxed text-ink-500">{aboutHome.body}</p>
            </Reveal>
            <Reveal delay={0.4}>
              <Magnetic>
                <Link href="/about-us" className="btn-primary mt-9">
                  Read More <ArrowRight className="h-4 w-4" />
                </Link>
              </Magnetic>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="border-y border-navy-950/5 bg-cream-100 py-6">
        <TextMarquee items={["French Doors", "Safety Doors", "French Windows", "Balcony Doors", "Terrace Doors", "XXL Doors", "Garden Benches"]} />
      </div>

      {/* 1.3 Products */}
      <section className="bg-cream-100 py-16 lg:py-24">
        <div className="container-x">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="What We Provide"
              title="Our Products"
              accent={["products"]}
              text="From elegant French windows to heavy-duty safety doors, every piece is fabricated from galvanised steel and finished in pure polyester powder coating."
            />
            <Reveal delay={0.3}>
              <Link href="/products/doors" className="btn-outline shrink-0">
                View all products <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
            {products.map((p, i) => (
              <Item key={p.slug} className="h-full">
                <ProductCard title={p.title} image={p.cardImage} href={`/products/${p.slug}`} index={i} />
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 1.4 Key features (scroll story + 3D) */}
      <KeyFeatures />

      {/* 1.5 Working areas (network map + clients) */}
      <WorkingAreas />

      <CtaBanner />

      {/* 1.7 Why choose us */}
      <WhyChooseUs />

      {/* 1.8 Stats */}
      <StatsBand />

      {/* 1.10 Comparison */}
      <Comparison />

      {/* 1.11 Projects */}
      <HomeProjects />

      {/* 1.12 Testimonials */}
      <Testimonials />

      {/* 1.9 Contact (moved below testimonials so the page ends on enquiry, FAQ and locations) */}
      <ContactBlock />

      {/* 1.13 FAQ */}
      <section className="scroll-mt-24 bg-cream-100 py-16 lg:py-24" id="faq">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow="FAQ"
              title="Frequently Asked Questions"
              accent={["questions"]}
              text="Answers to the questions we hear most often about our doors, windows and installation."
            />
            <Reveal delay={0.3}>
              <div className="mt-8 rounded-2xl bg-brand-100 p-6">
                <p className="text-sm font-semibold text-navy-950">Still have a question?</p>
                <p className="mt-1 text-sm text-ink-500">Our team is happy to help you choose the right product.</p>
                <Link href="/contact-us" className="btn-primary mt-4 !py-2.5">
                  Ask us <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="lg:col-span-8">
            <Faq />
          </Reveal>
        </div>
      </section>

      {/* 1.14 Presence map + 1.15 network stats */}
      <Presence />
    </>
  );
}
