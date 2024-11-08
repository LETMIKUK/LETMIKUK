/** @type {import('next').NextConfig} */
const nextConfig = {
   eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during builds
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/analisa",
        permanent: true, // Set to `true` if the redirect should be cached by the browser
      },
    ];
  },
};

export default nextConfig;
