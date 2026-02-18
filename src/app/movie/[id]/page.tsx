import { fetchMovieDetails } from "@/actions/tmdb.actions";
import type { Movie } from "@/types/tmdb";
import { notFound } from "next/navigation";
import { MovieHero } from "./_components/MovieHero";
import { MovieDetailsCard } from "./_components/MovieDetailsCard";

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!/^\d+$/.test(id) || !Number.isInteger(numericId)) {
    notFound();
  }

  let movie: Movie;
  try {
    movie = await fetchMovieDetails(numericId);
  } catch {
    notFound();
  }

  return (
    <div className="cinema-grain min-h-screen bg-dark-bg">
      <MovieHero
        id={movie.id}
        title={movie.title}
        tagline={movie.tagline ?? null}
        backdrop_path={movie.backdrop_path}
        poster_path={movie.poster_path}
        vote_average={movie.vote_average}
        release_date={movie.release_date}
        runtime={movie.runtime ?? null}
        genres={movie.genres}
      />
      <div className="container relative z-10 mx-auto px-4 py-8">
        <div className="-mt-6 rounded-xl border border-border bg-card p-6 shadow-xl sm:-mt-8">
          <MovieDetailsCard movie={movie} />
        </div>
      </div>
    </div>
  );
}
