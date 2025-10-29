/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.apis.rocks",
      },
      {
        protocol: "https",
        hostname: "apis-rocks.b-cdn.net",
      },
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "www.respire.my",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "beboxed.net",
      },
      {
        protocol: "https",
        hostname: "other.respire.my",
      }
    ],
  },
};

module.exports = nextConfig;
