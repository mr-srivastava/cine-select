import { CommandItem } from "./ui/command";
import { MovieSearchResult } from "@/types/tmdb";
import { useRouter } from "next/navigation";
import { MovieCard } from "./MovieCard";
import { formatReleaseYear } from "@/lib/datetime.util";

export const MovieSearchItem = ({ movie }: { movie: MovieSearchResult }) => {
  const router = useRouter();

  return (
    <CommandItem
      value={`${movie.title}-${movie.id}`}
      onSelect={() => {
        router.push(`/movie/${movie.id}`);
      }}
      className="flex items-center gap-4 px-4 py-2 transition-colors duration-150 data-[selected]:bg-accent"
    >
      <MovieCard.Poster
        poster_path={movie.poster_path}
        title={movie.title}
        imageSize="w92"
        sizes="32px"
        containerClassName="h-12 w-8 flex-shrink-0 overflow-hidden rounded bg-muted ring-0"
        className="h-full w-full object-cover"
        fallbackClassName="text-[10px] font-semibold uppercase tracking-[0.2em]"
        fallback={<span>CS</span>}
      />
      <div className='flex flex-col'>
        <span className='font-medium'>{movie.title}</span>
        {movie.release_date ? (
          <span className="text-sm text-muted-foreground">
            {formatReleaseYear(movie.release_date)}
          </span>
        ) : null}
      </div>
    </CommandItem>
  );
};
