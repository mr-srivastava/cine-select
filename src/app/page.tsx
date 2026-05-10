import MovieSearch from "@/components/MovieSearch";
import MovieSection from "@/components/MovieSection";
import { fetchMovieList } from "@/actions/tmdb.actions";
import { Button } from "@/components/ui/button";
import { MOOD_CONFIG } from "@/lib/discover";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Discover Films",
  description: "Search the CineSelect archive by title, mood, and curated programme.",
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
      <div className="mx-auto flex min-h-[64vh] max-w-7xl flex-col justify-center px-4 py-12">
        <div className="rounded-[36px] border border-border/60 bg-background/35 px-5 py-8 shadow-[0_40px_120px_rgba(0,0,0,0.34)] backdrop-blur sm:px-8 sm:py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <p className="opacity-0 animate-fade-in-up text-xs uppercase tracking-[0.45em] text-primary/80">
                A private film register
              </p>
              <h1 className="mt-4 font-display text-5xl font-semibold uppercase tracking-[0.14em] text-light-text opacity-0 animate-fade-in-up sm:text-7xl">
                CineSelect
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground opacity-0 animate-fade-in-up animate-fade-in-up-delay-1 sm:text-xl">
                Search the archive directly, follow a curated mood, or move through live programmes already in circulation.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 opacity-0 animate-fade-in-up animate-fade-in-up-delay-1">
              <Button asChild className="rounded-full px-6">
                <Link href="/discover">Open catalogue</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full px-6">
                <Link href="/watchlist">View watchlist</Link>
              </Button>
            </div>
          </div>

          <div className="relative z-10 mt-8 w-full max-w-2xl opacity-0 animate-fade-in-up animate-fade-in-up-delay-2">
            <MovieSearch />
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {Object.entries(MOOD_CONFIG).map(([value, mood]) => (
              <Link
                key={value}
                href={`/discover?mood=${value}`}
                className="group rounded-[28px] border border-border/60 bg-background/45 px-4 py-4 transition-colors duration-200 hover:border-primary/40 hover:bg-background/60"
              >
                <p className="font-display text-lg uppercase tracking-[0.12em] text-light-text group-hover:text-primary">
                  {mood.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{mood.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="relative z-10 mx-auto max-w-7xl space-y-12 px-4 pb-16">
        <MovieSection
          title="Popular circulation"
          description="The titles presently moving fastest through the broader public conversation."
          movies={popular}
          href="/discover?preset=popular"
        />
        <MovieSection
          title="Current release slate"
          description="A live record of recent arrivals and theatrical momentum."
          movies={nowPlaying}
          href="/discover?preset=now_playing"
        />
        <MovieSection
          title="Critical standing"
          description="Works holding the highest average mark across the present catalogue."
          movies={topRated}
          href="/discover?preset=top_rated"
        />
      </div>
    </div>
  );
}
