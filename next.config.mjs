import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import createNextIntlPlugin from "next-intl/plugin";

// Dev lokal (`next dev`): sediakan binding D1/R2 dari wrangler.toml ke proses
// Next via miniflare, supaya getCloudflareContext() bekerja di route handler.
// Saat `next build` / deploy, pemanggilan ini no-op.
initOpenNextCloudflareForDev();

const withNextIntl = createNextIntlPlugin("./app/i18n/request.ts");
const r2PublicUrl = process.env.R2_PUBLIC_BASE_URL || process.env.R2_PUBLIC_URL;
const r2RemotePattern = r2PublicUrl
  ? (() => {
      try {
        const parsed = new URL(r2PublicUrl);

        return {
          protocol: parsed.protocol.replace(":", ""),
          hostname: parsed.hostname,
          port: parsed.port,
          pathname: "/**",
        };
      } catch {
        return null;
      }
    })()
  : null;

const nextConfig = {
  images: {
    // Skill stack logos use SVG (devicon / simple-icons). Both CDNs are trusted.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.mohagussetiaone.my.id",
        port: "",
        pathname: "/**",
      },
    ]
      .concat(r2RemotePattern ? [r2RemotePattern] : [])
      .filter((p, i, arr) => arr.findIndex((q) => q.hostname === p.hostname && q.protocol === p.protocol) === i),
  },
};

export default withNextIntl(nextConfig);
