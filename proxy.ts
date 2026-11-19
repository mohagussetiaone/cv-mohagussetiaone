import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./app/i18n/routing";

// Catatan Next 16: proxy.ts SELALU berjalan di runtime Node.js (route segment
// config seperti `runtime = "edge"` DILARANG di file proxy). OpenNext harus
// menanganinya sebagai proxy — lihat hasil build.
const handleI18nRouting = createMiddleware(routing);
export default function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);
  const projectMatch = request.nextUrl.pathname.match(/^\/project\/([^/]+)\/?$/);
  const redirectLocation = response.headers.get("location");
  if (!projectMatch || response.status !== 307 || !redirectLocation) {
    return response;
  }

  // URL legacy /project/{id} harus dipindahkan permanen ke canonical locale URL.
  // Pakai locale hasil deteksi next-intl, tetapi pastikan path project tidak hilang.
  const destination = new URL(redirectLocation, request.url);
  const locale = routing.locales.find(
    (candidate) => candidate === destination.pathname.split("/").filter(Boolean)[0],
  ) ?? routing.defaultLocale;
  destination.pathname = `/${locale}/project/${projectMatch[1]}`;
  const headers = new Headers(response.headers);
  headers.set("location", destination.toString());
  return new NextResponse(null, { status: 308, headers });
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
