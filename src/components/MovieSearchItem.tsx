import Link from "next/link";
import { CommandItem } from "./ui/command";
import { MovieSearchResult } from "@/types/tmdb";
import Image from "next/image";

export const MovieSearchItem = ({ movie }: { movie: MovieSearchResult }) => {
  return (
    <Link href={`/movie/${movie.id}`}>
      <CommandItem
        value={`${movie.title}-${movie.id}`}
        className="flex items-center gap-4 px-4 py-2 transition-colors duration-150 data-[selected]:bg-accent"
      >
        <MovieSearchItemImage
          imagePath={movie.poster_path}
          altText={movie.title}
        />
        <div className='flex flex-col'>
          <span className='font-medium'>{movie.title}</span>
          <span className='text-sm text-muted-foreground'>
            {movie.release_date?.split("-")[0]}
          </span>
        </div>
      </CommandItem>
    </Link>
  );
};

const MovieSearchItemImage = ({
  imagePath,
  altText
}: {
  imagePath: string | null;
  altText: string;
}) => {
  return (
    <div className='flex-shrink-0 w-8 h-12 bg-muted rounded overflow-hidden'>
      {imagePath ? (
        <Image
          src={`https://image.tmdb.org/t/p/w92${imagePath}`}
          alt={altText}
          width={32}
          height={48}
          className='w-full h-full object-cover'
        />
      ) : (
        <div className='w-full h-full flex items-center justify-center bg-muted'>
          🎬
        </div>
      )}
    </div>
  );
};
