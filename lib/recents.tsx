import React, { createContext, useContext, useMemo } from "react";
import { useStoredList } from "./storedList";

/**
 * The providers a user actually opened — called, routed to or checked a
 * source for — most recent first. Lets the home screen offer a one-tap way
 * back to the number someone used last, which is usually the right one again.
 */

const STORAGE_KEY = "swiftcare.recents.v1";
const RECENTS_LIMIT = 12;

type RecentsContextValue = {
  /** Provider ids, most recently viewed first, capped at {@link RECENTS_LIMIT}. */
  ids: string[];
  push: (id: string) => void;
  clear: () => void;
  ready: boolean;
};

const RecentsContext = createContext<RecentsContextValue | null>(null);

export function RecentsProvider({ children }: { children: React.ReactNode }) {
  const { ids, ready, add, clear } = useStoredList(STORAGE_KEY, RECENTS_LIMIT);

  const value = useMemo<RecentsContextValue>(
    () => ({ ids, ready, push: add, clear }),
    [ids, ready, add, clear],
  );

  return <RecentsContext.Provider value={value}>{children}</RecentsContext.Provider>;
}

export function useRecents(): RecentsContextValue {
  const context = useContext(RecentsContext);
  if (!context) {
    throw new Error("useRecents must be used inside a RecentsProvider");
  }
  return context;
}
