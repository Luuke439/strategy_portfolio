import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable StrictMode — React double-mounts in dev, creating two WebGL
  // contexts which exhausts GPU memory (THREE.WebGLRenderer: Context Lost).
  reactStrictMode: false,
};

export default nextConfig;
