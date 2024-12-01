"use server";

import { Movie, MovieSearchResponse } from "@/types/tmdb";

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query) return [];

  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }

    const data: MovieSearchResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error searching movies:", error);
    return [];
  }
}

export async function fetchMovieDetails(movieId: number): Promise<Movie> {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`,
      { cache: "no-store" }
    );
    console.log(response)

    if (!response.ok) {
      throw new Error(response.statusText || "Failed to fetch movie details");
    }

    const data: Movie = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
}
