import MovieSearch from "@/components/MovieSearch";
import MovieSection from "@/components/MovieSection";
import { fetchMovieList } from "@/actions/tmdb.actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover Movies",
  description: "Search and explore popular, now playing, and top rated movies.",
};

export default async function Home() {
  const results = await Promise.allSettled([
    fetchMovieList("popular", 1),
    fetchMovieList("now_playing", 1),
    fetchMovieList("top_rated", 1),
  ]);

  const [popular, nowPlaying, topRated] = results.map((result) => {
    if (result.status === "fulfilled") return result.value;
    console.error("Home fetchMovieList failed:", result.reason);
    return [];
  });

  return (
    <div className="cinema-grain min-h-screen bg-dark-bg">
      <div className="mx-auto flex min-h-[58vh] max-w-7xl flex-col justify-center px-4 py-12">
        <div className="max-w-3xl">
          <p className="opacity-0 animate-fade-in-up text-xs uppercase tracking-[0.45em] text-cinema-accent/80">
            Movie discovery, rethought
          </p>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-light-text opacity-0 animate-fade-in-up sm:text-7xl">
            CineSelect
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-lg leading-8 text-muted-foreground opacity-0 animate-fade-in-up animate-fade-in-up-delay-1 sm:text-xl">
            Search and discover movies
          </p>
        </div>
        <div className="relative z-10 mt-8 w-full max-w-xl opacity-0 animate-fade-in-up animate-fade-in-up-delay-2">
          <MovieSearch />
        </div>
      </div>
      <div className="relative z-10 mx-auto max-w-7xl space-y-12 px-4 pb-16">
        <MovieSection title="Popular" movies={popular} href="/discover?preset=popular" />
        <MovieSection title="Now Playing" movies={nowPlaying} href="/discover?preset=now_playing" />
        <MovieSection title="Top Rated" movies={topRated} href="/discover?preset=top_rated" />
      </div>
    </div>
  );
}
