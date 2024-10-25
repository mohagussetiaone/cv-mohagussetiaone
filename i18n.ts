//i18n.ts
import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

export const locales: string[] = ["en", "id"];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as string)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
