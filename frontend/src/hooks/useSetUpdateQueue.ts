import { useCallback, useEffect, useRef } from "react";
import { useUpdateUserSets } from "@/hooks/react-query";
import type { UserSet } from "@/types/types";

const FLUSH_DELAY_MS = 700;

export const useSetUpdateQueue = () => {
  const { mutateAsync: updateSets } = useUpdateUserSets();

  const pending = useRef<Map<string, UserSet>>(new Map());
  const waiters = useRef<{ resolve: () => void; reject: (e: unknown) => void }[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(async () => {
    timer.current = null;
    if (pending.current.size === 0) return;

    const sets = Array.from(pending.current.values());
    const pendingWaiters = waiters.current;
    pending.current = new Map();
    waiters.current = [];

    try {
      await updateSets(sets);
      pendingWaiters.forEach((w) => w.resolve());
    } catch (e) {
      pendingWaiters.forEach((w) => w.reject(e));
    }
  }, [updateSets]);

  const queueSetUpdate = useCallback(
    (userSet: UserSet) => {
      pending.current.set(userSet.id, userSet);

      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(flush, FLUSH_DELAY_MS);

      return new Promise<void>((resolve, reject) => {
        waiters.current.push({ resolve, reject });
      });
    },
    [flush]
  );

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        flush();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return queueSetUpdate;
};
