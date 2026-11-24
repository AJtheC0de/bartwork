import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // AVIF first, WebP fallback. Artwork deserves a slightly higher quality tier.
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
  },
  // Artworks were renamed once Blerta supplied their titles.
  async redirects() {
    return [
      { source: "/works/abstract-composition", destination: "/works/long-way-home", permanent: true },
      { source: "/works/allah-calligraphy", destination: "/works/and-he-is", permanent: true },
      { source: "/works/red-eagle", destination: "/works/shqiponja", permanent: true },
    ];
  },
  turbopack: {
    root: path.resolve(__dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
