import { MovieSearchResult } from "@/types/tmdb";
import MovieCard from "./MovieCard";
import Link from "next/link";

interface MovieSectionProps {
  title: string;
  description?: string;
  movies: MovieSearchResult[];
  href?: string;
}

export default function MovieSection({ title, description, movies, href }: MovieSectionProps) {
  if (!movies.length) return null;

  return (
    <section className="w-full rounded-[32px] border border-border/60 bg-background/25 px-4 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.2)] backdrop-blur sm:px-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.34em] text-muted-foreground">Programme note</p>
          <h2 className="mt-2 font-display text-xl font-semibold uppercase tracking-[0.08em] text-light-text sm:text-2xl">
          {title}
          </h2>
          {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p> : null}
        </div>
        {href ? (
          <Link
            href={href}
            className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-light-text"
          >
            Open full list
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
