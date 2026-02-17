import { MovieSearchResult } from "@/types/tmdb";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface MovieSectionProps {
  title: string;
  movies: MovieSearchResult[];
}

export default function MovieSection({ title, movies }: MovieSectionProps) {
  if (!movies.length) return null;

  return (
    <section className="w-full">
      <h2 className="font-display mb-4 text-xl font-semibold tracking-tight text-light-text sm:text-2xl">
        {title}
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={`/movie/${movie.id}`}
            className="group flex w-[140px] flex-shrink-0 flex-col transition-transform duration-200 hover:scale-[1.02] sm:w-[160px]"
          >
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-muted ring-1 ring-white/10">
              {movie.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 640px) 140px, 160px"
                  className="object-cover transition-opacity duration-200 group-hover:opacity-90"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl text-muted-foreground">
                  🎬
                </div>
              )}
              {movie.vote_average != null && movie.vote_average > 0 && (
                <div className="absolute right-2 top-2 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {movie.vote_average.toFixed(1)}
                </div>
              )}
            </div>
            <div className="mt-2 flex flex-col gap-0.5">
              <span className="line-clamp-2 text-sm font-medium text-light-text group-hover:text-primary">
                {movie.title}
              </span>
              {movie.release_date && (
                <span className="text-xs text-muted-foreground">
                  {movie.release_date.split("-")[0]}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
