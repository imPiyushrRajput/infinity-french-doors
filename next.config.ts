import type { NextConfig } from "next";

// GITHUB_PAGES=true builds a static export served from /<repo>/ (see .github/workflows/pages.yml).
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = isPages ? `/${process.env.PAGES_REPO ?? "infinity-french-doors"}` : "";

const nextConfig: NextConfig = {
  ...(isPages ? { output: "export" as const, trailingSlash: true } : {}),
  basePath,
  env: {
    // Stamped at build time; shown as "Last updated" in the footer.
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString(),
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_TRAILING_SLASH: isPages ? "1" : "",
  },
  images: {
    // Static hosting has no image optimiser; images are served as-is.
    unoptimized: isPages,
    remotePatterns: [
      { protocol: "https", hostname: "www.infinitywindoors.com" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Redirects need a server; static exports skip them.
  ...(isPages
    ? {}
    : {
        async redirects() {
          return [
            { source: "/products/garden-banches", destination: "/products/garden-benches", permanent: true },
            { source: "/gallery/garden-banches", destination: "/gallery/garden-benches", permanent: true },
            { source: "/gallery/all", destination: "/gallery", permanent: false },
            { source: "/safty-doors", destination: "/products/safety-doors", permanent: true },
            { source: "/customise-doors", destination: "/products/customise-doors", permanent: true },
            { source: "/designer-doors", destination: "/products/designer-doors", permanent: true },
            { source: "/commercial-doors", destination: "/products/commercial-doors", permanent: true },
            { source: "/french-windows", destination: "/products/french-windows", permanent: true },
            { source: "/garden-banches", destination: "/products/garden-benches", permanent: true },
            { source: "/xxl-doors", destination: "/products/xxl-doors", permanent: true },
          ];
        },
      }),
};

export default nextConfig;
