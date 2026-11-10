/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  eslint: {
    dirs: ["src/"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["assets.vercel.com"],
  },
};

module.exports = nextConfig;