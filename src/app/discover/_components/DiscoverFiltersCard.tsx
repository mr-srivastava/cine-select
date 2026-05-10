"use client";

import Link from "next/link";
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
import DiscoverRangeFilters from "./DiscoverRangeFilters";
import SearchablePicker from "./SearchablePicker";

export type PickerOption = {
  label: string;
  value: string;
  logoPath?: string | null;
};

type DiscoverFiltersCardProps = {
  preset: string | undefined;
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
  sortOptions: ReadonlyArray<readonly [string, string]>;
  regionOptions: ReadonlyArray<string>;
};

export default function DiscoverFiltersCard({
  preset,
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
  sortOptions,
  regionOptions,
}: DiscoverFiltersCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-2 border-b border-border/60 bg-background/40">
        <CardTitle className="text-lg">Filters</CardTitle>
        <CardDescription className="max-w-2xl">
          Adjust the discovery controls and refine the result grid.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 p-6">
        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-12" method="get">
          {preset ? <input name="preset" defaultValue={preset} hidden /> : null}
          <input name="page" defaultValue="1" hidden />

          <div className="flex flex-col gap-2 text-sm text-muted-foreground xl:col-span-3">
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

          <label className="flex flex-col gap-2 text-sm text-muted-foreground xl:col-span-3">
            Sort by
            <Select name="sort_by" defaultValue={sortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Popularity" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-muted-foreground xl:col-span-3">
            Region
            <Select name="region" defaultValue={region}>
              <SelectTrigger>
                <SelectValue placeholder="US" />
              </SelectTrigger>
              <SelectContent>
                {regionOptions.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-muted-foreground xl:col-span-3">
            Language
            <Input name="language" defaultValue={language} placeholder="en" />
          </label>

          <label className="flex flex-col gap-2 text-sm text-muted-foreground xl:col-span-3">
            Release year
            <Input name="year" defaultValue={year} placeholder="2025" />
          </label>

          <div className="xl:col-span-6">
            <DiscoverRangeFilters
              ratingMin={ratingMin}
              ratingMax={ratingMax}
              runtimeMin={runtimeMin}
              runtimeMax={runtimeMax}
            />
          </div>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground xl:col-span-3">
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

          <div className="flex items-end xl:col-span-3">
            <Button type="submit" className="w-full">
              Apply filters
            </Button>
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-1">
          {preset ? <Badge variant="secondary">Preset: {preset.replace("_", " ")}</Badge> : null}
          {hasActiveFilters ? (
            <Button asChild variant="ghost" size="sm">
              <Link href="/discover">Clear filters</Link>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
