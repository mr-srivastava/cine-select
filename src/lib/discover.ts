export const GENRES = [
  ["28", "Action"],
  ["12", "Adventure"],
  ["16", "Animation"],
  ["35", "Comedy"],
  ["80", "Crime"],
  ["99", "Documentary"],
  ["18", "Drama"],
  ["10751", "Family"],
  ["14", "Fantasy"],
  ["36", "History"],
  ["27", "Horror"],
  ["10402", "Music"],
  ["9648", "Mystery"],
  ["10749", "Romance"],
  ["878", "Science Fiction"],
  ["53", "Thriller"],
] as const;

export const SORT_OPTIONS = [
  ["popularity.desc", "Circulation"],
  ["vote_average.desc", "Critical standing"],
  ["release_date.desc", "Newest arrivals"],
  ["revenue.desc", "Box office"],
] as const;

export const PRESET_SORT: Record<string, string> = {
  popular: "popularity.desc",
  now_playing: "release_date.desc",
  top_rated: "vote_average.desc",
};

export const REGION_OPTIONS = ["US", "GB", "IN", "CA", "AU"] as const;

export const LANGUAGE_OPTIONS = [
  ["en", "English"],
  ["hi", "Hindi"],
  ["es", "Spanish"],
  ["fr", "French"],
  ["de", "German"],
  ["it", "Italian"],
  ["ja", "Japanese"],
  ["ko", "Korean"],
  ["pt", "Portuguese"],
  ["zh", "Chinese"],
  ["sv", "Swedish"],
  ["da", "Danish"],
  ["tr", "Turkish"],
  ["nl", "Dutch"],
  ["no", "Norwegian"],
] as const;

export type MoodKey =
  | "gripping"
  | "intimate"
  | "brooding"
  | "expansive"
  | "unsettling"
  | "tender";

export type MoodConfig = {
  label: string;
  description: string;
  filters: {
    genre?: string;
    sort_by?: string;
    rating_min?: string;
    rating_max?: string;
    runtime_min?: string;
    runtime_max?: string;
  };
};

export const MOOD_CONFIG: Record<MoodKey, MoodConfig> = {
  gripping: {
    label: "Gripping",
    description: "High-tension programs with propulsion and bite.",
    filters: {
      genre: "53",
      sort_by: "popularity.desc",
      rating_min: "6.5",
      rating_max: "10",
      runtime_min: "95",
      runtime_max: "180",
    },
  },
  intimate: {
    label: "Intimate",
    description: "Close-quartered dramas that stay with a face and a feeling.",
    filters: {
      genre: "18",
      sort_by: "vote_average.desc",
      rating_min: "6.8",
      rating_max: "10",
      runtime_min: "80",
      runtime_max: "130",
    },
  },
  brooding: {
    label: "Brooding",
    description: "Shadowed crime and mystery selections with a slow burn.",
    filters: {
      genre: "9648",
      sort_by: "vote_average.desc",
      rating_min: "6.5",
      rating_max: "10",
      runtime_min: "90",
      runtime_max: "170",
    },
  },
  expansive: {
    label: "Expansive",
    description: "Large-canvas adventures and speculative worlds.",
    filters: {
      genre: "12",
      sort_by: "popularity.desc",
      rating_min: "6",
      rating_max: "10",
      runtime_min: "100",
      runtime_max: "220",
    },
  },
  unsettling: {
    label: "Unsettling",
    description: "Severe, disquieting titles with a colder pulse.",
    filters: {
      genre: "27",
      sort_by: "vote_average.desc",
      rating_min: "6.2",
      rating_max: "10",
      runtime_min: "85",
      runtime_max: "150",
    },
  },
  tender: {
    label: "Tender",
    description: "Warm romances and human-scaled works with emotional lift.",
    filters: {
      genre: "10749",
      sort_by: "vote_average.desc",
      rating_min: "6.3",
      rating_max: "10",
      runtime_min: "80",
      runtime_max: "145",
    },
  },
};

export function getMoodConfig(mood: string | undefined) {
  if (!mood) return undefined;
  return MOOD_CONFIG[mood as MoodKey];
}
