import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "id"],
  defaultLocale: "id",
  pathnames: {
    "/project/[projectId]": {
      en: "/en/project/[projectId]",
      id: "/id/project/[projectId]",
    },
  },
});
