import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: "/",
      destination: "/search",
      permanent: true,
    },
  ],
};

export default nextConfig;
