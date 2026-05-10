"use client";

import * as React from "react";
import Link from "next/link";
import { Bookmark, CalendarDays, Clapperboard, Filter, Globe2, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import DiscoverRangeFilters from "./DiscoverRangeFilters";
import SearchablePicker from "./SearchablePicker";

export type PickerOption = {
  label: string;
  value: string;
  logoPath?: string | null;
};

type DiscoverFiltersCardProps = {
  preset: string | undefined;
  query: string;
  mood: string;
  sortBy: string;
  region: string;
  ratingMin: number;
  ratingMax: number;
  runtimeMin: number;
  runtimeMax: number;
  hasActiveFilters: boolean;
  genre: string;
  language: string;
  year: string;
  watchProvider: string;
  providerOptions: PickerOption[];
  genreOptions: ReadonlyArray<readonly [string, string]>;
  languageOptions: ReadonlyArray<readonly [string, string]>;
  moodOptions: PickerOption[];
  sortOptions: ReadonlyArray<readonly [string, string]>;
  regionOptions: ReadonlyArray<string>;
};

function SidebarForm({
  preset,
  query,
  mood,
  sortBy,
  region,
  ratingMin,
  ratingMax,
  runtimeMin,
  runtimeMax,
  hasActiveFilters,
  genre,
  language,
  year,
  watchProvider,
  providerOptions,
  genreOptions,
  languageOptions,
  moodOptions,
  sortOptions,
  regionOptions,
  mode,
  onSubmit,
}: DiscoverFiltersCardProps & {
  mode: "desktop" | "mobile";
  onSubmit?: () => void;
}) {
  const [selectedRegion, setSelectedRegion] = React.useState(region);

  React.useEffect(() => {
    setSelectedRegion(region);
  }, [region]);

  return (
    <form className="flex h-full flex-col" method="get" onSubmit={onSubmit}>
      {preset ? <input name="preset" defaultValue={preset} hidden /> : null}
      <input name="page" defaultValue="1" hidden />
      <input name="region" value={selectedRegion} readOnly hidden />

      <div className="space-y-6">
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            <Sparkles className="size-3.5" />
            Opening cues
          </div>
          <div className="space-y-4">
            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              Title search
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  name="q"
                  defaultValue={query}
                  placeholder="Search a title or fragment..."
                  className="h-11 rounded-full border-border/70 bg-background/80 pl-10"
                />
              </div>
            </label>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              Mood
              <SearchablePicker
                name="mood"
                value={mood}
                placeholder="Choose a viewing mood"
                emptyLabel="No moods found."
                clearLabel="No mood seed"
                options={moodOptions}
              />
            </div>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              Genre
              <SearchablePicker
                name="genre"
                value={genre}
                placeholder="All genres"
                emptyLabel="No genres found."
                clearLabel="All genres"
                options={genreOptions.map(([value, label]) => ({ value, label }))}
              />
            </div>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              Sort by
              <Select name="sort_by" defaultValue={sortBy}>
                <SelectTrigger className="h-11 rounded-full border-border/70 bg-background/80 px-4 shadow-sm">
                  <SelectValue placeholder="Circulation" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border/70">
                  {sortOptions.map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              Language
              <SearchablePicker
                name="language"
                value={language}
                placeholder="Any original language"
                emptyLabel="No languages found."
                clearLabel="Any original language"
                options={languageOptions.map(([value, label]) => ({ value, label }))}
              />
            </div>
          </div>
        </section>

        <Separator className="bg-border/60" />

        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            <Globe2 className="size-3.5" />
            Territory
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/60 p-3">
            <RadioGroup
              value={selectedRegion}
              onValueChange={setSelectedRegion}
              className="grid grid-cols-2 gap-2"
            >
              {regionOptions.map((value) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-3 rounded-[18px] border border-border/70 bg-background/80 px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/50 hover:bg-background"
                >
                  <RadioGroupItem value={value} id={`${mode}-region-${value}`} />
                  <span>{value}</span>
                </label>
              ))}
            </RadioGroup>
          </div>
        </section>

        <Separator className="bg-border/60" />

        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            <SlidersHorizontal className="size-3.5" />
            Running profile
          </div>
          <DiscoverRangeFilters
            ratingMin={ratingMin}
            ratingMax={ratingMax}
            runtimeMin={runtimeMin}
            runtimeMax={runtimeMax}
            compact
          />
        </section>

        <Separator className="bg-border/60" />

        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            <CalendarDays className="size-3.5" />
            Availability
          </div>
          <div className="space-y-4">
            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              Release year
              <Input
                name="year"
                defaultValue={year}
                placeholder="2025"
                className="h-11 rounded-full border-border/70 bg-background/80"
              />
            </label>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              Provider
              <SearchablePicker
                name="watch_provider"
                value={watchProvider}
                placeholder="Any provider"
                emptyLabel="No providers found."
                clearLabel="Any provider"
                options={providerOptions}
              />
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-border/60 pt-5">
        <Button type="submit" className="h-11 w-full rounded-full">
          Apply dossier
        </Button>
        {hasActiveFilters ? (
          <Button asChild variant="ghost" className="w-full rounded-full">
            <Link href="/discover">Reset catalogue</Link>
          </Button>
        ) : null}
      </div>
    </form>
  );
}

export default function DiscoverFiltersCard({
  preset,
  query,
  mood,
  sortBy,
  region,
  ratingMin,
  ratingMax,
  runtimeMin,
  runtimeMax,
  hasActiveFilters,
  genre,
  language,
  year,
  watchProvider,
  providerOptions,
  genreOptions,
  languageOptions,
  moodOptions,
  sortOptions,
  regionOptions,
}: DiscoverFiltersCardProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <>
      <div className="lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="h-11 w-full justify-between rounded-full border-border/70 bg-background/70 px-4 shadow-sm"
            >
              <span className="flex items-center gap-2">
                <Filter className="size-4" />
                Open catalogue tools
              </span>
              {hasActiveFilters ? <Badge variant="secondary">Active</Badge> : null}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[92vw] overflow-y-auto border-border/70 bg-dark-bg p-0 sm:max-w-md">
            <div className="flex min-h-full flex-col">
              <SheetHeader className="border-b border-border/60 px-5 py-5">
                <SheetTitle className="text-left text-xl">Refine the archive</SheetTitle>
                <SheetDescription className="text-left">
                  Seed the catalogue by title or mood, then narrow by region, score, runtime, and availability.
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 px-5 py-5">
                <SidebarForm
                  preset={preset}
                  query={query}
                  mood={mood}
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
                  providerOptions={providerOptions}
                  genreOptions={genreOptions}
                  languageOptions={languageOptions}
                  moodOptions={moodOptions}
                  sortOptions={sortOptions}
                  regionOptions={regionOptions}
                  mode="mobile"
                  onSubmit={() => setMobileOpen(false)}
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-6 overflow-hidden rounded-[28px] border border-border/60 bg-background/45 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur">
          <div className="border-b border-border/60 bg-gradient-to-br from-background/80 via-background/40 to-transparent px-6 py-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                <Clapperboard className="size-3.5" />
                Catalogue controls
              </div>
              <Button asChild variant="ghost" size="sm" className="rounded-full px-3">
                <Link href="/watchlist">
                  <Bookmark className="size-4" />
                  Watchlist
                </Link>
              </Button>
            </div>
            <h2 className="mt-3 font-display text-2xl tracking-[0.06em] text-foreground">Assemble a screening brief</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Build a tighter programme with title search, mood seeding, region, score, runtime, and provider filters.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {preset ? <Badge variant="secondary">Preset: {preset.replace("_", " ")}</Badge> : null}
              {mood ? <Badge variant="outline">Mood seeded</Badge> : null}
              {hasActiveFilters ? <Badge variant="outline">Live refinement</Badge> : null}
            </div>
          </div>
          <div className="p-6">
            <SidebarForm
              preset={preset}
              query={query}
              mood={mood}
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
              providerOptions={providerOptions}
              genreOptions={genreOptions}
              languageOptions={languageOptions}
              moodOptions={moodOptions}
              sortOptions={sortOptions}
              regionOptions={regionOptions}
              mode="desktop"
            />
          </div>
        </div>
      </aside>
    </>
  );
}
