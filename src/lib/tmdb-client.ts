import {
  Movie,
  MovieCredits,
  MovieSearchResponse,
  MovieSearchResult,
  MovieWatchProviders,
  PaginatedResponse,
  Person,
  PersonCreditsResponse,
  WatchProviderListResponse,
  isMovie,
  isPerson,
} from "@/types/tmdb";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export type TmdbEndpoint =
  | `/movie/${string}`
  | `/person/${string}`
  | "/search/movie"
  | "/discover/movie"
  | `/movie/${string}/recommendations`
  | `/movie/${string}/credits`
  | `/movie/${string}/watch/providers`
  | "/watch/providers/movie"
  | `/person/${string}/movie_credits`
  | `/person/${string}/combined_credits`;

export class TmdbError extends Error {
  readonly status?: number;
  readonly endpoint: string;
  readonly payload?: string;

  constructor(message: string, options: { status?: number; endpoint: string; payload?: string }) {
    super(message);
    this.name = "TmdbError";
    this.status = options.status;
    this.endpoint = options.endpoint;
    this.payload = options.payload;
  }
}

function getTmdbApiKey(): string {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new TmdbError("TMDB API key is not configured", { endpoint: "env:TMDB_API_KEY" });
  }
  return apiKey;
}

function buildTmdbUrl(endpoint: TmdbEndpoint, params: Record<string, string | number | undefined>) {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", getTmdbApiKey());
  url.searchParams.set("language", "en-US");

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  return url;
}

async function tmdbFetch(endpoint: TmdbEndpoint, params: Record<string, string | number | undefined>) {
  const response = await fetch(buildTmdbUrl(endpoint, params), { cache: "no-store" });
  const payload = await response.text();

  if (!response.ok) {
    throw new TmdbError(`TMDB request failed with ${response.status} ${response.statusText}`, {
      status: response.status,
      endpoint,
      payload,
    });
  }

  return payload;
}

function parseTmdbJson<T>(payload: string, endpoint: TmdbEndpoint): T {
  try {
    return JSON.parse(payload) as T;
  } catch {
    throw new TmdbError("TMDB returned invalid JSON", { endpoint, payload });
  }
}

async function fetchTmdbJson<T>(
  endpoint: TmdbEndpoint,
  params: Record<string, string | number | undefined>,
): Promise<T> {
  const payload = await tmdbFetch(endpoint, params);
  return parseTmdbJson<T>(payload, endpoint);
}

export async function fetchTmdbList(
  listType: "popular" | "now_playing" | "top_rated",
  page = 1
): Promise<MovieSearchResult[]> {
  const safePage = Number.isInteger(page) && page >= 1 ? page : 1;
  const data = await fetchTmdbJson<MovieSearchResponse>(`/movie/${listType}`, { page: safePage });
  return data.results;
}

export async function searchTmdbMovies(query: string): Promise<MovieSearchResult[]> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  const data = await fetchTmdbJson<MovieSearchResponse>("/search/movie", { query: trimmedQuery });
  return data.results;
}

export async function fetchTmdbMovie(movieId: number): Promise<Movie> {
  const payload = await tmdbFetch(`/movie/${movieId}`, {});
  const data: unknown = parseTmdbJson<unknown>(payload, `/movie/${movieId}`);

  if (!isMovie(data)) {
    throw new TmdbError("Invalid movie details response from TMDB", {
      endpoint: `/movie/${movieId}`,
      payload,
    });
  }

  return data;
}

export async function fetchTmdbDiscoverMovies(
  params: Record<string, string | number | undefined>
): Promise<PaginatedResponse<MovieSearchResult>> {
  return await fetchTmdbJson<PaginatedResponse<MovieSearchResult>>("/discover/movie", params);
}

export async function fetchTmdbRecommendations(movieId: number, page = 1) {
  return await fetchTmdbJson<PaginatedResponse<MovieSearchResult>>(`/movie/${movieId}/recommendations`, {
    page,
  });
}

export async function fetchTmdbWatchProviders(movieId: number): Promise<MovieWatchProviders> {
  return await fetchTmdbJson<MovieWatchProviders>(`/movie/${movieId}/watch/providers`, {});
}

export async function fetchTmdbWatchProviderList(
  watchRegion?: string,
): Promise<WatchProviderListResponse> {
  return await fetchTmdbJson<WatchProviderListResponse>("/watch/providers/movie", {
    watch_region: watchRegion,
  });
}

export async function fetchTmdbCredits(movieId: number): Promise<MovieCredits> {
  return await fetchTmdbJson<MovieCredits>(`/movie/${movieId}/credits`, {});
}

export async function fetchTmdbPerson(personId: number): Promise<Person> {
  const data = await fetchTmdbJson<unknown>(`/person/${personId}`, {});
  if (!isPerson(data)) {
    throw new TmdbError("Invalid person response from TMDB", {
      endpoint: `/person/${personId}`,
    });
  }
  return data;
}

export async function fetchTmdbPersonMovieCredits(personId: number): Promise<PersonCreditsResponse> {
  return await fetchTmdbJson<PersonCreditsResponse>(`/person/${personId}/movie_credits`, {});
}

export async function fetchTmdbPersonCombinedCredits(personId: number): Promise<PersonCreditsResponse> {
  return await fetchTmdbJson<PersonCreditsResponse>(`/person/${personId}/combined_credits`, {});
}
