"use client";

import Link from "next/link";
import { BookmarkX, Clock3 } from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";
import MovieCard from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { formatReleaseYear } from "@/lib/datetime.util";

export default function WatchlistPageClient() {
  const watchlist = useWatchlist();

  if (watchlist.entries.length === 0) {
    return (
      <div className="rounded-[30px] border border-border/60 bg-background/45 px-6 py-12 text-center shadow-[0_28px_90px_rgba(0,0,0,0.24)] backdrop-blur">
        <p className="text-[11px] uppercase tracking-[0.34em] text-muted-foreground">Watchlist</p>
        <h2 className="mt-4 font-display text-3xl tracking-[0.08em] text-light-text sm:text-4xl">
          Nothing has entered the ledger yet
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          Save a title from any dossier and it will return here as part of your private program notes.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild className="rounded-full px-6">
            <Link href="/">Browse the collection</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-6">
            <Link href="/discover">Open the catalogue</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-[30px] border border-border/60 bg-background/45 px-6 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.34em] text-muted-foreground">Private program</p>
          <h2 className="mt-2 font-display text-3xl tracking-[0.08em] text-light-text">
            {watchlist.entries.length} saved title{watchlist.entries.length === 1 ? "" : "s"}
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          A working shelf for films worth returning to when the right mood or evening arrives.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {watchlist.entries.map((movie) => (
          <div key={movie.id} className="space-y-3">
            <MovieCard movie={movie} />
            <div className="rounded-[24px] border border-border/60 bg-background/45 px-4 py-3">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <Clock3 className="size-3.5" />
                Saved {new Date(movie.savedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{movie.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {movie.release_date ? formatReleaseYear(movie.release_date) : "Date unknown"}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => watchlist.remove(movie.id)}
                  aria-label={`Remove ${movie.title} from watchlist`}
                >
                  <BookmarkX className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
