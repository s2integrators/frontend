
// src/hooks/useSoftDelete.ts
import { useCallback, useEffect, useState } from "react";

type DeletedEntry = {
  deletedAt: number; // timestamp
};

const STORAGE_KEY = "deletedResumes_v1";
const TWO_MONTHS_MS = 60 * 24 * 60 * 60 * 1000; // 60 days

// Load map safely
function loadDeletedMap(): Record<string, DeletedEntry> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

// Save map safely
function saveDeletedMap(map: Record<string, DeletedEntry>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {}
}

export default function useSoftDelete() {
  const [deletedMap, setDeletedMap] = useState<Record<string, DeletedEntry>>(() =>
    loadDeletedMap()
  );

  // Auto-purge (runs only at first mount)
  useEffect(() => {
    const now = Date.now();
    const next: Record<string, DeletedEntry> = {};

    for (const id of Object.keys(deletedMap)) {
      const entry = deletedMap[id];
      if (entry && entry.deletedAt && now - entry.deletedAt < TWO_MONTHS_MS) {
        next[id] = entry; // keep only valid entries
      }
    }

    setDeletedMap(next);
    saveDeletedMap(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync localStorage whenever map changes
  useEffect(() => {
    saveDeletedMap(deletedMap);
  }, [deletedMap]);

  // Check if a resume is deleted
  const isDeleted = useCallback(
    (id?: string | number) => {
      if (!id) return false;
      return Boolean(deletedMap[String(id)]);
    },
    [deletedMap]
  );

  // Soft delete (move to localStorage bin)
  const deleteResume = useCallback((id: string | number) => {
    const key = String(id);
    setDeletedMap((prev) => ({
      ...prev,
      [key]: { deletedAt: Date.now() },
    }));
  }, []);

  // Restore resume back to dashboard
  const restoreResume = useCallback((id: string | number) => {
    const key = String(id);
    setDeletedMap((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  // Permanently remove resume from bin
  const permanentlyRemove = useCallback((id: string | number) => {
    const key = String(id);
    setDeletedMap((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  // Get list of IDs in the bin
  const listBinIds = useCallback(() => {
    return Object.keys(deletedMap);
  }, [deletedMap]);

  // Get meta info for items in the bin
  const getBinItem = useCallback(
    (id: string | number) => deletedMap[String(id)] ?? null,
    [deletedMap]
  );

  return {
    deletedMap,
    isDeleted,
    deleteResume,
    restoreResume,
    permanentlyRemove,
    listBinIds,
    getBinItem,
  };
}
