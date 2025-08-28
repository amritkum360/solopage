/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Custom domain rewrites
      {
        source: '/',
        destination: '/custom-domain/:host',
        has: [
          {
            type: 'host',
            value: '(?!.*jirocash\.com)(?!.*localhost)(?!.*127\.0\.0\.1)(?!.*vercel\.app)(?!.*netlify\.app).*',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
