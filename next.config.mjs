import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./app/i18n/request.ts");
const minioPublicUrl = process.env.MINIO_PUBLIC_BASE_URL || process.env.MINIO_PUBLIC_URL;
const minioRemotePattern = minioPublicUrl
  ? (() => {
      try {
        const parsed = new URL(minioPublicUrl);

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
    ].concat(minioRemotePattern ? [minioRemotePattern] : []),
  },
};

export default withNextIntl(nextConfig);
