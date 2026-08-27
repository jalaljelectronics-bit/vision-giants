/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // TODO: replace with the real backend/CDN host that serves
        // portfolio, blog, and team images (e.g. your CMS or S3 bucket).
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;