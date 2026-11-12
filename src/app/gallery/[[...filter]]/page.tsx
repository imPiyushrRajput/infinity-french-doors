import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBanner, PageHeader } from "@/components/Shared";
import GalleryBrowser from "@/components/GalleryBrowser";
import { JsonLd, breadcrumbLd } from "@/lib/seo";
import { aboutPage, galleryCategories } from "@/data/site";

type Params = { filter?: string[] };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { filter } = await params;
  const active = filter?.[0] ?? "all";
  const cat = galleryCategories.find((c) => c.slug === active);
  const sub = cat && cat.slug !== "all";
  return {
    title: sub ? `${cat.label} Gallery` : "Gallery",
    description: sub
      ? `Photos of Infinity French Doors installations: ${cat.label.toLowerCase()}.`
      : "Photos of Infinity French Doors installations: doors, French windows, garden benches and XXL doors.",
    alternates: { canonical: active === "all" ? "/gallery" : `/gallery/${active}` },
  };
}

export function generateStaticParams(): Params[] {
  return [{ filter: [] }, ...galleryCategories.map((c) => ({ filter: [c.slug] }))];
}

export default async function GalleryPage({ params }: { params: Promise<Params> }) {
  const { filter } = await params;
  const active = filter?.[0] ?? "all";
  if (!galleryCategories.some((c) => c.slug === active) || (filter?.length ?? 0) > 1) notFound();

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Gallery", path: "/gallery" }])} />
      <PageHeader
        title="Gallery"
        subtitle="A closer look at the doors, windows and benches we have crafted."
        image={aboutPage.headerImage}
        crumbs={[{ label: "Gallery" }]}
      />
      <section className="py-16 lg:py-24">
        <div className="container-x">
          <GalleryBrowser initial={active} />
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
