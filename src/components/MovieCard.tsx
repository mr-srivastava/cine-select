import { MovieSearchResult } from "@/types/tmdb";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { formatReleaseDate } from "@/lib/datetime.util";

interface MovieCardRootProps {
  movieId: number;
  children: ReactNode;
  className?: string;
}

function MovieCardRoot({ movieId, children, className }: MovieCardRootProps) {
  return (
    <Link
      href={`/movie/${movieId}`}
      className={cn("group flex w-[140px] flex-shrink-0 flex-col transition-transform duration-200 hover:scale-[1.02] sm:w-[160px]", className)}
    >
      {children}
    </Link>
  );
}

interface MovieCardPosterProps {
  poster_path: string | null;
  title: string;
  sizes?: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackClassName?: string;
}

function MovieCardPoster({
  poster_path,
  title,
  sizes,
  width,
  height,
  className = "",
  fallbackClassName = "",
}: MovieCardPosterProps) {
  const containerClassName = width && height 
    ? "" 
    : "relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-muted ring-1 ring-white/10";

  if (poster_path) {
    if (width && height) {
      // Fixed size mode (for page.tsx)
      return (
        <Image
          src={`https://image.tmdb.org/t/p/w500${poster_path}`}
          alt={title}
          width={width}
          height={height}
          className={className}
        />
      );
    } else {
      // Fill mode (for card usage)
      return (
        <div className={containerClassName}>
          <Image
            src={`https://image.tmdb.org/t/p/w500${poster_path}`}
            alt={title}
            fill
            sizes={sizes || "(max-width: 640px) 140px, 160px"}
            className={cn("object-cover transition-opacity duration-200 group-hover:opacity-90", className)}
          />
        </div>
      );
    }
  }

  // Fallback when no poster_path
  const fallbackStyle = width && height ? { width, height } : undefined;
  return (
    <div 
      className={cn(containerClassName, "flex h-full w-full items-center justify-center text-4xl text-muted-foreground", fallbackClassName)}
      style={fallbackStyle}
    >
      🎬
    </div>
  );
}

interface MovieCardRatingProps {
  vote_average: number | null | undefined;
  className?: string;
}

function MovieCardRating({ vote_average, className }: MovieCardRatingProps) {
  if (vote_average == null || vote_average <= 0) return null;

  return (
    <Badge className={cn("absolute right-2 top-2 gap-1 bg-black/70 text-white border-0", className)}>
      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
      {vote_average.toFixed(1)}
    </Badge>
  );
}

interface MovieCardContentProps {
  children: ReactNode;
  className?: string;
}

function MovieCardContent({ children, className }: MovieCardContentProps) {
  return (
    <div className={cn("mt-2 flex flex-col gap-0.5", className)}>
      {children}
    </div>
  );
}

interface MovieCardTitleProps {
  title: string;
  className?: string;
}

function MovieCardTitle({ title, className }: MovieCardTitleProps) {
  return (
    <span className={cn("line-clamp-2 text-sm font-medium text-light-text group-hover:text-primary", className)}>
      {title}
    </span>
  );
}

interface MovieCardReleaseDateProps {
  release_date?: string;
  className?: string;
}

function MovieCardReleaseDate({ release_date, className }: MovieCardReleaseDateProps) {
  if (!release_date) return null;

  return (
    <span className={cn("text-xs text-muted-foreground", className)}>
      {formatReleaseDate(release_date)}
    </span>
  );
}

// Compound component structure
const MovieCard = Object.assign(MovieCardRoot, {
  Root: MovieCardRoot,
  Poster: MovieCardPoster,
  Rating: MovieCardRating,
  Content: MovieCardContent,
  Title: MovieCardTitle,
  ReleaseDate: MovieCardReleaseDate,
});

// Convenience component for common use case
interface MovieCardDefaultProps {
  movie: MovieSearchResult;
}

function MovieCardDefault({ movie }: MovieCardDefaultProps) {
  return (
    <MovieCard.Root movieId={movie.id}>
      <div className="relative">
        <MovieCard.Poster
          poster_path={movie.poster_path}
          title={movie.title}
          sizes="(max-width: 640px) 140px, 160px"
        />
        <MovieCard.Rating vote_average={movie.vote_average} />
      </div>
      <MovieCard.Content>
        <MovieCard.Title title={movie.title} />
        <MovieCard.ReleaseDate release_date={movie.release_date} />
      </MovieCard.Content>
    </MovieCard.Root>
  );
}

// Export default as the convenience component, and named exports for composition
export default MovieCardDefault;
export { MovieCard };
