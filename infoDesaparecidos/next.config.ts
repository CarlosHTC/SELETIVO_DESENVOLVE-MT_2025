import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração para SPA mode
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
