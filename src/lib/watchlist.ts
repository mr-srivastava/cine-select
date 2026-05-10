import type { MovieSearchResult } from "@/types/tmdb";

export const WATCHLIST_STORAGE_KEY = "cine-select.watchlist";
export const WATCHLIST_UPDATED_EVENT = "cine-select:watchlist-updated";
const EMPTY_WATCHLIST: WatchlistEntry[] = [];

let cachedRaw = "";
let cachedEntries: WatchlistEntry[] = EMPTY_WATCHLIST;

export type WatchlistEntry = Pick<
  MovieSearchResult,
  "id" | "title" | "poster_path" | "release_date" | "vote_average"
> & {
  savedAt: string;
};

function isWatchlistEntry(value: unknown): value is WatchlistEntry {
  if (value === null || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;

  return (
    typeof entry.id === "number" &&
    typeof entry.title === "string" &&
    (typeof entry.poster_path === "string" || entry.poster_path === null) &&
    (typeof entry.release_date === "string" || typeof entry.release_date === "undefined") &&
    (typeof entry.vote_average === "number" || typeof entry.vote_average === "undefined") &&
    typeof entry.savedAt === "string"
  );
}

export function toWatchlistEntry(movie: Pick<
  MovieSearchResult,
  "id" | "title" | "poster_path" | "release_date" | "vote_average"
>): WatchlistEntry {
  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path ?? null,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    savedAt: new Date().toISOString(),
  };
}

export function readWatchlist(): WatchlistEntry[] {
  if (typeof window === "undefined") return EMPTY_WATCHLIST;

  try {
    const raw = window.localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (!raw) {
      cachedRaw = "";
      cachedEntries = EMPTY_WATCHLIST;
      return cachedEntries;
    }

    if (raw === cachedRaw) {
      return cachedEntries;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      cachedRaw = "";
      cachedEntries = EMPTY_WATCHLIST;
      return cachedEntries;
    }

    cachedRaw = raw;
    cachedEntries = parsed
      .filter(isWatchlistEntry)
      .sort((a, b) => b.savedAt.localeCompare(a.savedAt));

    return cachedEntries;
  } catch {
    cachedRaw = "";
    cachedEntries = EMPTY_WATCHLIST;
    return cachedEntries;
  }
}

function writeWatchlist(entries: WatchlistEntry[]) {
  if (typeof window === "undefined") return;

  cachedEntries = entries;
  cachedRaw = JSON.stringify(entries);
  window.localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(entries));
  window.dispatchEvent(new CustomEvent(WATCHLIST_UPDATED_EVENT));
}

export function getEmptyWatchlistSnapshot() {
  return EMPTY_WATCHLIST;
}

export function isInWatchlist(movieId: number) {
  return readWatchlist().some((entry) => entry.id === movieId);
}

export function toggleWatchlist(entry: WatchlistEntry) {
  const current = readWatchlist();
  const exists = current.some((item) => item.id === entry.id);

  if (exists) {
    writeWatchlist(current.filter((item) => item.id !== entry.id));
    return false;
  }

  writeWatchlist([entry, ...current.filter((item) => item.id !== entry.id)]);
  return true;
}

export function removeFromWatchlist(movieId: number) {
  writeWatchlist(readWatchlist().filter((entry) => entry.id !== movieId));
}
