import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  experimental: {
    devtoolSegmentExplorer: false,
    serverActions: {
      bodySizeLimit: "2mb"
    }
  },
  outputFileTracingRoot: __dirname
};

export default nextConfig;
