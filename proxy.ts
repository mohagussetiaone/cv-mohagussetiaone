import createMiddleware from "next-intl/middleware";

const proxy = createMiddleware({
  locales: ["en", "id"],
  defaultLocale: "id",
});

export default proxy;

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
