"use server";

import { Movie, MovieSearchResponse, MovieSearchResult } from "@/types/tmdb";

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function searchMovies(query: string): Promise<MovieSearchResult[]> {
  if (!query) return [];

  if (!API_KEY) {
    console.error("TMDB_API_KEY is not set in environment variables");
    throw new Error("TMDB API key is not configured");
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
      throw new Error(`Failed to fetch movies: ${response.status} ${response.statusText}`);
    }

    const data: MovieSearchResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
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

    const data: Movie = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
}
