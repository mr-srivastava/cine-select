export const IMAGE_BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDE2IDkiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zz48cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iOSIgcng9IjIiIGZpbGw9IiMxMTE4MjciLz48L3N2Zz4=";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export type TmdbImageSize = "w92" | "w500" | "original";

export function tmdbImageUrl(path: string, size: TmdbImageSize): string {
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
