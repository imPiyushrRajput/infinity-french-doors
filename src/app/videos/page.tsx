import type { Metadata } from "next";
import { CtaBanner, PageHeader, SectionHeading } from "@/components/Shared";
import { aboutPage, videos } from "@/data/site";

export const metadata: Metadata = {
  title: "Videos",
  description: "Watch Infinity French Doors products in action.",
  alternates: { canonical: "/videos" },
};

export default function VideosPage() {
  return (
    <>
      <PageHeader
        title="Videos"
        subtitle="See our doors and windows in motion."
        image={aboutPage.headerImage}
        crumbs={[{ label: "Gallery", href: "/gallery" }, { label: "Videos" }]}
      />
      <section className="py-16 lg:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Watch" title="Infinity on video" align="center" />
          <div className="mt-12 grid gap-8 lg:grid-cols-1">
            {videos.map((v) => (
              <figure key={v.embed} className="card mx-auto w-full max-w-4xl overflow-hidden">
                <div className="relative aspect-video bg-navy-950">
                  <iframe
                    src={v.embed}
                    title={v.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
                <figcaption className="px-6 py-5">
                  <h3 className="font-display text-xl text-navy-950">{v.title}</h3>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
