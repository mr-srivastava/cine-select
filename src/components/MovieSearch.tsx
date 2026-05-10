"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList
} from "@/components/ui/command";
import { searchMovies } from "@/actions/tmdb.actions";
import { useRef, useState } from "react";
import { MovieSearchResult } from "@/types/tmdb";
import { Loader2 } from "lucide-react";
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
    <Command className="max-w-[600px] rounded-xl border border-border/80 bg-popover/95 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.65)] backdrop-blur transition-shadow duration-200 hover:shadow-[0_24px_72px_-24px_rgba(0,0,0,0.72)] md:min-w-[450px]">
      <CommandInput
        value={inputValue}
        onValueChange={handleSearch}
        placeholder="Search movies..."
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
                  ? `No results found for "${inputValue}".`
                  : "Start typing to search for a title, actor, or keyword."}
              </CommandEmpty>
              {movies.length > 0 && (
                <CommandGroup heading="Movies">
                  {movies.map((movie) => (
                    <MovieSearchItem key={movie.id} movie={movie} />
                  ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      )}
    </Command>
  );
}
