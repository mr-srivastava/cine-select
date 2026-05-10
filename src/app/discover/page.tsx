import { fetchDiscoverMovies, fetchWatchProviderList } from "@/actions/tmdb.actions";
import MovieCard from "@/components/MovieCard";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Metadata } from "next";
import Link from "next/link";
import DiscoverRangeFilters from "./_components/DiscoverRangeFilters";
import SearchablePicker from "./_components/SearchablePicker";

const GENRES = [
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
];

const SORT_OPTIONS = [
  ["popularity.desc", "Popularity"],
  ["vote_average.desc", "Top rated"],
  ["release_date.desc", "Newest"],
  ["revenue.desc", "Revenue"],
];

const PRESET_SORT: Record<string, string> = {
  popular: "popularity.desc",
  now_playing: "release_date.desc",
  top_rated: "vote_average.desc",
};

const REGION_OPTIONS = ["US", "GB", "IN", "CA", "AU"];

function getString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getNumber(value: string | undefined) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function buildHref(params: Record<string, string | undefined>, page: number) {
  const nextParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) nextParams.set(key, value);
  }
  nextParams.set("page", String(page));
  return `/discover?${nextParams.toString()}`;
}

export const metadata: Metadata = {
  title: "Discover",
  description: "Filter and browse movies with TMDB discover controls.",
};

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const preset = getString(params.preset);
  const region = (getString(params.region) ?? "US").toUpperCase();
  const ratingMin = clamp(getNumber(getString(params.rating_min)) ?? 0, 0, 10);
  const ratingMax = clamp(getNumber(getString(params.rating_max)) ?? 10, 0, 10);
  const runtimeMin = clamp(getNumber(getString(params.runtime_min)) ?? 0, 0, 300);
  const runtimeMax = clamp(getNumber(getString(params.runtime_max)) ?? 300, 0, 300);

  const sortBy = getString(params.sort_by) ?? (preset ? PRESET_SORT[preset] : "popularity.desc");
  const page = Math.max(1, getNumber(getString(params.page)) ?? 1);
  const discoverParams = {
    page,
    sort_by: sortBy,
    with_genres: getString(params.genre),
    primary_release_year: getNumber(getString(params.year)),
    "vote_average.gte": ratingMin,
    "vote_average.lte": ratingMax,
    "with_runtime.gte": runtimeMin,
    "with_runtime.lte": runtimeMax,
    with_original_language: getString(params.language),
    region,
    watch_region: region,
    with_watch_providers: getString(params.watch_provider),
  } as Record<string, string | number | undefined>;

  if (!discoverParams.with_watch_providers) {
    delete discoverParams.watch_region;
  }
  if (!discoverParams.with_original_language) delete discoverParams.with_original_language;
  if (!discoverParams.with_watch_providers) delete discoverParams.with_watch_providers;

  const [watchProviders, results] = await Promise.all([
    fetchWatchProviderList(region),
    fetchDiscoverMovies(discoverParams),
  ]);
  const providerOptions = watchProviders.results
    .slice()
    .sort((a, b) => (a.display_priority ?? 0) - (b.display_priority ?? 0));
  const hasActiveFilters =
    Boolean(getString(params.genre)) ||
    Boolean(getString(params.sort_by)) ||
    Boolean(getString(params.region) && getString(params.region)?.toUpperCase() !== "US") ||
    Boolean(getString(params.language)) ||
    Boolean(getString(params.year)) ||
    ratingMin !== 0 ||
    ratingMax !== 10 ||
    runtimeMin !== 0 ||
    runtimeMax !== 300 ||
    Boolean(getString(params.watch_provider)) ||
    Boolean(preset);

  return (
    <div className="cinema-grain min-h-screen bg-dark-bg">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10">
        <PageBreadcrumb
          breadcrumbs={[
            { link: "/", label: "Home", isActive: false },
            { link: "/discover", label: "Discover", isActive: true },
          ]}
        />

        <div className="flex flex-col gap-2">
          <h1 className="font-display text-4xl font-bold tracking-tight text-light-text sm:text-5xl">
            Discover movies
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Mix curated presets with filters for genre, release year, runtime, ratings, language, and streaming region.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Adjust the discovery controls and refine the result grid.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" method="get">
              {preset ? <input name="preset" defaultValue={preset} hidden /> : null}
              <input name="page" defaultValue="1" hidden />

              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                Genre
                <SearchablePicker
                  name="genre"
                  value={getString(params.genre) ?? ""}
                  placeholder="All genres"
                  emptyLabel="No genres found."
                  clearLabel="All genres"
                  options={GENRES.map(([value, label]) => ({ value, label }))}
                />
              </div>

              <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                Sort by
                <Select name="sort_by" defaultValue={sortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Popularity" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

              <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                Region
                <Select name="region" defaultValue={region}>
                  <SelectTrigger>
                    <SelectValue placeholder="US" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGION_OPTIONS.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

              <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                Language
                <Input
                  name="language"
                  defaultValue={getString(params.language) ?? ""}
                  placeholder="en"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                Release year
                <Input
                  name="year"
                  defaultValue={getString(params.year) ?? ""}
                  placeholder="2025"
                />
              </label>

              <DiscoverRangeFilters
                ratingMin={ratingMin}
                ratingMax={ratingMax}
                runtimeMin={runtimeMin}
                runtimeMax={runtimeMax}
              />

              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                Provider
                <SearchablePicker
                  name="watch_provider"
                  value={getString(params.watch_provider) ?? ""}
                  placeholder="Any provider"
                  emptyLabel="No providers found."
                  clearLabel="Any provider"
                  options={providerOptions.map((provider) => ({
                    value: String(provider.provider_id),
                    label: provider.provider_name,
                    logoPath: provider.logo_path,
                  }))}
                />
              </div>

              <div className="flex items-end gap-3">
                <Button type="submit" className="w-full">
                  Apply filters
                </Button>
              </div>
            </form>

            <div className="flex flex-wrap gap-2">
              {preset ? <Badge variant="secondary">Preset: {preset.replace("_", " ")}</Badge> : null}
              {hasActiveFilters ? (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/discover">Clear filters</Link>
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Page {results.page} of {results.total_pages}
          </p>
          <div className="flex gap-3">
            <Button asChild variant="outline" size="sm" className={results.page <= 1 ? "pointer-events-none opacity-50" : ""}>
              <Link href={buildHref(Object.fromEntries(Object.entries(params).filter(([, value]) => typeof value === "string" && value !== "")) as Record<string, string>, Math.max(1, results.page - 1))}>
                Previous
              </Link>
            </Button>
            <Button asChild size="sm" className={results.page >= results.total_pages ? "pointer-events-none opacity-50" : ""}>
              <Link href={buildHref(Object.fromEntries(Object.entries(params).filter(([, value]) => typeof value === "string" && value !== "")) as Record<string, string>, results.page + 1)}>
                Next
              </Link>
            </Button>
          </div>
        </div>

        <ScrollArea className="h-auto">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {results.results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
