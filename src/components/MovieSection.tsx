import { MovieSearchResult } from "@/types/tmdb";
import MovieCard from "./MovieCard";

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
      <div className="custom-scrollbar flex gap-4 overflow-x-auto pb-2">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
