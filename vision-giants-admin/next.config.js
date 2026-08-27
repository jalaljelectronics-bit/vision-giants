// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    // Cloudinary-hosted images (services, portfolio, blog, team, testimonials)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },

  async headers() {
    return [
      {
        // Belt-and-suspenders alongside the <meta robots> tag in _document.tsx —
        // this covers crawlers that ignore meta tags but respect HTTP headers.
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;