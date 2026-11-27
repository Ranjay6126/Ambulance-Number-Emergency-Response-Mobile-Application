import React, { createContext, useContext, useMemo } from "react";
import { useStoredList } from "./storedList";

/**
 * Starred providers, shared across every screen and remembered between
 * launches. Kept in a context so a card in the directory and the saved filter
 * on the same screen always agree about what is starred.
 */

const STORAGE_KEY = "swiftcare.saved.v1";

type SavedContextValue = {
  /** Starred provider ids, most recently added first. */
  ids: string[];
  isSaved: (id: string) => boolean;
  toggle: (id: string) => void;
  count: number;
  /** False until the stored list has been read back. */
  ready: boolean;
};

const SavedContext = createContext<SavedContextValue | null>(null);

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const { ids, ready, has, toggle } = useStoredList(STORAGE_KEY);

  const value = useMemo<SavedContextValue>(
    () => ({ ids, ready, count: ids.length, isSaved: has, toggle }),
    [ids, ready, has, toggle],
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved(): SavedContextValue {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error("useSaved must be used inside a SavedProvider");
  }
  return context;
}
