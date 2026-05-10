"use client";

import * as React from "react";
import {
  WATCHLIST_STORAGE_KEY,
  WATCHLIST_UPDATED_EVENT,
  getEmptyWatchlistSnapshot,
  isInWatchlist,
  readWatchlist,
  removeFromWatchlist,
  toggleWatchlist,
  type WatchlistEntry,
} from "@/lib/watchlist";

function subscribe(callback: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (!event.key || event.key === WATCHLIST_STORAGE_KEY) {
      callback();
    }
  };

  const handleCustom = () => callback();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(WATCHLIST_UPDATED_EVENT, handleCustom);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(WATCHLIST_UPDATED_EVENT, handleCustom);
  };
}

export function useWatchlist() {
  const entries = React.useSyncExternalStore(
    subscribe,
    readWatchlist,
    getEmptyWatchlistSnapshot,
  );

  return {
    entries,
    has: (movieId: number) => isInWatchlist(movieId),
    toggle: (entry: WatchlistEntry) => toggleWatchlist(entry),
    remove: (movieId: number) => removeFromWatchlist(movieId),
  };
}
