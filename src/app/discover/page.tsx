import {
  fetchDiscoverMovies,
  fetchMovieDetails,
  fetchMovieWatchProviders,
  fetchWatchProviderList,
  searchMoviesPage,
} from "@/actions/tmdb.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MovieCard from "@/components/MovieCard";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { getMoodConfig, GENRES, LANGUAGE_OPTIONS, MOOD_CONFIG, PRESET_SORT, REGION_OPTIONS, SORT_OPTIONS } from "@/lib/discover";
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
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import Link from "next/link";
import DiscoverFiltersCard from "./_components/DiscoverFiltersCard";

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

function buildParamsWithout(params: Record<string, string | string[] | undefined>, keyToRemove: string) {
  const nextParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (key === keyToRemove) continue;
    if (typeof value === "string" && value !== "") {
      nextParams.set(key, value);
    }
  }

  const queryString = nextParams.toString();
  return queryString ? `/discover?${queryString}` : "/discover";
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
  description: "Search, filter, and browse movies with CineSelect's archive-inspired catalogue.",
};

function resolveStringParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
  fallback?: string,
) {
  const explicit = getString(params[key]);
  return explicit && explicit.trim() !== "" ? explicit : fallback;
}

async function filterSearchResults({
  movies,
  region,
  genre,
  language,
  year,
  ratingMin,
  ratingMax,
  runtimeMin,
  runtimeMax,
  watchProvider,
}: {
  movies: Awaited<ReturnType<typeof searchMoviesPage>>["results"];
  region: string;
  genre: string;
  language: string;
  year: string;
  ratingMin: number;
  ratingMax: number;
  runtimeMin: number;
  runtimeMax: number;
  watchProvider: string;
}) {
  const needsRuntime = runtimeMin !== 0 || runtimeMax !== 300;
  const needsProvider = Boolean(watchProvider);
  const needsDetailFilter = Boolean(genre || language || year || needsRuntime || needsProvider);

  if (!needsDetailFilter) {
    return movies.filter((movie) => {
      const rating = movie.vote_average ?? 0;
      return rating >= ratingMin && rating <= ratingMax;
    });
  }

  const entries = await Promise.all(
    movies.map(async (movie) => {
      try {
        const details = await fetchMovieDetails(movie.id);
        const providers = needsProvider ? await fetchMovieWatchProviders(movie.id) : null;
        return { movie, details, providers };
      } catch {
        return null;
      }
    }),
  );

  return entries
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .filter(({ movie, details, providers }) => {
      const matchesGenre = !genre || details.genres.some((item) => String(item.id) === genre);
      const matchesLanguage = !language || details.original_language === language;
      const matchesYear = !year || details.release_date?.startsWith(year);
      const rating = movie.vote_average ?? details.vote_average ?? 0;
      const matchesRating = rating >= ratingMin && rating <= ratingMax;
      const runtime = details.runtime ?? 0;
      const matchesRuntime = runtime >= runtimeMin && runtime <= runtimeMax;
      const regionProviders = providers?.results[region];
      const providerIds = [
        ...(regionProviders?.flatrate ?? []),
        ...(regionProviders?.buy ?? []),
        ...(regionProviders?.rent ?? []),
        ...(regionProviders?.ads ?? []),
        ...(regionProviders?.free ?? []),
      ].map((provider) => String(provider.provider_id));
      const matchesProvider = !watchProvider || providerIds.includes(watchProvider);

      return (
        matchesGenre &&
        matchesLanguage &&
        matchesYear &&
        matchesRating &&
        matchesRuntime &&
        matchesProvider
      );
    })
    .map(({ movie }) => movie);
}

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const preset = getString(params.preset);
  const mood = getString(params.mood);
  const moodConfig = getMoodConfig(mood);
  const query = getString(params.q)?.trim() ?? "";
  const region = (resolveStringParam(params, "region", "US") ?? "US").toUpperCase();
  const genre = resolveStringParam(params, "genre", moodConfig?.filters.genre) ?? "";
  const language = resolveStringParam(params, "language", "") ?? "";
  const year = resolveStringParam(params, "year", "") ?? "";
  const watchProvider = resolveStringParam(params, "watch_provider", "") ?? "";
  const ratingMin = clamp(
    getNumber(getString(params.rating_min)) ?? getNumber(moodConfig?.filters.rating_min) ?? 0,
    0,
    10,
  );
  const ratingMax = clamp(
    getNumber(getString(params.rating_max)) ?? getNumber(moodConfig?.filters.rating_max) ?? 10,
    0,
    10,
  );
  const runtimeMin = clamp(
    getNumber(getString(params.runtime_min)) ?? getNumber(moodConfig?.filters.runtime_min) ?? 0,
    0,
    300,
  );
  const runtimeMax = clamp(
    getNumber(getString(params.runtime_max)) ?? getNumber(moodConfig?.filters.runtime_max) ?? 300,
    0,
    300,
  );

  const sortBy = resolveStringParam(params, "sort_by", preset ? PRESET_SORT[preset] : moodConfig?.filters.sort_by) ?? "popularity.desc";
  const page = Math.max(1, getNumber(getString(params.page)) ?? 1);
  const discoverParams = {
    page,
    sort_by: sortBy,
    with_genres: genre || undefined,
    primary_release_year: getNumber(year),
    "vote_average.gte": ratingMin,
    "vote_average.lte": ratingMax,
    "with_runtime.gte": runtimeMin,
    "with_runtime.lte": runtimeMax,
    with_original_language: language || undefined,
    region,
    watch_region: region,
    with_watch_providers: watchProvider || undefined,
  } as Record<string, string | number | undefined>;

  if (!discoverParams.with_watch_providers) {
    delete discoverParams.watch_region;
  }
  if (!discoverParams.with_original_language) delete discoverParams.with_original_language;
  if (!discoverParams.with_watch_providers) delete discoverParams.with_watch_providers;

  const [watchProviders, baseResults] = await Promise.all([
    fetchWatchProviderList(region),
    query ? searchMoviesPage(query, page) : fetchDiscoverMovies(discoverParams),
  ]);
  const results = query
    ? {
        ...baseResults,
        results: await filterSearchResults({
          movies: baseResults.results,
          region,
          genre,
          language,
          year,
          ratingMin,
          ratingMax,
          runtimeMin,
          runtimeMax,
          watchProvider,
        }),
      }
    : baseResults;
  const providerOptions = watchProviders.results
    .slice()
    .sort((a, b) => (a.display_priority ?? 0) - (b.display_priority ?? 0));
  const hasActiveFilters =
    Boolean(query) ||
    Boolean(genre) ||
    Boolean(getString(params.sort_by)) ||
    Boolean(getString(params.region) && getString(params.region)?.toUpperCase() !== "US") ||
    Boolean(language) ||
    Boolean(year) ||
    ratingMin !== 0 ||
    ratingMax !== 10 ||
    runtimeMin !== 0 ||
    runtimeMax !== 300 ||
    Boolean(watchProvider) ||
    Boolean(preset) ||
    Boolean(mood);
  const hrefParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => typeof value === "string" && value !== ""),
  ) as Record<string, string>;
  const moodOptions = Object.entries(MOOD_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
    description: config.description,
  }));
  const isSearchMode = Boolean(query);

  return (
    <div className="cinema-grain min-h-screen bg-dark-bg">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10">
        <PageBreadcrumb
          breadcrumbs={[
            { link: "/", label: "Home", isActive: false },
            { link: "/discover", label: "Discover", isActive: true },
          ]}
        />

        <div className="flex flex-col gap-5 rounded-[32px] border border-border/60 bg-background/35 px-5 py-6 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] uppercase tracking-[0.34em] text-muted-foreground">Catalogue des films</p>
              <h1 className="mt-3 font-display text-4xl tracking-[0.08em] text-light-text sm:text-5xl">
                Discover the archive
              </h1>
              <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                Search by title, seed the catalogue with a mood, or refine the holdings by region, duration,
                language, and streaming availability.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-full px-5">
                <Link href="/watchlist">Open watchlist</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full px-5">
                <Link href="/">Return home</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)] xl:gap-8">
          <DiscoverFiltersCard
            preset={preset}
            query={query}
            mood={mood ?? ""}
            sortBy={sortBy}
            region={region}
            ratingMin={ratingMin}
            ratingMax={ratingMax}
            runtimeMin={runtimeMin}
            runtimeMax={runtimeMax}
            hasActiveFilters={hasActiveFilters}
            genre={genre}
            language={language}
            year={year}
            watchProvider={watchProvider}
            providerOptions={providerOptions.map((provider) => ({
              value: String(provider.provider_id),
              label: provider.provider_name,
              logoPath: provider.logo_path,
            }))}
            genreOptions={GENRES}
            languageOptions={LANGUAGE_OPTIONS}
            moodOptions={moodOptions}
            sortOptions={SORT_OPTIONS}
            regionOptions={REGION_OPTIONS}
          />

          <section className="min-w-0 space-y-5">
            <div className="rounded-[30px] border border-border/60 bg-background/35 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.16)] backdrop-blur">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Current dossier
                  </p>
                  <h2 className="font-display text-2xl tracking-[0.06em] text-foreground sm:text-3xl">
                    {isSearchMode
                      ? `${results.results.length} visible match${results.results.length === 1 ? "" : "es"}`
                      : `${results.total_results.toLocaleString()} titles in circulation`}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {isSearchMode
                      ? `Search record for “${query}” in region ${region}, ordered by ${
                          SORT_OPTIONS.find(([value]) => value === sortBy)?.[1] ?? "circulation"
                        }.`
                      : `Ordered by ${SORT_OPTIONS.find(([value]) => value === sortBy)?.[1] ?? "Circulation"} for region ${region}.`}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {query ? <Badge variant="secondary">Search: {query}</Badge> : null}
                  {preset ? <Badge variant="secondary">Preset: {preset.replace("_", " ")}</Badge> : null}
                  {moodConfig ? <Badge variant="outline">Mood: {moodConfig.label}</Badge> : null}
                  {genre
                    ? <Badge variant="outline">Genre selected</Badge>
                    : null}
                  {watchProvider
                    ? <Badge variant="outline">Provider matched</Badge>
                    : null}
                  {hasActiveFilters && !preset && !genre && !watchProvider && !query && !moodConfig
                    ? <Badge variant="outline">Manual refinement</Badge>
                    : null}
                  {moodConfig ? (
                    <Button asChild variant="ghost" size="sm" className="h-7 rounded-full px-3 text-xs">
                      <Link href={buildParamsWithout(params, "mood")}>Clear mood</Link>
                    </Button>
                  ) : null}
                </div>
              </div>
              <Separator className="my-4 bg-border/60" />
              <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Page {results.page} of {results.total_pages.toLocaleString()}
                </p>
                <p>
                  {moodConfig
                    ? `${moodConfig.description} You can override any seeded control without losing the rest of the dossier.`
                    : "Use the sidebar to refine genre, score, runtime, language, mood, year, and provider without leaving the grid."}
                </p>
              </div>
            </div>

            <ScrollArea className="h-auto">
              {results.results.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {results.results.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              ) : (
                <div className="rounded-[30px] border border-dashed border-border/70 bg-background/30 px-6 py-14 text-center">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground">No current holdings</p>
                  <h3 className="mt-4 font-display text-2xl tracking-[0.06em] text-light-text">
                    No titles fit this viewing brief
                  </h3>
                  <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                    Ease the filters, remove the current mood seed, or widen the search title to bring more films back
                    into the catalogue.
                  </p>
                </div>
              )}
            </ScrollArea>
            <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
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
                          className="rounded-full"
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
          </section>
        </div>
      </div>
    </div>
  );
}
