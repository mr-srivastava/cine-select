import { fetchMovieDetails } from "@/actions/tmdb.actions";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import React from "react";

export default async function Movie({ params }: { params: { id: string } }) {
  const movie = await fetchMovieDetails(Number(params.id));

  return (
    <div className="min-h-screen bg-gray-800">
      <div className="relative h-[50vh] bg-black">
        {movie?.backdrop_path && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${movie?.backdrop_path})`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-800" />
        <div className="container mx-auto px-4 h-full flex items-end pb-8">
          <div className="relative z-10 flex items-end">
            {movie?.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
                alt={movie?.title}
                width={200}
                height={300}
                className="rounded-lg shadow-lg mr-6 hidden sm:block"
              />
            )}
            <div className="text-white mb-4">
              <h1 className="text-4xl font-bold">{movie?.title}</h1>
              {movie?.tagline && <p className="text-xl">{movie?.tagline}</p>}
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-2">
            <PageBreadcrumb
              breadcrumbs={[
                { link: "/", label: "Home", isActive: false },
                {
                  link: `/movie/${movie?.id}`,
                  label: movie?.title,
                  isActive: true,
                },
              ]}
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Badge className="bg-gray-200 text-gray-600 text-sm font-semibold mr-2 flex items-center hover:bg-gray-200">
                <Star className="mr-2 h-4 w-4" />
                <p>{movie?.vote_average.toFixed(1)}</p>
              </Badge>
              <Separator orientation="vertical" className="h-6 mx-2" />
              <span className="text-gray-600">{movie?.release_date}</span>
              <Separator orientation="vertical" className="h-6 mx-2" />
              <span className="text-gray-600">{movie?.runtime} min</span>
            </div>
            <div className="flex gap-2 justify-end">
              {movie?.genres.map((genre) => (
                <Badge
                  key={genre.id}
                  className="bg-gray-300 text-gray-700 text-sm font-semibold"
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
          </div>
          <p className="text-lg mb-6">{movie?.overview}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Production Companies
              </h2>
              <ul className="list-disc list-inside">
                {movie?.production_companies.map((company) => (
                  <li key={company.id}>{company.name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Production Countries
              </h2>
              <ul className="list-disc list-inside">
                {movie?.production_countries.map((country) => (
                  <li key={country.iso_3166_1}>{country.name}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Spoken Languages</h2>
            <ul className="list-disc list-inside">
              {movie?.spoken_languages.map((language) => (
                <li key={language.iso_639_1}>{language.english_name}</li>
              ))}
            </ul>
          </div>
          {movie?.homepage && (
            <div className="mt-6">
              <a
                href={movie?.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block"
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
