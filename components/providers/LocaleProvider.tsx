"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";

type LocaleContextValue = {
  locale: string;
  setLocale: (newLocale: string) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useAppLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useAppLocale must be used within a LocaleProvider");
  return ctx;
}

export function LocaleProvider({
  children,
  initialLocale,
  enMessages,
  idMessages,
}: {
  children: ReactNode;
  initialLocale: string;
  enMessages: Record<string, unknown>;
  idMessages: Record<string, unknown>;
}) {
  const [locale, setLocaleState] = useState(initialLocale);
  const messages = locale === "en" ? enMessages : idMessages;

  const setLocale = useCallback(
    (newLocale: string) => {
      if (newLocale === locale) return;
      setLocaleState(newLocale);

      // Update URL silently — no navigation, no scroll
      const newPath = window.location.pathname.replace(
        /^\/(en|id)/,
        `/${newLocale}`
      );
      window.history.replaceState(null, "", newPath);
    },
    [locale]
  );

  // Sync when user navigates back/forward (PopStateEvent)
  useEffect(() => {
    const onPopState = () => {
      const match = window.location.pathname.match(/^\/(en|id)/);
      if (match && match[1] !== locale) {
        setLocaleState(match[1]);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
