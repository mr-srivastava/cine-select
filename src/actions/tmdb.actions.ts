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
