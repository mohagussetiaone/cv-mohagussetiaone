import createMiddleware from "next-intl/middleware";

// Catatan Next 16: proxy.ts SELALU berjalan di runtime Node.js (route segment
// config seperti `runtime = "edge"` DILARANG di file proxy). OpenNext harus
// menanganinya sebagai proxy — lihat hasil build.
const proxy = createMiddleware({
  locales: ["en", "id"],
  defaultLocale: "id",
});

export default proxy;

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
