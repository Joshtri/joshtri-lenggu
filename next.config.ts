import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    dangerouslyAllowLocalIP: true,
    disableStaticImages: true,
    qualities: [25, 50, 75, 100],

    remotePatterns:[
      {
        protocol: 'https',
        hostname: '**',
      },
    ]
  }
};

export default nextConfig;
