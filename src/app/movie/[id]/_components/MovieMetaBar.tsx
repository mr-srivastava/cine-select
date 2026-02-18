import { MovieCard } from "@/components/MovieCard";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatRuntime } from "@/lib/datetime.util";
import type { Genre } from "@/types/tmdb";

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
      <div className="flex items-center">
        <MovieCard.Rating
          vote_average={vote_average}
          className="relative right-0 top-0 mr-2"
        />
        <Separator orientation="vertical" className="h-6 mx-2" />
        <MovieCard.ReleaseDate release_date={release_date} />
        {runtime != null && (
          <>
            <Separator orientation="vertical" className="h-6 mx-2" />
            <span className="text-muted-foreground text-xs">
              {formatRuntime(runtime)}
            </span>
          </>
        )}
      </div>
      <div className="flex gap-2">
        {genres.map((genre) => (
          <Badge
            key={genre.id}
            className="bg-secondary text-xs font-semibold text-secondary-foreground transition-colors duration-200 hover:bg-secondary/80"
          >
            {genre.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
