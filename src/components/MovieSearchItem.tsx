import { CommandItem } from "./ui/command";
import { MovieSearchResult } from "@/types/tmdb";
import Image from "next/image";
import { IMAGE_BLUR_DATA_URL, tmdbImageUrl } from "@/lib/image";
import { useRouter } from "next/navigation";

export const MovieSearchItem = ({ movie }: { movie: MovieSearchResult }) => {
  const router = useRouter();

  return (
    <CommandItem
      value={`${movie.title}-${movie.id}`}
      onSelect={() => {
        router.push(`/movie/${movie.id}`);
      }}
      className="flex items-center gap-4 px-4 py-2 transition-colors duration-150 data-[selected]:bg-accent"
    >
      <MovieSearchItemImage imagePath={movie.poster_path} altText={movie.title} />
      <div className='flex flex-col'>
        <span className='font-medium'>{movie.title}</span>
        {movie.release_date ? (
          <span className="text-sm text-muted-foreground">
            {movie.release_date.split("-")[0]}
          </span>
        ) : null}
      </div>
    </CommandItem>
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
    <div className="flex-shrink-0 overflow-hidden rounded bg-muted">
      {imagePath ? (
        <Image
          src={tmdbImageUrl(imagePath, "w92")}
          alt={altText}
          width={32}
          height={48}
          sizes="32px"
          placeholder="blur"
          blurDataURL={IMAGE_BLUR_DATA_URL}
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          className="flex h-12 w-8 items-center justify-center bg-gradient-to-br from-muted via-muted to-background text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
          aria-hidden="true"
        >
          CS
        </div>
      )}
    </div>
  );
};
