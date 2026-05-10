import { fetchMovieList, type MovieListType } from "@/actions/tmdb.actions";
import MovieCard from "@/components/MovieCard";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const LIST_META: Record<
  MovieListType,
  { title: string; description: string; label: string }
> = {
  popular: {
    title: "Popular Movies",
    description: "Browse the most popular movies on CineSelect.",
    label: "Popular",
  },
  now_playing: {
    title: "Now Playing",
    description: "See what’s currently in theaters and trending now.",
    label: "Now Playing",
  },
  top_rated: {
    title: "Top Rated Movies",
    description: "Explore the highest rated movies on CineSelect.",
    label: "Top Rated",
  },
};

function toMovieListType(value: string): MovieListType | null {
  if (value === "popular" || value === "now-playing" || value === "top-rated") {
    return value.replace("-", "_") as MovieListType;
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ listType: string }>;
}): Promise<Metadata> {
  const { listType } = await params;
  const resolvedType = toMovieListType(listType);

  if (!resolvedType) {
    return { title: "Movies not found" };
  }

  const meta = LIST_META[resolvedType];
  return {
    title: meta.title,
    description: meta.description,
  };
}

export default async function MovieListPage({
  params,
  searchParams,
}: {
  params: Promise<{ listType: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ listType }, { page }] = await Promise.all([params, searchParams]);
  const resolvedType = toMovieListType(listType);

  if (!resolvedType) {
    notFound();
  }

  const currentPage = Math.max(1, Number(page ?? "1") || 1);
  const movies = await fetchMovieList(resolvedType, currentPage);
  const meta = LIST_META[resolvedType];
  const canGoBack = currentPage > 1;
  const canGoForward = movies.length > 0;

  return (
    <div className="cinema-grain min-h-screen bg-dark-bg">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10">
        <PageBreadcrumb
          breadcrumbs={[
            { link: "/", label: "Home", isActive: false },
            { link: `/movies/${listType}`, label: meta.label, isActive: true },
          ]}
        />

        <div className="flex flex-col gap-2">
          <h1 className="font-display text-4xl font-bold tracking-tight text-light-text sm:text-5xl">
            {meta.title}
          </h1>
          <p className="max-w-2xl text-muted-foreground">{meta.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">Page {currentPage}</span>
          <div className="flex items-center gap-3">
            <Link
              href={canGoBack ? `/movies/${listType}?page=${currentPage - 1}` : "#"}
              aria-disabled={!canGoBack}
              tabIndex={canGoBack ? 0 : -1}
              className="btn-primary disabled:pointer-events-none disabled:opacity-50"
            >
              Previous
            </Link>
            <Link
              href={canGoForward ? `/movies/${listType}?page=${currentPage + 1}` : "#"}
              aria-disabled={!canGoForward}
              tabIndex={canGoForward ? 0 : -1}
              className="btn-primary disabled:pointer-events-none disabled:opacity-50"
            >
              Next
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
