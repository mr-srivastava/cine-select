"use server";

import { Movie, MovieSearchResponse, MovieSearchResult, isMovie } from "@/types/tmdb";

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export type MovieListType = "popular" | "now_playing" | "top_rated";

export async function fetchMovieList(
  listType: MovieListType,
  page = 1
): Promise<MovieSearchResult[]> {
  const safePage =
    typeof page === "number" && Number.isInteger(page) && page >= 1 ? page : 1;

  if (!API_KEY) {
    console.error("TMDB_API_KEY is not set in environment variables");
    throw new Error("TMDB API key is not configured");
  }

  try {
    const response = await fetch(
      `${BASE_URL}/movie/${listType}?api_key=${API_KEY}&language=en-US&page=${safePage}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`TMDB API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to fetch movies: ${response.status} ${response.statusText}`);
    }

    const data: MovieSearchResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error(`Error fetching ${listType} movies:`, error);
    throw error;
  }
}

export async function searchMovies(query: string): Promise<MovieSearchResult[]> {
  if (!query) return [];

  if (!API_KEY) {
    console.error("TMDB_API_KEY is not set in environment variables");
    return [];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`TMDB API error: ${response.status} ${response.statusText}`, errorText);
      return [];
    }

    const data: MovieSearchResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error searching movies:", error);
    return [];
  }
}

export async function fetchMovieDetails(movieId: number): Promise<Movie> {
  if (!API_KEY) {
    console.error("TMDB_API_KEY is not set in environment variables");
    throw new Error("TMDB API key is not configured");
  }

  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`TMDB API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to fetch movie details: ${response.status} ${response.statusText}`);
    }

    const data: unknown = await response.json();
    if (!isMovie(data)) {
      console.error("TMDB movie details response shape invalid", data);
      throw new Error("Invalid movie details response from API");
    }
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
}
