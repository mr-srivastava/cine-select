import { fetchMovieDetails } from "@/actions/tmdb.actions";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import Image from "next/image";
import React from "react";

export default async function Movie({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await fetchMovieDetails(Number(id));

  return (
    <div className="cinema-grain min-h-screen bg-dark-bg">
      <div className="cinema-vignette relative h-[50vh] min-h-[280px] bg-dark-surface">
        {movie.backdrop_path && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-bg" />
        <div className="container relative z-10 mx-auto flex h-full items-end px-4 pb-8">
          <div className="flex items-end gap-6">
            {movie.poster_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={200}
                height={300}
                className="hidden rounded-lg shadow-2xl ring-1 ring-white/10 transition-transform duration-300 hover:scale-[1.02] sm:block"
              />
            )}
            <div className="mb-4 text-light-text">
              <h1 className="font-display text-4xl font-bold tracking-tight text-light-text opacity-0 animate-fade-in-up sm:text-5xl">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="mt-1 text-xl text-muted-foreground opacity-0 animate-fade-in-up animate-fade-in-up-delay-1">
                  {movie.tagline}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container relative z-10 mx-auto px-4 py-8">
        <div className="-mt-6 rounded-xl border border-border bg-card p-6 shadow-xl sm:-mt-8">
          <div className="mb-2">
            <PageBreadcrumb
              breadcrumbs={[
                { link: "/", label: "Home", isActive: false },
                {
                  link: `/movie/${movie.id}`,
                  label: movie.title,
                  isActive: true,
                },
              ]}
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Badge className="mr-2 flex items-center bg-secondary text-sm font-semibold text-secondary-foreground transition-colors duration-200 hover:bg-secondary/80">
                <Star className="mr-2 h-4 w-4" />
                <p>{movie.vote_average.toFixed(1)}</p>
              </Badge>
              <Separator orientation="vertical" className="h-6 mx-2" />
              <span className="text-muted-foreground">{movie.release_date}</span>
              <Separator orientation="vertical" className="h-6 mx-2" />
              <span className="text-muted-foreground">{movie.runtime} min</span>
            </div>
            <div className="flex gap-2 justify-end">
              {movie.genres.map((genre) => (
                <Badge
                  key={genre.id}
                  className="bg-secondary text-sm font-semibold text-secondary-foreground transition-colors duration-200 hover:bg-secondary/80"
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
          </div>
          <p className="text-lg mb-6">{movie.overview}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Production Companies
              </h2>
              <ul className="list-disc list-inside">
                {movie.production_companies.map((company) => (
                  <li key={company.id}>{company.name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Production Countries
              </h2>
              <ul className="list-disc list-inside">
                {movie.production_countries.map((country) => (
                  <li key={country.iso_3166_1}>{country.name}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Spoken Languages</h2>
            <ul className="list-disc list-inside">
              {movie.spoken_languages.map((language) => (
                <li key={language.iso_639_1}>{language.english_name}</li>
              ))}
            </ul>
          </div>
          {movie.homepage && (
            <div className="mt-6">
              <a
                href={movie.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Official Homepage
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
