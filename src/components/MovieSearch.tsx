"use client";

import Link from "next/link";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { searchMovies } from "@/actions/tmdb.actions";
import { useRef, useState } from "react";
import { MovieSearchResult } from "@/types/tmdb";
import { ArrowRight, Loader2 } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { MovieSearchItem } from "./MovieSearchItem";

export default function MovieSearch() {
  const [movies, setMovies] = useState<MovieSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const requestIdRef = useRef(0);

  const debouncedSearch = useDebouncedCallback(async (value: string) => {
    const requestId = ++requestIdRef.current;
    if (value) {
      setIsLoading(true);
      try {
        const results = await searchMovies(value);
        if (requestId === requestIdRef.current) {
          setMovies(results);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    } else {
      setMovies([]);
      setIsLoading(false);
    }
  }, 300);

  const handleSearch = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  return (
    <Command className="max-w-[720px] rounded-[30px] border border-border/80 bg-popover/95 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.65)] backdrop-blur transition-shadow duration-200 hover:shadow-[0_24px_72px_-24px_rgba(0,0,0,0.72)] md:min-w-[520px]">
      <CommandInput
        value={inputValue}
        onValueChange={handleSearch}
        placeholder="Search a title and open its dossier..."
      />
      {inputValue && (
        <CommandList>
          {isLoading ? (
            <div className="py-6 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <CommandEmpty>
                {inputValue.trim()
                  ? `No titles surfaced for "${inputValue}".`
                  : "Begin typing to call up a film record."}
              </CommandEmpty>
              {movies.length > 0 && (
                <CommandGroup heading="Matching dossiers">
                  {movies.map((movie) => (
                    <MovieSearchItem key={movie.id} movie={movie} />
                  ))}
                </CommandGroup>
              )}
              {inputValue.trim() ? (
                <>
                  <CommandSeparator />
                  <Link
                    href={`/discover?q=${encodeURIComponent(inputValue.trim())}`}
                    className="flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <span>See all results in the catalogue</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </>
              ) : null}
            </>
          )}
        </CommandList>
      )}
    </Command>
  );
}
