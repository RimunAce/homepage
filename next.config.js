const remotePatterns = require("./app/lib/image-hosts.json");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 127.0.0.1 is a different dev origin from localhost; blocked HMR cancels client fetches.
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    remotePatterns,
  },
};

module.exports = nextConfig;
