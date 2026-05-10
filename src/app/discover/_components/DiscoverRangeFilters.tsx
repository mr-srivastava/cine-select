"use client";

import * as React from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

type RangeProps = {
  ratingMin: number;
  ratingMax: number;
  runtimeMin: number;
  runtimeMax: number;
  compact?: boolean;
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
  compact,
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
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "flex flex-col gap-3 rounded-[24px] border border-border/70 bg-background/70 p-4"
          : "flex flex-col gap-4 rounded-[24px] border border-border/80 bg-background/60 p-4 shadow-sm"
      }
    >
      <div className={compact ? "flex flex-col gap-3" : "flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between"}>
        <div className="space-y-1">
          <p className="font-display text-base tracking-[0.04em] text-foreground">{title}</p>
          <p className={compact ? "text-xs leading-5 text-muted-foreground" : "max-w-[16rem] text-xs leading-5 text-muted-foreground"}>
            {description}
          </p>
        </div>
        <div className={compact ? "flex items-center gap-2" : "flex flex-wrap items-center gap-2 xl:justify-end"}>
          <Input
            value={value[0]}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (Number.isFinite(next)) {
                onValueChange([Math.min(next, value[1]), value[1]]);
              }
            }}
            inputMode="numeric"
            className={compact ? "h-9 w-20" : "w-20"}
          />
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">to</span>
          <Input
            value={value[1]}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (Number.isFinite(next)) {
                onValueChange([value[0], Math.max(next, value[0])]);
              }
            }}
            inputMode="numeric"
            className={compact ? "h-9 w-20" : "w-20"}
          />
          {suffix ? <span className="text-xs text-muted-foreground">{suffix}</span> : null}
        </div>
      </div>

      <div className="px-1">
        <Slider
          min={min}
          max={max}
          step={step}
          value={value}
          onValueChange={(next) => onValueChange([next[0] ?? min, next[1] ?? max])}
        />
      </div>

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
  compact = false,
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
    <div className={compact ? "grid gap-3" : "grid gap-4 lg:grid-cols-2"}>
      <RangeField
        title="Rating"
        description="Narrow the catalogue by average TMDB standing."
        min={0}
        max={10}
        value={ratingRange}
        onValueChange={setRatingRange}
        suffix="/ 10"
        step={0.1}
        nameMin="rating_min"
        nameMax="rating_max"
        compact={compact}
      />
      <RangeField
        title="Runtime"
        description="Limit the programme by running time in minutes."
        min={0}
        max={300}
        value={runtimeRange}
        onValueChange={setRuntimeRange}
        suffix="min"
        step={5}
        nameMin="runtime_min"
        nameMax="runtime_max"
        compact={compact}
      />
    </div>
  );
}
