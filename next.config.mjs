/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Custom domain rewrites
      {
        source: '/',
        destination: '/custom/hyfreefire.com',
        has: [
          {
            type: 'host',
            value: 'hyfreefire.com',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
