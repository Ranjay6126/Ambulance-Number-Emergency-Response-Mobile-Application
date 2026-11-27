import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loadIds, saveIds } from "./storage";

/**
 * Starred providers, shared across every screen and remembered between
 * launches. Kept in a context so a card in the directory and a curated list on
 * the home screen always agree about what is saved.
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
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;
    loadIds(STORAGE_KEY).then((stored) => {
      if (live) {
        setIds(stored);
        setReady(true);
      }
    });
    return () => {
      live = false;
    };
  }, []);

  const toggle = useCallback((id: string) => {
    setIds((current) => {
      const next = current.includes(id) ? current.filter((value) => value !== id) : [id, ...current];
      void saveIds(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo<SavedContextValue>(
    () => ({
      ids,
      ready,
      count: ids.length,
      isSaved: (id: string) => ids.includes(id),
      toggle,
    }),
    [ids, ready, toggle],
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
