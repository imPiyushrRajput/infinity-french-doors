import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Stamped at build time; shown as "Last updated" in the footer.
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString(),
  },
  images: {
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
};

export default nextConfig;
