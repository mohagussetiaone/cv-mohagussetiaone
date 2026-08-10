"use client";

import { useSyncExternalStore } from "react";

type SiteContentMap = Record<string, string>;

type SectionBlock = {
  localized: Record<string, SiteContentMap>;
  global: SiteContentMap;
};

type SiteContentState = SectionBlock & {
  isLoading: boolean;
  error: string | null;
};

type Payload = {
  data: Record<string, SectionBlock>;
  isLoading: boolean;
  error: string | null;
};

// Per-locale cache of the FULL /api/site-content payload (single fetch per locale).
const payloadCache = new Map<string, Payload>();
// Dedupe in-flight fetches per locale so they fire only once.
const inflight = new Map<string, Promise<void>>();
// Per `section:locale` derived snapshot (stable reference for useSyncExternalStore).
const sectionCache = new Map<string, SiteContentState>();
const listeners = new Set<() => void>();

const EMPTY_STATE: SiteContentState = {
  localized: {},
  global: {},
  isLoading: true,
  error: null,
};

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function notify() {
  for (const listener of listeners) listener();
}

function getSnapshot(key: string): SiteContentState {
  return sectionCache.get(key) ?? EMPTY_STATE;
}

function buildSectionStates(locale: string) {
  const payload = payloadCache.get(locale);
  if (!payload) return;
  for (const [section, block] of Object.entries(payload.data)) {
    sectionCache.set(`${section}:${locale}`, {
      localized: block.localized ?? {},
      global: block.global ?? {},
      isLoading: payload.isLoading,
      error: payload.error,
    });
  }
}

function loadLocale(locale: string) {
  if (payloadCache.has(locale)) return;
  if (inflight.has(locale)) return;

  payloadCache.set(locale, { data: {}, isLoading: true, error: null });
  buildSectionStates(locale);

  const promise = fetch(`/api/site-content?locale=${locale}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load content");
      return res.json();
    })
    .then((json) => {
      payloadCache.set(locale, { data: json?.data ?? {}, isLoading: false, error: null });
    })
    .catch((err) => {
      payloadCache.set(locale, { data: {}, isLoading: false, error: err.message ?? "Failed to load content" });
    })
    .finally(() => {
      inflight.delete(locale);
      buildSectionStates(locale);
      notify();
    });

  inflight.set(locale, promise);
}

export function clearSiteContentCache() {
  payloadCache.clear();
  inflight.clear();
  sectionCache.clear();
  notify();
}

export function refreshSiteContent(locale: string) {
  inflight.delete(locale);
  payloadCache.delete(locale);
  loadLocale(locale);
}

export function useSiteContent(section: string, locale: string = "id"): SiteContentState {
  const key = `${section}:${locale}`;
  loadLocale(locale);

  return useSyncExternalStore(
    subscribe,
    () => getSnapshot(key),
    () => getSnapshot(key)
  );
}

export function getLocalizedContent(
  content: SiteContentState,
  locale: string,
  key: string
): string | undefined {
  return content.localized?.[locale]?.[key] ?? content.localized?.["id"]?.[key] ?? content.global?.[key];
}