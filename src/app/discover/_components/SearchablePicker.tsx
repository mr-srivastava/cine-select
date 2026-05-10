"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IMAGE_BLUR_DATA_URL, tmdbImageUrl } from "@/lib/image";

export type PickerOption = {
  label: string;
  value: string;
  logoPath?: string | null;
  description?: string;
};

type SearchablePickerProps = {
  name: string;
  options: PickerOption[];
  value?: string;
  placeholder: string;
  emptyLabel: string;
  clearLabel?: string;
  searchPlaceholder?: string;
};

export default function SearchablePicker({
  name,
  options,
  value,
  placeholder,
  emptyLabel,
  clearLabel = "All options",
  searchPlaceholder,
}: SearchablePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value ?? "");
  const selected = options.find((option) => option.value === selectedValue);

  React.useEffect(() => {
    setSelectedValue(value ?? "");
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-11 w-full justify-between rounded-xl border-border/70 bg-background/80 px-4 text-left shadow-sm"
        >
          <span className={cn("truncate", !selected && "text-muted-foreground")}>
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[280px] rounded-[24px] border-border/70 p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder ?? `Search ${placeholder.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>{emptyLabel}</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value={clearLabel}
                onSelect={() => {
                  setSelectedValue("");
                  setOpen(false);
                }}
                className="flex items-center justify-between"
              >
                <span>{clearLabel}</span>
                <Check className={cn("opacity-0", !selectedValue && "opacity-100")} />
              </CommandItem>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={`${option.label} ${option.description ?? ""}`}
                  onSelect={() => {
                    setSelectedValue(option.value);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    {option.logoPath ? (
                      <Image
                        src={tmdbImageUrl(option.logoPath, "w92")}
                        alt={option.label}
                        width={20}
                        height={20}
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR_DATA_URL}
                        className="size-5 rounded object-cover"
                      />
                    ) : null}
                    <span className="flex flex-col">
                      <span>{option.label}</span>
                      {option.description ? (
                        <span className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                          {option.description}
                        </span>
                      ) : null}
                    </span>
                  </span>
                  <Check
                    className={cn("opacity-0", option.value === selectedValue && "opacity-100")}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
      <input type="hidden" name={name} value={selectedValue} />
    </Popover>
  );
}
