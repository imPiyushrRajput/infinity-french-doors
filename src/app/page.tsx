import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import Counter from "@/components/Counter";
import KeyFeatures from "@/components/KeyFeatures";
import WorkingAreas from "@/components/WorkingAreas";
import { JsonLd, faqLd } from "@/lib/seo";
import type { Metadata } from "next";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import ContactBlock from "@/components/ContactBlock";
import { CtaBanner, ProductCard, SectionHeading } from "@/components/Shared";
import { ParallaxImage, ParallaxLayer } from "@/components/motion/Parallax";
import { Item, Reveal, Stagger, scaleIn } from "@/components/motion/Reveal";
import { Magnetic, TextMarquee, TiltCard } from "@/components/motion/Interactive";
import { ArrowRight, CheckIcon } from "@/components/Icons";
import {
  IMG,
  aboutHome,
  comparison,
  homeProjects,
  networkStats,
  presenceMap,
  products,
  stats,
  whyChooseUs,
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
      <section className="py-16 lg:py-24">
        <div className="container-x grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="order-2 lg:order-1">
            <SectionHeading eyebrow={whyChooseUs.eyebrow} title={whyChooseUs.heading} accent={["beautiful"]} />
            <Reveal delay={0.2}>
              <div className="prose-site mt-7 leading-relaxed text-ink-500">
                {whyChooseUs.paragraphs.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </Reveal>
            <Stagger className="mt-8 flex flex-wrap gap-2" stagger={0.05}>
              {["Mumbai", "Pune", "Chhatrapati Sambhajinagar", "Ahmedabad", "Vadodara", "Indore"].map((c) => (
                <Item key={c}>
                  <span className="inline-block rounded-full border border-navy-950/10 bg-white px-4 py-1.5 text-xs font-semibold text-navy-900 transition-all duration-500 hover:-translate-y-0.5 hover:border-gold-500 hover:bg-gold-100">
                    {c}
                  </span>
                </Item>
              ))}
            </Stagger>
          </div>
          <div className="relative order-1 lg:order-2">
            <ParallaxLayer distance={-30} className="absolute -right-6 -top-6 h-full w-full rounded-[2rem] border border-gold-400/40" />
            <Reveal variants={scaleIn}>
              <ParallaxImage
                src={whyChooseUs.image}
                alt="Infinity French Doors showroom"
                className="aspect-square rounded-[2rem] shadow-soft"
                strength={10}
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 1.8 Stats */}
      <section className="relative isolate overflow-hidden bg-navy-950 py-24 text-white lg:py-32">
        <ParallaxImage src={`${IMG}resources/bannersog.png`} alt="" className="absolute inset-0" imgClassName="opacity-25" strength={22} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950/70 to-navy-950" />
        <Stagger className="container-x relative grid gap-12 sm:grid-cols-2 lg:grid-cols-4" stagger={0.12}>
          {stats.map((s) => (
            <Item key={s.label} className="text-center lg:border-l lg:border-white/10 lg:first:border-0">
              <div className="font-display text-6xl font-medium text-gold-400 lg:text-7xl">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/60">{s.label}</div>
            </Item>
          ))}
        </Stagger>
      </section>

      {/* 1.9 Contact */}
      <ContactBlock />

      {/* 1.10 Comparison */}
      <section className="bg-cream-100 py-16 lg:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Know the difference"
            title="How Infinity compares"
            accent={["compares"]}
            text="Why galvanised steel French doors outperform aluminium sliders, fabricated channel gates and wooden doors."
            align="center"
          />
          <Reveal delay={0.2} className="card mt-14 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-navy-950 text-white">
                    <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-white/60">#</th>
                    <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-white/60">Type</th>
                    {comparison.columns.map((c, i) => (
                      <th
                        key={c}
                        className={`px-5 py-4 text-[11px] font-semibold uppercase tracking-wider ${
                          i === comparison.columns.length - 1 ? "bg-brand-600 text-white" : "text-white/80"
                        }`}
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.rows.map((r, ri) => (
                    <tr key={r.type} className="border-t border-navy-950/5 transition-colors odd:bg-white even:bg-cream-50 hover:bg-gold-100/40">
                      <td className="px-5 py-3.5 font-display italic text-ink-500">{ri + 1}</td>
                      <td className="px-5 py-3.5 font-semibold text-navy-950">{r.type}</td>
                      {r.values.map((v, vi) => (
                        <td
                          key={vi}
                          className={`px-5 py-3.5 align-top ${
                            vi === r.values.length - 1 ? "bg-brand-100/60 font-medium text-navy-950" : "text-ink-700"
                          }`}
                        >
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 1.11 Projects */}
      <section className="py-16 lg:py-24">
        <div className="container-x">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading eyebrow="Our Projects" title="Transforming Spaces with Excellence" accent={["excellence"]} />
            <Reveal delay={0.3}>
              <Link href="/projects/completed-projects" className="btn-outline shrink-0">
                See all projects <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <Stagger className="mt-14 grid gap-6 md:grid-cols-3">
            {homeProjects.map((p, i) => (
              <Item key={p.title} className="h-full">
                <TiltCard className="group card h-full overflow-hidden" max={5}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-navy-950/0 transition-colors duration-700 group-hover:bg-navy-950/20" />
                  </div>
                  <div className="p-7">
                    <span className="eyebrow">Project {String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-3 font-display text-2xl font-medium text-navy-950">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-500">{p.text}</p>
                  </div>
                </TiltCard>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 1.12 Testimonials */}
      <Testimonials />

      {/* 1.13 FAQ */}
      <section className="scroll-mt-24 py-16 lg:py-24" id="faq">
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
      <section className="relative overflow-hidden bg-navy-950 py-24 text-white lg:py-36">
        <div className="grid-pattern absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-[500px] w-[500px] rounded-full bg-brand-500/15 blur-3xl" />
        <div className="container-x relative grid items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Widespread Network"
              title="Our Presence Across Key Locations"
              accent={["key", "locations"]}
              text="Two manufacturing plants and a growing network of experience centers put Infinity within reach across Maharashtra and neighbouring states."
              light
            />
            <Stagger className="mt-10 grid grid-cols-2 gap-6" delay={0.2}>
              {networkStats.map((s) => (
                <Item key={s.label}>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors duration-500 hover:border-gold-400/40">
                    <div className="font-display text-5xl font-medium text-gold-400 sm:text-6xl">
                      <Counter value={s.value} suffix={s.suffix} />
                    </div>
                    <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">{s.label}</div>
                  </div>
                </Item>
              ))}
            </Stagger>
          </div>
          <Reveal variants={scaleIn} className="lg:col-span-7">
            <TiltCard className="overflow-hidden rounded-[2rem] bg-white/5 p-3 ring-1 ring-white/10" max={4} glare={false}>
              <Image
                src={presenceMap}
                alt="Map of Infinity French Doors locations"
                width={1200}
                height={900}
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="w-full rounded-[1.5rem] object-cover"
              />
            </TiltCard>
          </Reveal>
        </div>
      </section>
    </>
  );
}
