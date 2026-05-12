import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable StrictMode — React double-mounts in dev, creating two WebGL
  // contexts which exhausts GPU memory (THREE.WebGLRenderer: Context Lost).
  reactStrictMode: false,

  // Tree-shake icon-style barrel imports from these libraries instead of
  // pulling the whole module. Both libraries are imported with named
  // specifiers but ship as ES module barrels — Next can transform them
  // into per-symbol imports and drop everything we don't actually use.
  experimental: {
    optimizePackageImports: ["framer-motion", "@react-three/drei"],
  },
};

export default nextConfig;
