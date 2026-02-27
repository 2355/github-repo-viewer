import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  redirects: async () => [
    {
      source: "/",
      destination: "/search",
      permanent: true,
    },
  ],
};

export default nextConfig;
