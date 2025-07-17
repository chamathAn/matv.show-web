import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net",
        pathname: "/images/anime/**", // allow any subpath under /images/anime
      },
    ],
  },
};

export default nextConfig;
