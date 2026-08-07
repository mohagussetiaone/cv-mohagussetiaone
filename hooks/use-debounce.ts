"use client";

import { useEffect, useState } from "react";

/**
 * Mengembalikan nilai `value` hanya setelah `delay` ms tanpa ada perubahan.
 * Dipakai untuk pencarian realtime (search-as-you-type) supaya tidak memicu
 * request/fetch di setiap ketikan.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
