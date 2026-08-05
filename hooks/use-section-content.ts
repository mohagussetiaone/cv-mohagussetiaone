"use client";

import { useEffect, useState } from "react";
import type { SectionContentResponse } from "@/app/types/site-content";

type SectionState<T> = {
  items: T[];
  localized: Record<string, string>;
  isLoading: boolean;
};

export function useSectionContent<T>(section: string, locale: string): SectionState<T> {
  const [state, setState] = useState<SectionState<T>>({ items: [], localized: {}, isLoading: true });

  useEffect(() => {
    let mounted = true;
    setState((prev) => ({ ...prev, isLoading: true }));

    fetch(`/api/${section}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed"))))
      .then((json) => {
        const payload = json?.data as SectionContentResponse<T> | undefined;
        const localized = payload?.settings?.localized?.[locale] ?? payload?.settings?.localized?.["id"] ?? {};
        if (!mounted) return;
        setState({ items: payload?.items ?? [], localized, isLoading: false });
      })
      .catch((err) => {
        if (!mounted) return;
        console.error(`Gagal mengambil data section "${section}":`, err);
        setState({ items: [], localized: {}, isLoading: false });
      });

    return () => {
      mounted = false;
    };
  }, [section, locale]);

  return state;
}