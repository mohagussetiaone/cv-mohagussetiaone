"use client";

import { useEffect, useState } from "react";

type SiteContentMap = Record<string, string>;

type SiteContentState = {
  localized: Record<string, SiteContentMap>;
  global: SiteContentMap;
  isLoading: boolean;
  error: string | null;
};

const cache = new Map<string, SiteContentState>();

export function clearSiteContentCache() {
  cache.clear();
}

export function useSiteContent(section: string, locale: string = "id"): SiteContentState {
  const [refreshKey, setRefreshKey] = useState(0);
  const [state, setState] = useState<SiteContentState>(() => {
    const key = `${section}:${locale}:${refreshKey}`;
    return cache.get(key) ?? {
      localized: {},
      global: {},
      isLoading: true,
      error: null,
    };
  });

  useEffect(() => {
    const key = `${section}:${locale}:${refreshKey}`;

    // If already cached, skip fetch
    if (cache.has(key) && !cache.get(key)!.isLoading) {
      setState(cache.get(key)!);
      return;
    }

    let mounted = true;

    fetch(`/api/site-content?locale=${locale}`)
      .then((res) => res.json())
      .then((json) => {
        if (!mounted) return;
        const sectionData = json?.data?.[section];
        const newState: SiteContentState = {
          localized: sectionData?.localized ?? {},
          global: sectionData?.global ?? {},
          isLoading: false,
          error: null,
        };
        cache.set(key, newState);
        setState(newState);
      })
      .catch((err) => {
        if (!mounted) return;
        const newState: SiteContentState = {
          localized: {},
          global: {},
          isLoading: false,
          error: err.message ?? "Failed to load content",
        };
        cache.set(key, newState);
        setState(newState);
      });

    return () => { mounted = false; };
  }, [section, locale, refreshKey]);

  return state;
}

export function getLocalizedContent(
  content: SiteContentState,
  locale: string,
  key: string
): string | undefined {
  return content.localized?.[locale]?.[key] ?? content.localized?.["id"]?.[key] ?? content.global?.[key];
}
