import { fetchMovieCredits, fetchMovieRecommendations, fetchMovieWatchProviders } from "@/actions/tmdb.actions";
import MovieCard from "@/components/MovieCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { IMAGE_BLUR_DATA_URL, tmdbImageUrl } from "@/lib/image";
import type { MovieCreditCast, MovieSearchResult, WatchProviderCountryInfo } from "@/types/tmdb";
import Image from "next/image";
import Link from "next/link";

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-2xl text-light-text">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function PersonCard({ person, role }: { person: MovieCreditCast; role?: string }) {
  return (
    <Button asChild variant="ghost" className="h-auto w-[110px] flex-shrink-0 p-0">
      <Link href={`/person/${person.id}`} className="group flex flex-col items-start">
        <div className="relative aspect-[2/3] w-[110px] overflow-hidden rounded-lg bg-muted ring-1 ring-white/10">
          {person.profile_path ? (
            <Image
              src={tmdbImageUrl(person.profile_path, "w500")}
              alt={person.name}
              fill
              sizes="110px"
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_DATA_URL}
              className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted via-muted to-background text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              CS
            </div>
          )}
        </div>
        <div className="mt-2 space-y-0.5">
          <p className="line-clamp-2 text-sm font-medium text-light-text group-hover:text-primary">{person.name}</p>
          {role ? <p className="text-xs text-muted-foreground">{role}</p> : null}
        </div>
      </Link>
    </Button>
  );
}

function ProviderBadge({ type, provider }: { type: string; provider: { provider_id: number; provider_name: string; logo_path: string | null } }) {
  return (
    <Badge variant="secondary" className="gap-2 px-3 py-2">
      {provider.logo_path ? (
        <Image
          src={tmdbImageUrl(provider.logo_path, "w92")}
          alt={provider.provider_name}
          width={20}
          height={20}
          className="size-5 rounded object-cover"
        />
      ) : null}
      <span>{provider.provider_name}</span>
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{type}</span>
    </Badge>
  );
}

function providerRows(info: WatchProviderCountryInfo | undefined) {
  return {
    flatrate: info?.flatrate ?? [],
    rent: info?.rent ?? [],
    buy: info?.buy ?? [],
    ads: info?.ads ?? [],
    free: info?.free ?? [],
  };
}

export default async function MovieExtraSections({ movieId }: { movieId: number }) {
  const [recommendations, credits, providers] = await Promise.all([
    fetchMovieRecommendations(movieId),
    fetchMovieCredits(movieId),
    fetchMovieWatchProviders(movieId),
  ]);

  const providerInfo = providers.results.US ?? providers.results.GB ?? Object.values(providers.results)[0];
  const rows = providerRows(providerInfo);
  const director = credits.crew.find((member) => member.job === "Director");
  const writer = credits.crew.find((member) => member.job === "Writer" || member.job === "Screenplay");
  const cast = credits.cast.slice(0, 8);

  return (
    <div className="mt-8 flex flex-col gap-6">
      <SectionCard title="Recommended for you">
        {recommendations.results.length > 0 ? (
          <ScrollArea className="w-full">
            <div className="custom-scrollbar flex gap-4 pb-2">
              {recommendations.results.slice(0, 12).map((movie) => (
                <MovieCard key={movie.id} movie={movie as MovieSearchResult} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <p className="text-sm text-muted-foreground">No recommendations are available for this title yet.</p>
        )}
      </SectionCard>

      <SectionCard title="Where to watch">
        {providerInfo ? (
          <div className="flex flex-col gap-4">
            {providerInfo.link ? (
              <a href={providerInfo.link} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground underline">
                Open TMDB provider page
              </a>
            ) : null}
            <div className="flex flex-wrap gap-3">
              {(Object.entries(rows) as Array<[keyof typeof rows, typeof rows.flatrate]>).flatMap(([type, list]) =>
                list.map((provider) => <ProviderBadge key={`${type}-${provider.provider_id}`} type={type} provider={provider} />)
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No watch-provider data is available for this title.</p>
        )}
      </SectionCard>

      <SectionCard title="Cast">
        {cast.length > 0 ? (
          <ScrollArea className="w-full">
            <div className="custom-scrollbar flex gap-4 pb-2">
              {cast.map((member) => (
                <PersonCard key={member.id} person={member} role={member.character} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <p className="text-sm text-muted-foreground">No cast information is available for this title.</p>
        )}
      </SectionCard>

      {(director || writer) ? (
        <SectionCard title="Key crew">
          <div className="flex flex-wrap gap-3">
            {director ? <Badge variant="secondary">Director: {director.name}</Badge> : null}
            {writer ? <Badge variant="secondary">Writer: {writer.name}</Badge> : null}
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}
