import { fetchDiscoverMovies, fetchWatchProviderList } from "@/actions/tmdb.actions";
import MovieCard from "@/components/MovieCard";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Metadata } from "next";
import DiscoverFiltersCard from "./_components/DiscoverFiltersCard";

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
] as const;

const SORT_OPTIONS = [
  ["popularity.desc", "Popularity"],
  ["vote_average.desc", "Top rated"],
  ["release_date.desc", "Newest"],
  ["revenue.desc", "Revenue"],
] as const;

const PRESET_SORT: Record<string, string> = {
  popular: "popularity.desc",
  now_playing: "release_date.desc",
  top_rated: "vote_average.desc",
};

const REGION_OPTIONS = ["US", "GB", "IN", "CA", "AU"] as const;

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

function getPaginationPages(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 2) {
    return [1, 2, 3, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 1) {
    return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
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
  const hrefParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => typeof value === "string" && value !== ""),
  ) as Record<string, string>;

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

        <DiscoverFiltersCard
          preset={preset}
          sortBy={sortBy}
          region={region}
          ratingMin={ratingMin}
          ratingMax={ratingMax}
          runtimeMin={runtimeMin}
          runtimeMax={runtimeMax}
          hasActiveFilters={hasActiveFilters}
          genre={getString(params.genre) ?? ""}
          language={getString(params.language) ?? ""}
          year={getString(params.year) ?? ""}
          watchProvider={getString(params.watch_provider) ?? ""}
          providerOptions={providerOptions.map((provider) => ({
            value: String(provider.provider_id),
            label: provider.provider_name,
            logoPath: provider.logo_path,
          }))}
          genreOptions={GENRES}
          sortOptions={SORT_OPTIONS}
          regionOptions={REGION_OPTIONS}
        />



        <ScrollArea className="h-auto">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {results.results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </ScrollArea>
        <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-background/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Page {results.page} of {results.total_pages.toLocaleString()}
          </p>
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent className="gap-1 sm:gap-2">
              <PaginationItem>
                <PaginationPrevious
                  href={buildHref(hrefParams, Math.max(1, results.page - 1))}
                  aria-disabled={results.page <= 1}
                  className={results.page <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {getPaginationPages(results.page, results.total_pages).map((item, index) => {
                if (item === "ellipsis") {
                  return (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return (
                  <PaginationItem key={item}>
                    <PaginationLink
                      href={buildHref(hrefParams, Number(item))}
                      isActive={item === results.page}
                      size="icon"
                      className="rounded-lg"
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  href={buildHref(hrefParams, Math.min(results.total_pages, results.page + 1))}
                  aria-disabled={results.page >= results.total_pages}
                  className={results.page >= results.total_pages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
