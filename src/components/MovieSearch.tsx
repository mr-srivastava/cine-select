"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList
} from "@/components/ui/command";
import { searchMovies } from "@/actions/tmdb.actions";
import { useState } from "react";
import { MovieSearchResult } from "@/types/tmdb";
import { Loader2 } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { MovieSearchItem } from "./MovieSearchItem";

export default function MovieSearch() {
  const [movies, setMovies] = useState<MovieSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const debouncedSearch = useDebouncedCallback(async (value: string) => {
    if (value) {
      setIsLoading(true);
      try {
        const results = await searchMovies(value);
        setMovies(results);
      } finally {
        setIsLoading(false);
      }
    } else {
      setMovies([]);
    }
  }, 300);

  const handleSearch = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  return (
    <Command className='rounded-lg border max-w-[600px] shadow-md md:min-w-[450px]'>
      <CommandInput
        value={inputValue}
        onValueChange={handleSearch}
        placeholder='Search movies...'
      />
      {inputValue && (
        <CommandList>
          {isLoading ? (
            <div className='py-6 text-center'>
              <Loader2 className='h-6 w-6 animate-spin mx-auto text-muted-foreground' />
            </div>
          ) : (
            <>
              <CommandEmpty>No results found.</CommandEmpty>
              {movies.length > 0 && (
                <CommandGroup heading='Movies'>
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
