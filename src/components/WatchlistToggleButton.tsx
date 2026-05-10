"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toWatchlistEntry } from "@/lib/watchlist";
import { useWatchlist } from "@/hooks/useWatchlist";
import type { MovieSearchResult } from "@/types/tmdb";

type WatchlistToggleButtonProps = {
  movie: Pick<MovieSearchResult, "id" | "title" | "poster_path" | "release_date" | "vote_average">;
  className?: string;
  size?: "default" | "sm" | "lg";
};

export default function WatchlistToggleButton({
  movie,
  className,
  size = "default",
}: WatchlistToggleButtonProps) {
  const watchlist = useWatchlist();
  const saved = watchlist.has(movie.id);

  return (
    <Button
      type="button"
      size={size}
      variant={saved ? "secondary" : "outline"}
      className={className}
      onClick={() => {
        watchlist.toggle(toWatchlistEntry(movie));
      }}
      aria-pressed={saved}
    >
      {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
      {saved ? "Saved to watchlist" : "Want to watch"}
    </Button>
  );
}
