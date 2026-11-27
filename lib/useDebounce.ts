import { useEffect, useState } from "react";

/**
 * Delay a fast-changing value until it settles.
 *
 * The search box updates on every keystroke; the expensive filter should only
 * run once the user pauses, so the list never stutters while typing.
 */
export function useDebouncedValue<T>(value: T, delay = 180): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);

  return debounced;
}
