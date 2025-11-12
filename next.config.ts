import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  typescript: {
    ignoreBuildErrors: true,
  },

  reactStrictMode: false,
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hbzcmldbsbphlecnhldb.supabase.co',
        pathname: '/storage/v1/**',
      },
    ],
  },

  webpack: (config, { dev }) => {
    if (dev) {
     
      config.watchOptions = {
        ignored: ['**/*'], 
      };
    }
    return config;
  },
  eslint: {
    
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
