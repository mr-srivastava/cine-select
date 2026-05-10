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
  genre_ids?: number[];
  original_language?: string;
}

export interface MovieSearchResponse {
  page: number;
  results: MovieSearchResult[];
  total_pages: number;
  total_results: number;
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
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

export interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
  display_priority?: number;
}

export interface WatchProviderCountryInfo {
  link: string;
  flatrate?: Provider[];
  buy?: Provider[];
  rent?: Provider[];
  ads?: Provider[];
  free?: Provider[];
}

export interface MovieWatchProviders {
  id: number;
  results: Record<string, WatchProviderCountryInfo>;
}

export interface WatchProviderListResponse {
  results: Provider[];
}

export interface MovieCreditCast {
  id: number;
  cast_id?: number;
  character: string;
  credit_id: string;
  gender?: number | null;
  name: string;
  order: number;
  original_name?: string;
  profile_path: string | null;
}

export interface MovieCreditCrew {
  id: number;
  credit_id: string;
  department: string;
  job: string;
  gender?: number | null;
  name: string;
  original_name?: string;
  profile_path: string | null;
}

export interface MovieCredits {
  id: number;
  cast: MovieCreditCast[];
  crew: MovieCreditCrew[];
}

export interface PersonMovieCreditRole {
  credit_id: string;
  character?: string;
  job?: string;
  department?: string;
}

export interface PersonMovieCreditItem extends MovieSearchResult {
  adult?: boolean;
  original_title?: string;
  character?: string;
  job?: string;
  credit_id?: string;
  order?: number;
}

export interface PersonCreditsResponse {
  cast: PersonMovieCreditItem[];
  crew: PersonMovieCreditItem[];
}

export interface Person {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  homepage: string | null;
  imdb_id: string | null;
  known_for_department: string;
  place_of_birth: string | null;
  popularity: number;
  profile_path: string | null;
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

function isGenre(item: unknown): item is Genre {
  return (
    item !== null &&
    typeof item === "object" &&
    typeof (item as Genre).id === "number" &&
    typeof (item as Genre).name === "string"
  );
}

function isProductionCompany(item: unknown): item is ProductionCompany {
  const p = item as ProductionCompany;
  return (
    item !== null &&
    typeof item === "object" &&
    typeof p.id === "number" &&
    typeof p.name === "string" &&
    typeof p.origin_country === "string"
  );
}

function isProductionCountry(item: unknown): item is ProductionCountry {
  const c = item as ProductionCountry;
  return (
    item !== null &&
    typeof item === "object" &&
    typeof c.iso_3166_1 === "string" &&
    typeof c.name === "string"
  );
}

function isSpokenLanguage(item: unknown): item is SpokenLanguage {
  const s = item as SpokenLanguage;
  return (
    item !== null &&
    typeof item === "object" &&
    typeof s.iso_639_1 === "string" &&
    typeof s.name === "string"
  );
}

/** Type guard: narrows unknown to Movie when shape matches required fields */
export function isMovie(value: unknown): value is Movie {
  if (value === null || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o.id === "number" &&
    typeof o.title === "string" &&
    typeof o.overview === "string" &&
    typeof o.original_title === "string" &&
    typeof o.status === "string" &&
    typeof o.adult === "boolean" &&
    (typeof o.backdrop_path === "string" || o.backdrop_path === null) &&
    (typeof o.poster_path === "string" || o.poster_path === null) &&
    typeof o.budget === "number" &&
    typeof o.revenue === "number" &&
    typeof o.vote_count === "number" &&
    (typeof o.runtime === "number" || o.runtime === null) &&
    Array.isArray(o.genres) &&
    o.genres.every(isGenre) &&
    Array.isArray(o.production_companies) &&
    o.production_companies.every(isProductionCompany) &&
    Array.isArray(o.production_countries) &&
    o.production_countries.every(isProductionCountry) &&
    Array.isArray(o.spoken_languages) &&
    o.spoken_languages.every(isSpokenLanguage) &&
    typeof o.release_date === "string" &&
    typeof o.vote_average === "number"
  );
}

export function isPerson(value: unknown): value is Person {
  if (value === null || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o.id === "number" &&
    typeof o.name === "string" &&
    typeof o.biography === "string" &&
    (typeof o.profile_path === "string" || o.profile_path === null) &&
    (typeof o.imdb_id === "string" || o.imdb_id === null)
  );
}
