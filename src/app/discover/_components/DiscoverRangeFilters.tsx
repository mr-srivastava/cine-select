"use client";

import * as React from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

type RangeProps = {
  ratingMin: number;
  ratingMax: number;
  runtimeMin: number;
  runtimeMax: number;
};

function RangeField({
  title,
  description,
  min,
  max,
  value,
  onValueChange,
  suffix,
  step,
  nameMin,
  nameMax,
}: {
  title: string;
  description: string;
  min: number;
  max: number;
  value: [number, number];
  onValueChange: (next: [number, number]) => void;
  suffix?: string;
  step: number;
  nameMin: string;
  nameMax: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-background p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={value[0]}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (Number.isFinite(next)) {
                onValueChange([Math.min(next, value[1]), value[1]]);
              }
            }}
            inputMode="numeric"
            className="w-20"
          />
          <span className="text-xs text-muted-foreground">to</span>
          <Input
            value={value[1]}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (Number.isFinite(next)) {
                onValueChange([value[0], Math.max(next, value[0])]);
              }
            }}
            inputMode="numeric"
            className="w-20"
          />
          {suffix ? <span className="text-xs text-muted-foreground">{suffix}</span> : null}
        </div>
      </div>

      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={(next) => onValueChange([next[0] ?? min, next[1] ?? max])}
      />

      <input type="hidden" name={nameMin} value={value[0]} />
      <input type="hidden" name={nameMax} value={value[1]} />
    </div>
  );
}

export default function DiscoverRangeFilters({
  ratingMin,
  ratingMax,
  runtimeMin,
  runtimeMax,
}: RangeProps) {
  const [ratingRange, setRatingRange] = React.useState<[number, number]>([ratingMin, ratingMax]);
  const [runtimeRange, setRuntimeRange] = React.useState<[number, number]>([runtimeMin, runtimeMax]);

  React.useEffect(() => {
    setRatingRange([ratingMin, ratingMax]);
  }, [ratingMin, ratingMax]);

  React.useEffect(() => {
    setRuntimeRange([runtimeMin, runtimeMax]);
  }, [runtimeMin, runtimeMax]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <RangeField
        title="Rating"
        description="Filter movies by average TMDB score."
        min={0}
        max={10}
        value={ratingRange}
        onValueChange={setRatingRange}
        suffix="/ 10"
        step={0.1}
        nameMin="rating_min"
        nameMax="rating_max"
      />
      <RangeField
        title="Runtime"
        description="Filter movies by duration in minutes."
        min={0}
        max={300}
        value={runtimeRange}
        onValueChange={setRuntimeRange}
        suffix="min"
        step={5}
        nameMin="runtime_min"
        nameMax="runtime_max"
      />
    </div>
  );
}
