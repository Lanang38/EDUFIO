import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Next.js blocks cross-origin requests to dev-only assets (_next/static, HMR)
  // by default. Kita akses server dev lewat IP jaringan lokal (mis. dari HP/tablet
  // lain), jadi origin itu perlu didaftarkan secara eksplisit di sini.
  allowedDevOrigins: ["192.168.55.117"],
};

export default nextConfig;
