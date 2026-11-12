import type { MetadataRoute } from "next";
import { NOINDEX, abs } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: NOINDEX ? [{ userAgent: "*", disallow: "/" }] : [{ userAgent: "*", allow: "/" }],
    sitemap: abs("/sitemap.xml"),
  };
}
