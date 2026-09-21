/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.image2url.com',
      },
      {
        protocol: 'https',
        hostname: 'image2url.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  serverExternalPackages: ['@prisma/client'],
};

export default nextConfig;
