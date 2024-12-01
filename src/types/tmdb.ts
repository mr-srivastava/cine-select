export interface MovieSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface Genre {
  id: number;
  name: string;
}

interface ProductionCompany {
  name: string;
  id: number;
  logo_path?: string | null;
  origin_country: string;
}

interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface SpokenLanguage {
  english_name?: string;
  iso_639_1: string;
  name: string;
}

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: null | object; // Specify the structure of the collection if available
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string; // Use Date if you want to parse it as a date
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
