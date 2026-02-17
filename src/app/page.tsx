import MovieSearch from "@/components/MovieSearch";
import MovieSection from "@/components/MovieSection";
import { fetchMovieList } from "@/actions/tmdb.actions";

export default async function Home() {
  const [popular, nowPlaying, topRated] = await Promise.all([
    fetchMovieList("popular", 1),
    fetchMovieList("now_playing", 1),
    fetchMovieList("top_rated", 1),
  ]);

  return (
    <div className="cinema-grain min-h-screen bg-dark-bg">
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-12">
        <h1 className="font-display text-5xl font-bold tracking-tight text-light-text opacity-0 animate-fade-in-up sm:text-6xl">
          CineSelect
        </h1>
        <p className="text-muted-foreground opacity-0 animate-fade-in-up animate-fade-in-up-delay-1 mt-2 text-center text-lg">
          Search and discover movies
        </p>
        <div className="relative z-10 mt-6 w-full max-w-md opacity-0 animate-fade-in-up animate-fade-in-up-delay-2">
          <MovieSearch />
        </div>
      </div>
      <div className="relative z-10 mx-auto max-w-7xl space-y-10 px-4 pb-16">
        <MovieSection title="Popular" movies={popular} />
        <MovieSection title="Now Playing" movies={nowPlaying} />
        <MovieSection title="Top Rated" movies={topRated} />
      </div>
    </div>
  );
}
