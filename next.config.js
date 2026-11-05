const remotePatterns = require("./app/lib/image-hosts.json");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns,
  },
};

module.exports = nextConfig;
