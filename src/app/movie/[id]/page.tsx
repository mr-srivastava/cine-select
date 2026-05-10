import { fetchMovieDetails } from "@/actions/tmdb.actions";
import type { Movie } from "@/types/tmdb";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MovieHero } from "./_components/MovieHero";
import { MovieDetailsCard } from "./_components/MovieDetailsCard";
import MovieExtraSections from "./_components/MovieExtraSections";

function buildMovieDescription(movie: Movie): string {
  const base = movie.overview.trim();
  if (base) return base.length > 155 ? `${base.slice(0, 152)}...` : base;
  return `Read details, ratings, and more for ${movie.title} on CineSelect.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const numericId = Number(id);

  if (!/^\d+$/.test(id) || !Number.isInteger(numericId)) {
    return {
      title: "Movie not found",
    };
  }

  try {
    const movie = await fetchMovieDetails(numericId);
    const title = `${movie.title}${movie.release_date ? ` (${movie.release_date.slice(0, 4)})` : ""}`;
    const description = buildMovieDescription(movie);
    const imageUrl = movie.backdrop_path ?? movie.poster_path;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        images: imageUrl
          ? [
              {
                url: `https://image.tmdb.org/t/p/original${imageUrl}`,
                width: movie.backdrop_path ? 1280 : 500,
                height: movie.backdrop_path ? 720 : 750,
                alt: movie.title,
              },
            ]
          : undefined,
      },
      twitter: {
        card: imageUrl ? "summary_large_image" : "summary",
        title,
        description,
        images: imageUrl ? [`https://image.tmdb.org/t/p/original${imageUrl}`] : undefined,
      },
    };
  } catch {
    return {
      title: "Movie not found",
      description: "The requested movie could not be loaded.",
    };
  }
}

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
        <div className="-mt-6 rounded-[30px] border border-border/70 bg-card/95 p-6 shadow-[0_32px_120px_rgba(0,0,0,0.28)] backdrop-blur sm:-mt-8 sm:p-8">
          <MovieDetailsCard movie={movie} />
        </div>
        <MovieExtraSections movieId={movie.id} />
      </div>
    </div>
  );
}
