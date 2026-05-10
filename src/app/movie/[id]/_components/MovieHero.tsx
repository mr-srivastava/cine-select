import PageBreadcrumb from "@/components/PageBreadcrumb";
import { MovieCard } from "@/components/MovieCard";
import WatchlistToggleButton from "@/components/WatchlistToggleButton";
import { MovieMetaBar } from "./MovieMetaBar";
import type { Genre } from "@/types/tmdb";
import Image from "next/image";
import { IMAGE_BLUR_DATA_URL, tmdbImageUrl } from "@/lib/image";

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
    <div className="cinema-vignette relative min-h-[420px] bg-dark-surface">
      {backdrop_path ? (
        <Image
          src={tmdbImageUrl(backdrop_path, "original")}
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={IMAGE_BLUR_DATA_URL}
          className="object-cover opacity-45"
          aria-hidden="true"
        />
      ) : null}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-[hsl(var(--dark-bg))]"
        aria-hidden
      />
      <div className="container relative z-10 mx-auto flex min-h-[420px] flex-col justify-end px-4 pb-10 pt-10">
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
              className="hidden rounded-[24px] shadow-2xl ring-1 ring-white/10 transition-transform duration-300 hover:scale-[1.02] sm:block"
            />
          ) : null}
          <div className="mb-4 max-w-3xl text-light-text">
            <p className="opacity-0 animate-fade-in-up text-[11px] uppercase tracking-[0.38em] text-primary/80">
              Film dossier
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-[0.1em] text-light-text opacity-0 animate-fade-in-up sm:text-5xl">
              {title}
            </h1>
            {tagline ? (
              <p className="mt-2 max-w-2xl text-lg italic text-muted-foreground opacity-0 animate-fade-in-up animate-fade-in-up-delay-1 sm:text-xl">
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
            <div className="flex flex-wrap gap-3">
              <WatchlistToggleButton
                movie={{ id, title, poster_path, release_date, vote_average }}
                className="rounded-full border-border/60 bg-background/75 px-5 backdrop-blur"
                size="lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
