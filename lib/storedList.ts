import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadIds, saveIds } from "./storage";

export type StoredList = {
  ids: string[];
  ready: boolean;
  has: (id: string) => boolean;
  add: (id: string) => void;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

/**
 * A list of ids persisted under `key`. Both the starred numbers and the
 * recently-viewed history are this: an ordered list of provider ids, differing
 * only in that the history is capped. Reading is best-effort — storage being
 * unavailable leaves an empty, still-usable list.
 */
export function useStoredList(key: string, limit?: number): StoredList {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  const limitRef = useRef(limit);
  limitRef.current = limit;

  useEffect(() => {
    let live = true;
    loadIds(key).then((stored) => {
      if (live) {
        setIds(limitRef.current === undefined ? stored : stored.slice(0, limitRef.current));
        setReady(true);
      }
    });
    return () => {
      live = false;
    };
  }, [key]);

  const commit = useCallback(
    (update: (current: string[]) => string[]) => {
      setIds((current) => {
        const updated = update(current);
        const cap = limitRef.current;
        const next = cap === undefined ? updated : updated.slice(0, cap);
        void saveIds(key, next);
        return next;
      });
    },
    [key],
  );

  const add = useCallback((id: string) => commit((current) => [id, ...current.filter((value) => value !== id)]), [commit]);
  const remove = useCallback((id: string) => commit((current) => current.filter((value) => value !== id)), [commit]);
  const toggle = useCallback(
    (id: string) => commit((current) => (current.includes(id) ? current.filter((value) => value !== id) : [id, ...current])),
    [commit],
  );
  const clear = useCallback(() => commit(() => []), [commit]);
  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return useMemo(
    () => ({ ids, ready, has, add, toggle, remove, clear }),
    [ids, ready, has, add, toggle, remove, clear],
  );
}
