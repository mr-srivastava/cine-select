"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { searchMovies } from "@/actions/tmdb.actions";
import { useState } from "react";
import { Movie } from "@/types/tmdb";
import { Loader2 } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import Link from "next/link";

export default function MovieSearch() {
  const [movies, setMovies] = useState<Movie[]>([]);
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
    <Command className="rounded-lg border max-w-[600px] shadow-md md:min-w-[450px]">
      <CommandInput
        value={inputValue}
        onValueChange={handleSearch}
        placeholder="Search movies..."
      />
      {inputValue && (
        <CommandList>
          {isLoading ? (
            <div className="py-6 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
            </div>
          ) : (
            <>
              <CommandEmpty>
                {inputValue === ""
                  ? "Start typing to search movies..."
                  : "No results found."}
              </CommandEmpty>
              {movies.length > 0 && (
                <CommandGroup heading="Movies">
                  {movies.map((movie) => (
                    <Link key={movie.id} href={`/movie/${movie.id}`}>
                      <CommandItem
                        value={`${movie.title}-${movie.id}`} // Modified to include movie.id for uniqueness
                        className="flex items-center gap-4 px-4 py-2"
                      >
                        <div className="flex-shrink-0 w-8 h-12 bg-muted rounded overflow-hidden">
                          {movie.poster_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                              alt={movie.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              🎬
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{movie.title}</span>
                          <span className="text-sm text-muted-foreground">
                            {movie.release_date?.split("-")[0]}
                          </span>
                        </div>
                      </CommandItem>
                    </Link>
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
