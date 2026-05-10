import { MovieSearchResult } from "@/types/tmdb";
import MovieCard from "./MovieCard";
import Link from "next/link";

interface MovieSectionProps {
  title: string;
  movies: MovieSearchResult[];
  href?: string;
}

export default function MovieSection({ title, movies, href }: MovieSectionProps) {
  if (!movies.length) return null;

  return (
    <section className="w-full">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-semibold tracking-tight text-light-text sm:text-2xl">
          {title}
        </h2>
        {href ? (
          <Link
            href={href}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-light-text"
          >
            View all
          </Link>
        ) : null}
      </div>
      <div className="custom-scrollbar flex gap-4 overflow-x-auto pb-2">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
