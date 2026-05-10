import { MovieSearchResult } from "@/types/tmdb";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { formatReleaseDate } from "@/lib/datetime.util";
import { IMAGE_BLUR_DATA_URL, tmdbImageUrl } from "@/lib/image";

interface MovieCardRootProps {
  movieId: number;
  children: ReactNode;
  className?: string;
}

function MovieCardRoot({ movieId, children, className }: MovieCardRootProps) {
  return (
    <Link
      href={`/movie/${movieId}`}
      className={cn("group flex w-[150px] flex-shrink-0 flex-col transition-transform duration-200 hover:translateY(-2px) sm:w-[172px]", className)}
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
  containerClassName?: string;
  fallbackClassName?: string;
  fallback?: ReactNode;
  imageSize?: "w92" | "w500" | "original";
}

function MovieCardPoster({
  poster_path,
  title,
  sizes,
  width,
  height,
  className = "",
  containerClassName = "",
  fallbackClassName = "",
  fallback,
  imageSize = "w500",
}: MovieCardPosterProps) {
  const posterContainerClassName = width && height
    ? ""
    : "relative aspect-[2/3] w-full overflow-hidden rounded-[22px] bg-muted ring-1 ring-white/10";
  const fallbackStyle = width && height ? { width, height } : undefined;
  const defaultFallback = (
    <span className="flex flex-col items-center gap-1">
      <span className="text-3xl leading-none">CineSelect</span>
      <span className="text-[10px] uppercase tracking-[0.35em]">No poster</span>
    </span>
  );

  if (poster_path) {
    if (width && height) {
      return (
        <Image
          src={tmdbImageUrl(poster_path, imageSize)}
          alt={title}
          width={width}
          height={height}
          placeholder="blur"
          blurDataURL={IMAGE_BLUR_DATA_URL}
          className={className}
        />
      );
    } else {
      return (
        <div className={cn(posterContainerClassName, containerClassName)}>
          <Image
            src={tmdbImageUrl(poster_path, imageSize)}
            alt={title}
            fill
            sizes={sizes || "(max-width: 640px) 140px, 160px"}
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
            className={cn("object-cover transition-all duration-300 group-hover:scale-[1.02] group-hover:opacity-90", className)}
          />
        </div>
      );
    }
  }

  return (
    <div
      className={cn(
        posterContainerClassName,
        containerClassName,
        "flex h-full w-full items-center justify-center bg-gradient-to-br from-muted via-muted to-background text-muted-foreground",
        fallbackClassName
      )}
      style={fallbackStyle}
      aria-hidden="true"
    >
      {fallback ?? defaultFallback}
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
    <Badge className={cn("absolute left-2 top-2 gap-1 border border-white/10 bg-black/65 text-white", className)}>
      <Star className="h-3 w-3 fill-primary text-primary" />
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
    <div className={cn("mt-3 flex flex-col gap-1", className)}>
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
    <span className={cn("line-clamp-2 font-display text-base uppercase tracking-[0.06em] text-light-text group-hover:text-primary", className)}>
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
    <span className={cn("text-xs uppercase tracking-[0.2em] text-muted-foreground", className)}>
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
