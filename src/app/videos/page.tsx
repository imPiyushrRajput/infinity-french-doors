import type { Metadata } from "next";
import { CtaBanner, PageHeader } from "@/components/Shared";
import VideoShowcase from "@/components/VideoShowcase";
import { aboutPage } from "@/data/site";

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
      <VideoShowcase />
      <CtaBanner />
    </>
  );
}
