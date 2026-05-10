import { MovieCard } from "@/components/MovieCard";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatRuntime } from "@/lib/datetime.util";
import type { Genre } from "@/types/tmdb";
import { Star } from "lucide-react";

type MovieMetaBarProps = {
  vote_average: number;
  release_date: string;
  runtime: number | null;
  genres: Genre[];
};

export function MovieMetaBar({
  vote_average,
  release_date,
  runtime,
  genres,
}: MovieMetaBarProps) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="flex-none gap-1 border-0 bg-black/60 text-white backdrop-blur-sm">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          {vote_average.toFixed(1)}
        </Badge>
        <Separator orientation="vertical" className="hidden h-6 sm:block" />
        <MovieCard.ReleaseDate release_date={release_date} />
        {runtime != null && (
          <>
            <Separator orientation="vertical" className="hidden h-6 sm:block" />
            <span className="text-muted-foreground text-xs">
              {formatRuntime(runtime)}
            </span>
          </>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <Badge
            key={genre.id}
            className="bg-secondary text-xs font-semibold text-secondary-foreground transition-colors duration-200 hover:bg-secondary/80 whitespace-normal break-words"
          >
            {genre.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
