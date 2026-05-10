"use server";

import { cache } from "react";
import { Movie, MovieSearchResult } from "@/types/tmdb";
import {
  fetchTmdbCredits,
  fetchTmdbDiscoverMovies,
  fetchTmdbList,
  fetchTmdbMovie,
  fetchTmdbWatchProviderList,
  fetchTmdbPerson,
  fetchTmdbPersonCombinedCredits,
  fetchTmdbPersonMovieCredits,
  fetchTmdbRecommendations,
  fetchTmdbWatchProviders,
  searchTmdbMovies,
  TmdbError,
} from "@/lib/tmdb-client";

export type MovieListType = "popular" | "now_playing" | "top_rated";

export async function fetchMovieList(
  listType: MovieListType,
  page = 1
): Promise<MovieSearchResult[]> {
  try {
    return await fetchTmdbList(listType, page);
  } catch (error) {
    if (error instanceof TmdbError) {
      console.error("TMDB list request failed:", error.message, {
        status: error.status,
        endpoint: error.endpoint,
      });
    } else {
      console.error(`Error fetching ${listType} movies:`, error);
    }
    throw error;
  }
}

export async function searchMovies(query: string): Promise<MovieSearchResult[]> {
  try {
    return await searchTmdbMovies(query);
  } catch (error) {
    if (error instanceof TmdbError) {
      console.error("TMDB search request failed:", error.message, {
        status: error.status,
        endpoint: error.endpoint,
      });
    } else {
      console.error("Error searching movies:", error);
    }
    return [];
  }
}

const cachedFetchMovieDetails = cache(async (movieId: number): Promise<Movie> => {
  try {
    return await fetchTmdbMovie(movieId);
  } catch (error) {
    if (error instanceof TmdbError) {
      console.error("TMDB details request failed:", error.message, {
        status: error.status,
        endpoint: error.endpoint,
      });
    } else {
      console.error("Error fetching movie details:", error);
    }
    throw error;
  }
});

export async function fetchMovieDetails(movieId: number): Promise<Movie> {
  return cachedFetchMovieDetails(movieId);
}

export async function fetchDiscoverMovies(
  params: Record<string, string | number | undefined>
) {
  try {
    return await fetchTmdbDiscoverMovies(params);
  } catch (error) {
    if (error instanceof TmdbError) {
      console.error("TMDB discover request failed:", error.message, {
        status: error.status,
        endpoint: error.endpoint,
      });
    } else {
      console.error("Error fetching discover movies:", error);
    }
    throw error;
  }
}

export async function fetchMovieRecommendations(movieId: number) {
  try {
    return await fetchTmdbRecommendations(movieId);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
}

export async function fetchMovieWatchProviders(movieId: number) {
  try {
    return await fetchTmdbWatchProviders(movieId);
  } catch (error) {
    console.error("Error fetching watch providers:", error);
    return { id: movieId, results: {} };
  }
}

export async function fetchWatchProviderList(region?: string) {
  try {
    return await fetchTmdbWatchProviderList(region);
  } catch (error) {
    console.error("Error fetching watch provider list:", error);
    return { results: [] };
  }
}

export async function fetchMovieCredits(movieId: number) {
  try {
    return await fetchTmdbCredits(movieId);
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    return { id: movieId, cast: [], crew: [] };
  }
}

const cachedFetchPersonDetails = cache(async (personId: number) => {
  try {
    return await fetchTmdbPerson(personId);
  } catch (error) {
    if (error instanceof TmdbError) {
      console.error("TMDB person request failed:", error.message, {
        status: error.status,
        endpoint: error.endpoint,
      });
    } else {
      console.error("Error fetching person details:", error);
    }
    throw error;
  }
});

export async function fetchPersonDetails(personId: number) {
  return cachedFetchPersonDetails(personId);
}

export async function fetchPersonMovieCredits(personId: number) {
  try {
    return await fetchTmdbPersonMovieCredits(personId);
  } catch (error) {
    console.error("Error fetching person movie credits:", error);
    return { cast: [], crew: [] };
  }
}

export async function fetchPersonCombinedCredits(personId: number) {
  try {
    return await fetchTmdbPersonCombinedCredits(personId);
  } catch (error) {
    console.error("Error fetching person combined credits:", error);
    return { cast: [], crew: [] };
  }
}
