import PageBreadcrumb from "@/components/PageBreadcrumb";
import { MovieCard } from "@/components/MovieCard";
import { MovieMetaBar } from "./MovieMetaBar";
import type { Genre } from "@/types/tmdb";

type MovieHeroProps = {
  id: number;
  title: string;
  tagline: string | null;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  runtime: number | null;
  genres: Genre[];
};

export function MovieHero({
  id,
  title,
  tagline,
  backdrop_path,
  poster_path,
  vote_average,
  release_date,
  runtime,
  genres,
}: MovieHeroProps) {
  return (
    <div className="cinema-vignette relative h-[50vh] min-h-[280px] bg-dark-surface">
      {backdrop_path ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${backdrop_path})`,
          }}
        />
      ) : null}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent from-0% via-black/50 via-30% to-[hsl(var(--dark-bg))] to-100%"
        aria-hidden
      />
      <div className="container relative z-10 mx-auto flex h-full flex-col justify-end px-4 pb-8">
        <div className="mb-4">
          <PageBreadcrumb
            breadcrumbs={[
              { link: "/", label: "Home", isActive: false },
              { link: `/movie/${id}`, label: title, isActive: true },
            ]}
          />
        </div>
        <div className="flex items-start gap-6">
          {poster_path ? (
            <MovieCard.Poster
              poster_path={poster_path}
              title={title}
              width={200}
              height={300}
              className="hidden rounded-lg shadow-2xl ring-1 ring-white/10 transition-transform duration-300 hover:scale-[1.02] sm:block"
            />
          ) : null}
          <div className="mb-4 text-light-text">
            <h1 className="font-display text-4xl font-bold tracking-tight text-light-text opacity-0 animate-fade-in-up sm:text-5xl">
              {title}
            </h1>
            {tagline ? (
              <p className="mt-1 text-xl text-muted-foreground opacity-0 animate-fade-in-up animate-fade-in-up-delay-1">
                {tagline}
              </p>
            ) : null}
            <div className="mt-3">
              <MovieMetaBar
                vote_average={vote_average}
                release_date={release_date}
                runtime={runtime}
                genres={genres}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
