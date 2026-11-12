import type { MetadataRoute } from "next";
import { galleryCategories, products, projectPages } from "@/data/site";
import { abs } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entry = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly") => ({
    url: abs(path),
    lastModified: now,
    changeFrequency,
    priority,
  });
  return [
    entry("/", 1, "weekly"),
    entry("/about-us", 0.8),
    entry("/products/doors", 0.9, "weekly"),
    ...products.map((p) => entry(`/products/${p.slug}`, 0.9)),
    ...projectPages.map((p) => entry(`/projects/${p.slug}`, 0.6)),
    entry("/gallery", 0.7),
    ...galleryCategories.filter((c) => c.slug !== "all").map((c) => entry(`/gallery/${c.slug}`, 0.5)),
    entry("/videos", 0.5),
    entry("/contact-us", 0.8),
  ];
}
