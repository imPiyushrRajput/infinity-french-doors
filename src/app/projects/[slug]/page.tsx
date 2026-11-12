import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBanner, PageHeader, SectionHeading } from "@/components/Shared";
import ProjectsBrowser from "@/components/ProjectsBrowser";
import { JsonLd, breadcrumbLd } from "@/lib/seo";
import { getProjectPage, projectPages } from "@/data/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projectPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getProjectPage(slug);
  return page ? { title: page.title, description: page.intro, alternates: { canonical: `/projects/${page.slug}` } } : {};
}

export default async function ProjectsPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = getProjectPage(slug);
  if (!page) notFound();

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: page.title, path: `/projects/${page.slug}` }])} />
      <PageHeader title={page.title} subtitle={page.intro} crumbs={[{ label: "Projects" }, { label: page.title }]} />

      <section className="py-16 lg:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Our Projects" title="Transforming spaces, stage by stage" accent={["stage"]} />
          <div className="mt-10">
            <ProjectsBrowser initial={page.slug} />
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
