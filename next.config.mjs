/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/analisa",
        permanent: true, // Set to `true` if the redirect should be cached by the browser
      },
    ];
  },
  httpTimeout: 10 * 60 * 1000, // 10 minutes
  // Optional: Enable edge runtime
  runtime: "edge",
};

export default nextConfig;
