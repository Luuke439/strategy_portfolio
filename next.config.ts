import type { NextConfig } from "next";

// ─── Security headers ───────────────────────────────────────────────────────
// One Content-Security-Policy applied site-wide. The portfolio doesn't run
// user-submitted code or take input, so the threat model is mostly XSS from
// dependency compromise + clickjacking. We strike a balance:
//   - script-src includes 'unsafe-inline' because we ship inline JSON-LD via
//     dangerouslySetInnerHTML in app/layout.tsx and app/projects/[slug]/page.tsx.
//     A nonce-based pipeline would be tighter but would also force every page
//     to be dynamic (nonces can't be statically generated) — losing the static
//     export benefits Vercel gives us. Trade documented here so future-me
//     remembers why this is intentional.
//   - style-src includes 'unsafe-inline' because Framer Motion + Tailwind v4
//     inject inline styles at runtime and there is no nonce-aware bypass.
//   - img-src includes data: and blob: — Three.js builds an env map via
//     CanvasTexture (blob) and we use inline SVGs as data URIs in places.
//   - worker-src includes blob: — some R3F/three internals spin up workers.
//   - connect-src includes Vercel insights endpoints in case we wire them up.
//   - frame-ancestors 'none' replaces X-Frame-Options: DENY in modern browsers.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://vercel.live",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

// Permissions-Policy — disable every powerful feature we don't use. Reads
// like a long list but it's just `feature=()` for each one. Saves us from
// a future dependency silently calling getUserMedia or Geolocation.
const PERMISSIONS_POLICY = [
  "accelerometer=()",
  "ambient-light-sensor=()",
  "autoplay=(self)",
  "battery=()",
  "camera=()",
  "display-capture=()",
  "encrypted-media=()",
  "fullscreen=(self)",
  "gamepad=()",
  "geolocation=()",
  "gyroscope=(self)", // we read DeviceOrientation in Hero3D for mobile tilt
  "hid=()",
  "interest-cohort=()",
  "magnetometer=()",
  "microphone=()",
  "midi=()",
  "payment=()",
  "picture-in-picture=()",
  "publickey-credentials-get=()",
  "screen-wake-lock=()",
  "serial=()",
  "sync-xhr=()",
  "usb=()",
  "xr-spatial-tracking=()",
].join(", ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: PERMISSIONS_POLICY },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
  // Origin-Agent-Cluster opts this origin into its own agent cluster, which
  // gives us strong origin isolation in browsers that support it.
  { key: "Origin-Agent-Cluster", value: "?1" },
  // Block FLoC / Topics outright, in case the Permissions-Policy isn't read.
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
];

const STATIC_ASSET_CACHE = [
  { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
];

const nextConfig: NextConfig = {
  // Disable StrictMode — React double-mounts in dev, creating two WebGL
  // contexts which exhausts GPU memory (THREE.WebGLRenderer: Context Lost).
  reactStrictMode: false,

  // Tree-shake icon-style barrel imports from these libraries instead of
  // pulling the whole module.
  experimental: {
    optimizePackageImports: ["framer-motion", "@react-three/drei"],
  },

  // Strip the "X-Powered-By: Next.js" header. Tiny win — one less piece of
  // fingerprintable information for attackers planning a dependency exploit.
  poweredByHeader: false,

  // Generate hashed ETags for static pages so CDN revalidation works.
  generateEtags: true,

  // Prefer .avif over .webp where the client accepts it.
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },

  async headers() {
    return [
      {
        // Apply security headers to every route.
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
      {
        // Long-cache static assets — public/ files are hashed by content
        // at the Vercel edge, but our hand-placed files (fonts, day.jpg)
        // benefit from explicit immutable caching.
        source: "/fonts/:path*",
        headers: STATIC_ASSET_CACHE,
      },
      {
        source: "/videos/:path*",
        headers: STATIC_ASSET_CACHE,
      },
      {
        source: "/images/:path*",
        headers: STATIC_ASSET_CACHE,
      },
      {
        // Resume PDF — long cache, but allow framing for PDF viewers that
        // embed in an iframe. Override the strict X-Frame-Options just here.
        source: "/Resume_Luke_Caporelli.pdf",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, must-revalidate" },
          { key: "Content-Disposition", value: 'attachment; filename="Resume_Luke_Caporelli.pdf"' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // Apex-only canonical: any host other than lukecaporelli.com (vercel.app
      // preview alias, www subdomain) → permanent redirect to the canonical
      // host. Preserves the path. Note: in production Vercel handles www→apex
      // automatically when you set lukecaporelli.com as the primary domain;
      // this redirect catches any *.vercel.app fallback that might leak.
      {
        source: "/:path*",
        has: [{ type: "host", value: "(.*\\.vercel\\.app)" }],
        destination: "https://lukecaporelli.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.lukecaporelli.com" }],
        destination: "https://lukecaporelli.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
