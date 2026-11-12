import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBanner, PageHeader, ProductCard, SectionHeading } from "@/components/Shared";
import { ArrowRight, CheckIcon, DownloadIcon } from "@/components/Icons";
import { ParallaxImage, ParallaxLayer } from "@/components/motion/Parallax";
import { Item, Reveal, Stagger, WordReveal, scaleIn } from "@/components/motion/Reveal";
import { Magnetic, TiltCard } from "@/components/motion/Interactive";
import { business, getProduct, products } from "@/data/site";
import { JsonLd, breadcrumbLd, productLd } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return [{ slug: "doors" }, ...products.map((p) => ({ slug: p.slug }))];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "doors") {
    return { title: "Our Doors & Windows", description: "Browse every door and window range by Infinity French Doors.", alternates: { canonical: "/products/doors" } };
  }
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description.slice(0, 160),
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { title: p.title, description: p.description.slice(0, 200), images: [{ url: p.mainImage }] },
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  if (slug === "doors") {
    return (
      <>
        <JsonLd data={breadcrumbLd([{ name: "Products", path: "/products/doors" }])} />
        <PageHeader
          title="Doors & Windows"
          subtitle="Every range we manufacture, from combination doors to XXL pivot doors."
          crumbs={[{ label: "Products" }]}
        />
        <section className="py-16 lg:py-24">
          <div className="container-x">
            <SectionHeading
              eyebrow="What We Provide"
              title="Choose your range"
              accent={["range"]}
              text="All products are fabricated from galvanised sheet sourced from Tata, Jindal and Pasco, with SS fittings and pure polyester powder coating."
            />
            <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p, i) => (
                <Item key={p.slug} className="h-full">
                  <ProductCard title={p.title} image={p.cardImage} href={`/products/${p.slug}`} index={i} />
                </Item>
              ))}
            </Stagger>
          </div>
        </section>
        <CtaBanner />
      </>
    );
  }

  const product = getProduct(slug);
  if (!product) notFound();

  const others = products.filter((p) => p.slug !== product.slug).slice(0, 4);
  const headingWords = product.heading.split(" ");
  const accent = headingWords.slice(-2);

  return (
    <>
      <JsonLd
        data={[
          productLd(product),
          breadcrumbLd([
            { name: "Products", path: "/products/doors" },
            { name: product.title, path: `/products/${product.slug}` },
          ]),
        ]}
      />
      <PageHeader
        title={product.title}
        crumbs={[{ label: "Products", href: "/products/doors" }, { label: product.title }]}
      />

      {/* Intro */}
      <section className="py-16 lg:py-24">
        <div className="container-x grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="relative">
            <ParallaxLayer distance={30} className="absolute -left-8 -top-8 h-52 w-52 rounded-full border border-gold-400/50" />
            <Reveal variants={scaleIn}>
              <ParallaxImage
                src={product.mainImage}
                alt={product.title}
                className="aspect-[4/5] rounded-[2rem] bg-white shadow-soft"
                strength={10}
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </Reveal>
          </div>
          <div>
            <Reveal>
              <span className="eyebrow">{product.title}</span>
            </Reveal>
            <WordReveal
              text={product.heading}
              accent={accent}
              className="h-display mt-4 text-4xl text-navy-950 sm:text-5xl lg:text-[3.2rem]"
            />
            <Reveal delay={0.2}>
              <p className="mt-7 leading-relaxed text-ink-500">{product.description}</p>
            </Reveal>
            {product.bullets && (
              <Stagger className="mt-7 grid gap-3 sm:grid-cols-2" delay={0.2}>
                {product.bullets.map((b) => (
                  <Item key={b.title}>
                    <div className="h-full rounded-2xl bg-white p-4 shadow-card ring-1 ring-navy-950/5 transition-transform duration-500 hover:-translate-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold-100 text-gold-600">
                          <CheckIcon className="h-3 w-3" />
                        </span>
                        <span className="text-sm font-semibold text-navy-950">{b.title}</span>
                      </div>
                      <p className="mt-2 text-sm text-ink-500">{b.text}</p>
                    </div>
                  </Item>
                ))}
              </Stagger>
            )}
            <Reveal delay={0.35}>
              <div className="mt-9 flex flex-wrap gap-4">
                <Magnetic>
                  <a href={business.brochure} target="_blank" rel="noreferrer" className="btn-primary">
                    <DownloadIcon className="h-4 w-4" /> Download Brochure
                  </a>
                </Magnetic>
                <Magnetic strength={0.25}>
                  <Link href="/contact-us" className="btn-outline">
                    Enquiry Now <ArrowRight className="h-4 w-4" />
                  </Link>
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Sub-products */}
      <section className="bg-cream-100 py-16 lg:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Options" title={`Explore our ${product.title}`} accent={product.title.split(" ")} align="center" />
          <Stagger className="mt-14 grid gap-6 md:grid-cols-3">
            {product.subProducts.map((sp) => (
              <Item key={sp.title}>
                <TiltCard className="group card h-full overflow-hidden" max={6}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={sp.image}
                      alt={sp.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-navy-950/0 transition-colors duration-700 group-hover:bg-navy-950/20" />
                  </div>
                  <div className="flex items-center justify-between gap-4 p-6">
                    <h3 className="font-display text-2xl font-medium text-navy-950">{sp.title}</h3>
                    <Link href="/contact-us" className="btn-outline shrink-0 !px-4 !py-2 !text-[10px]">
                      Enquiry
                    </Link>
                  </div>
                </TiltCard>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Other ranges */}
      <section className="py-16 lg:py-24">
        <div className="container-x">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading eyebrow="Keep exploring" title="Other ranges you may like" accent={["like"]} />
            <Reveal delay={0.3}>
              <Link href="/products/doors" className="btn-outline shrink-0">
                All products <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((p) => (
              <Item key={p.slug}>
                <ProductCard title={p.title} image={p.cardImage} href={`/products/${p.slug}`} />
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
