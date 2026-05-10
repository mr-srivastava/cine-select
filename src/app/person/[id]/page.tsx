import { fetchPersonDetails, fetchPersonMovieCredits } from "@/actions/tmdb.actions";
import MovieCard, { MovieCard as MovieCardParts } from "@/components/MovieCard";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { tmdbImageUrl } from "@/lib/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

function buildDescription(name: string, biography: string) {
  const base = biography.trim();
  if (base) return base.length > 155 ? `${base.slice(0, 152)}...` : base;
  return `Browse filmography and credits for ${name} on CineSelect.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const numericId = Number(id);
  if (!/^\d+$/.test(id) || !Number.isInteger(numericId)) {
    return { title: "Person not found" };
  }

  try {
    const person = await fetchPersonDetails(numericId);
    return {
      title: person.name,
      description: buildDescription(person.name, person.biography),
      openGraph: {
        title: person.name,
        description: buildDescription(person.name, person.biography),
        images: person.profile_path ? [{ url: tmdbImageUrl(person.profile_path, "w500"), alt: person.name }] : undefined,
      },
    };
  } catch {
    return { title: "Person not found" };
  }
}

export default async function PersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!/^\d+$/.test(id) || !Number.isInteger(numericId)) {
    notFound();
  }

  let person;
  try {
    person = await fetchPersonDetails(numericId);
  } catch {
    notFound();
  }

  const credits = await fetchPersonMovieCredits(numericId);
  const filmographyById = new Map<number, (typeof credits.cast)[number]>();

  for (const credit of [...credits.cast, ...credits.crew]) {
    const existing = filmographyById.get(credit.id);
    if (!existing) {
      filmographyById.set(credit.id, credit);
      continue;
    }

    const existingDate = existing.release_date ?? "";
    const nextDate = credit.release_date ?? "";
    if (nextDate > existingDate) {
      filmographyById.set(credit.id, credit);
    }
  }

  const filmography = Array.from(filmographyById.values())
    .sort((a, b) => (b.release_date ?? "").localeCompare(a.release_date ?? ""))
    .slice(0, 24);

  return (
    <div className="cinema-grain min-h-screen bg-dark-bg">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10">
        <PageBreadcrumb
          breadcrumbs={[
            { link: "/", label: "Home", isActive: false },
            { link: `/person/${person.id}`, label: person.name, isActive: true },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="space-y-4">
            <MovieCardParts.Poster
              poster_path={person.profile_path}
              title={person.name}
              sizes="240px"
              containerClassName="rounded-xl"
              fallbackClassName="text-2xl font-semibold uppercase tracking-[0.3em]"
              fallback={<span>{person.name.slice(0, 2)}</span>}
            />
            {person.homepage ? (
              <a href={person.homepage} target="_blank" rel="noreferrer" className="btn-primary w-full">
                Official site
              </a>
            ) : null}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="font-display text-sm uppercase tracking-[0.35em] text-muted-foreground">
                {person.known_for_department}
              </p>
              <h1 className="font-display text-4xl font-bold tracking-tight text-light-text sm:text-5xl">
                {person.name}
              </h1>
              <p className="max-w-3xl text-muted-foreground">
                {buildDescription(person.name, person.biography)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {person.birthday ? <span className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">Born {person.birthday}</span> : null}
              {person.place_of_birth ? <span className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">{person.place_of_birth}</span> : null}
            </div>

            <section className="space-y-4">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-light-text">
                Filmography
              </h2>
              {filmography.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                  {filmography.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No filmography entries available.</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
