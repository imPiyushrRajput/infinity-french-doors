import type { Metadata } from "next";
import Image from "next/image";
import { CtaBanner, PageHeader, SectionHeading } from "@/components/Shared";
import { ImageGrid } from "@/components/Lightbox";
import { EyeIcon, TargetIcon } from "@/components/Icons";
import { ParallaxImage, ParallaxLayer } from "@/components/motion/Parallax";
import { Item, Reveal, Stagger, WordReveal, scaleIn } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/Interactive";
import { aboutPage } from "@/data/site";
import DoorAssembly from "@/components/DoorAssembly";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Infinity French Doors has manufactured premium galvanised steel doors and windows in Nashik since 2012. Meet our leadership and see our journey.",
  alternates: { canonical: "/about-us" },
};

export default function AboutPage() {
  const { welcome, vision, leadership, timeline, highlights, process } = aboutPage;
  return (
    <>
      <PageHeader
        title="About Us"
        subtitle="Thirteen years of craftsmanship in galvanised steel doors and windows."
        image={aboutPage.headerImage}
        crumbs={[{ label: "About Us" }]}
      />

      {/* 2.2 Welcome */}
      <section className="py-16 lg:py-24">
        <div className="container-x grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <Reveal>
              <span className="eyebrow">Who we are</span>
            </Reveal>
            <WordReveal
              text={welcome.heading}
              accent={["infinity", "french", "doors"]}
              className="h-display mt-4 text-4xl text-navy-950 sm:text-5xl lg:text-[3.4rem]"
            />
            <Reveal delay={0.2}>
              <div className="prose-site mt-7 leading-relaxed text-ink-500">
                {welcome.paragraphs.map((p) => (
                  <p key={p.slice(0, 30)}>{p}</p>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="relative">
            <ParallaxLayer distance={-35} className="absolute -bottom-8 -left-8 h-2/3 w-2/3 rounded-[2rem] bg-gold-100" />
            <Reveal variants={scaleIn}>
              <ParallaxImage
                src={welcome.image}
                alt="Infinity French Doors office"
                className="aspect-[5/4] rounded-[2rem] shadow-soft"
                strength={10}
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </Reveal>
            <Reveal delay={0.4} className="absolute -top-8 right-6">
              <div className="rounded-2xl bg-navy-950 px-6 py-5 text-white shadow-soft ring-1 ring-white/10">
                <div className="font-display text-4xl font-medium text-gold-400">Est. 2012</div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">Nashik, India</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2.3 Vision & Mission */}
      <section className="relative overflow-hidden bg-navy-950 py-24 text-white lg:py-36">
        <div className="grid-pattern absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="container-x relative">
          <SectionHeading eyebrow={vision.eyebrow} title={vision.heading} accent={["mission"]} align="center" light />
          <Stagger className="mt-16 grid gap-6 md:grid-cols-2" stagger={0.15}>
            {vision.items.map((v, i) => {
              const Icon = i === 0 ? EyeIcon : TargetIcon;
              return (
                <Item key={v.title}>
                  <TiltCard
                    className="group h-full rounded-[2rem] border border-white/10 bg-white/5 p-9 backdrop-blur-sm transition-colors duration-700 hover:border-gold-400/50 sm:p-11"
                    max={5}
                  >
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500 text-navy-950 transition-transform duration-700 group-hover:rotate-[-8deg] group-hover:scale-105">
                      <Icon className="h-7 w-7" />
                    </span>
                    <h3 className="mt-7 font-display text-3xl font-medium">{v.title}</h3>
                    <p className="mt-4 leading-relaxed text-white/70">{v.text}</p>
                  </TiltCard>
                </Item>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* 2.4 Leadership */}
      <section className="py-16 lg:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Leadership"
            title="The People Behind Infinity"
            accent={["infinity"]}
            text="A founding team that combines hands-on manufacturing know-how with disciplined financial stewardship."
            align="center"
          />
          <div className="mt-20 space-y-20 lg:space-y-28">
            {leadership.map((l, i) => (
              <div key={l.name} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                <div className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <Reveal variants={scaleIn} className="relative mx-auto max-w-sm">
                    <ParallaxLayer
                      distance={-25}
                      className={`absolute -z-10 h-full w-full rounded-[2rem] bg-brand-100 ${
                        i % 2 === 1 ? "-right-5 -top-5" : "-left-5 -top-5"
                      }`}
                    >
                      <span />
                    </ParallaxLayer>
                    <TiltCard className="overflow-hidden rounded-[2rem] bg-white shadow-soft" max={5}>
                      <Image
                        src={l.image}
                        alt={l.name}
                        width={600}
                        height={720}
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        className="aspect-[5/6] w-full object-cover object-top"
                      />
                    </TiltCard>
                  </Reveal>
                </div>
                <div className={`lg:col-span-7 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <Reveal>
                    <span className="eyebrow">{l.role}</span>
                  </Reveal>
                  <WordReveal as="h3" text={l.name} className="h-display mt-4 text-4xl text-navy-950 sm:text-5xl" />
                  <Reveal delay={0.2}>
                    <p className="mt-6 leading-relaxed text-ink-500">{l.text}</p>
                  </Reveal>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2.5 Timeline */}
      <section className="bg-cream-100 py-16 lg:py-24">
        <div className="container-x">
          <SectionHeading eyebrow={timeline.eyebrow} title={timeline.heading} accent={["excellence"]} align="center" />
          <Stagger className="relative mt-20 grid gap-10 md:grid-cols-2 lg:grid-cols-4" stagger={0.15}>
            <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent lg:block" />
            {timeline.items.map((t) => (
              <Item key={t.year} className="group relative">
                <div className="relative z-10 inline-flex h-12 items-center rounded-full bg-navy-950 px-5 font-display text-xl font-medium text-gold-400 shadow-soft transition-transform duration-500 group-hover:-translate-y-1">
                  {t.year}
                </div>
                <h3 className="mt-6 font-display text-2xl font-medium text-navy-950">{t.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">{t.text}</p>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 2.6 Office highlights */}
      <section className="py-16 lg:py-24">
        <div className="container-x">
          <SectionHeading eyebrow={highlights.eyebrow} title={highlights.heading} accent={["highlights"]} text={highlights.intro} />
          <Reveal delay={0.2} className="mt-14">
            <ImageGrid items={highlights.items.map((h) => ({ src: h.image, caption: h.title, alt: h.title }))} />
          </Reveal>
        </div>
      </section>

      <CtaBanner />

      {/* 3D: a door assembling itself on scroll */}
      <DoorAssembly />

      {/* 2.8 Work process */}
      <section className="py-16 lg:py-24">
        <div className="container-x">
          <SectionHeading eyebrow={process.eyebrow} title="Our Work Process" accent={["process"]} align="center" />
          <Stagger className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {process.steps.map((s, i) => (
              <Item key={s.title}>
                <TiltCard className="group card relative h-full p-8" max={6}>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-navy-950 font-display text-xl font-medium text-gold-400 transition-transform duration-500 group-hover:scale-110">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px w-16 bg-gold-400/60 transition-all duration-700 group-hover:w-28" />
                  </div>
                  <h3 className="mt-7 font-display text-2xl font-medium text-navy-950">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-500">{s.text}</p>
                </TiltCard>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
