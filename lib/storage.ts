import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * A tiny, defensive key/value layer for the few things SwiftCare remembers
 * between launches: the numbers a user starred and the providers they opened
 * recently. Everything here is best-effort — a device with storage disabled
 * still gets the full directory, it just will not remember anything.
 *
 * Only ids and small strings are ever written. No position, contact or
 * personal detail is stored.
 */

/** Read a stored list of strings. Corrupt or missing data yields an empty list. */
export async function loadIds(key: string): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((value): value is string => typeof value === "string");
  } catch {
    return [];
  }
}

/** Persist a list of strings, silently giving up if storage refuses. */
export async function saveIds(key: string, ids: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // Storage is unavailable or full — the in-memory copy stays usable.
  }
}
