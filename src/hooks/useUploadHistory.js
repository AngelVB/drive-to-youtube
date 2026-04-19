import { useState, useCallback } from "react";
import { storage } from "../storage";
import { LS } from "../constants";

export function useUploadHistory() {
  const [history, setHistory] = useState(() => storage.get(LS.hist, true) || {});

  const record = useCallback((driveId, ytId, title) => {
    setHistory(prev => {
      const next = { ...prev, [driveId]: { ytId, title, date: new Date().toISOString() } };
      storage.set(LS.hist, next, true);
      return next;
    });
  }, []);

  return [history, record];
}
