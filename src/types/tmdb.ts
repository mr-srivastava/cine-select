/** Shape returned by TMDB search/list endpoints (subset of full movie details) */
export interface MovieSearchResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  backdrop_path?: string | null;
  overview?: string;
  vote_average?: number;
  vote_count?: number;
}

export interface MovieSearchResponse {
  page: number;
  results: MovieSearchResult[];
  total_pages: number;
  total_results: number;
}

interface Collection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  name: string;
  id: number;
  logo_path?: string | null;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name?: string;
  iso_639_1: string;
  name: string;
}

/** TMDB movie details API response shape (matches /movie/{id} response) */
export interface Movie {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: null | Collection;
  budget: number;
  genres: Genre[];
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number | null;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

/** Type guard: narrows unknown to Movie when shape matches required fields */
export function isMovie(value: unknown): value is Movie {
  if (value === null || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o.id === "number" &&
    typeof o.title === "string" &&
    typeof o.overview === "string" &&
    Array.isArray(o.genres) &&
    Array.isArray(o.production_companies) &&
    Array.isArray(o.production_countries) &&
    Array.isArray(o.spoken_languages) &&
    typeof o.release_date === "string" &&
    typeof o.vote_average === "number"
  );
}
