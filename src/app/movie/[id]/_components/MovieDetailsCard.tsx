import type {
  Movie,
  ProductionCompany,
  ProductionCountry,
  SpokenLanguage,
} from "@/types/tmdb";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber } from "@/lib/format.util";

/** Common ISO 639-1 language codes to readable names */
const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  hi: "Hindi",
  ar: "Arabic",
  ru: "Russian",
};

function languageLabel(lang: SpokenLanguage): string {
  return lang.english_name ?? lang.name ?? lang.iso_639_1;
}

function originalLanguageLabel(code: string): string {
  const lower = code.toLowerCase();
  return LANGUAGE_NAMES[lower] ?? code.toUpperCase();
}

type MovieDetailsCardProps = {
  movie: Movie;
};

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 rounded-[20px] border border-border/50 bg-background/35 px-4 py-3 sm:flex-row sm:gap-4">
      <dt className="shrink-0 font-display text-sm uppercase tracking-[0.18em] text-muted-foreground sm:w-40">
        {label}
      </dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  );
}

function Section({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <h2 className="mb-3 font-display text-xl font-semibold uppercase tracking-[0.1em] text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function MovieDetailsCard({ movie }: MovieDetailsCardProps) {
  const languages = movie.spoken_languages.filter((l) => languageLabel(l));
  const hasBoxOffice = movie.budget > 0 || movie.revenue > 0;
  const showOriginalTitle =
    movie.original_title && movie.original_title !== movie.title;
  const hasFacts =
    showOriginalTitle ||
    movie.original_language ||
    movie.status ||
    movie.adult;
  const hasLinks = movie.homepage || movie.imdb_id;
  const hasCollection = movie.belongs_to_collection;
  const hasOriginCountry =
    Array.isArray(movie.origin_country) && movie.origin_country.length > 0;

  const anim = "opacity-0 animate-fade-in-up animate-fade-in-up-delay-2";

  return (
    <div className="flex flex-col gap-8">
      <div className={anim}>
        <p className="text-[11px] uppercase tracking-[0.34em] text-muted-foreground">Synopsis</p>
        <p className="mt-4 text-lg leading-relaxed text-foreground">{movie.overview}</p>
      </div>

      <Separator
        className={`${anim} animate-fade-in-up-delay-1`}
        aria-hidden
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
        {hasFacts && (
          <Section title="Record details" className={anim}>
            <dl className="flex flex-col gap-3">
              {showOriginalTitle && (
                <DetailRow label="Original title" value={movie.original_title!} />
              )}
              {movie.original_language && (
                <DetailRow
                  label="Original language"
                  value={originalLanguageLabel(movie.original_language)}
                />
              )}
              {movie.status && (
                <DetailRow
                  label="Status"
                  value={
                    <Badge
                      variant="secondary"
                      className="w-fit text-xs font-semibold text-secondary-foreground"
                    >
                      {movie.status}
                    </Badge>
                  }
                />
              )}
              {movie.adult && (
                <DetailRow
                  label="Audience"
                  value={
                    <Badge
                      variant="outline"
                      className="w-fit text-xs text-muted-foreground"
                    >
                      Adult
                    </Badge>
                  }
                />
              )}
              {movie.vote_count > 0 && !hasBoxOffice && (
                <DetailRow
                  label="Votes"
                  value={`Based on ${formatNumber(movie.vote_count)} votes`}
                />
              )}
            </dl>
          </Section>
        )}

        {hasBoxOffice && (
          <Section title="Commercial trace" className={anim}>
            <dl className="flex flex-col gap-3">
              {movie.budget > 0 && (
                <DetailRow label="Budget" value={formatCurrency(movie.budget)} />
              )}
              {movie.revenue > 0 && (
                <DetailRow
                  label="Revenue"
                  value={formatCurrency(movie.revenue)}
                />
              )}
              {movie.vote_count > 0 && (
                <p className="text-sm text-muted-foreground pt-1">
                  Based on {formatNumber(movie.vote_count)} votes
                </p>
              )}
            </dl>
          </Section>
        )}

        {hasCollection && (
          <Section
            title="Series placement"
            className={`md:col-span-2 ${anim}`}
          >
            <p className="text-sm text-muted-foreground">
              Filed as part of the {movie.belongs_to_collection!.name} collection.
            </p>
          </Section>
        )}

        <Section title="Production companies" className={anim}>
          {movie.production_companies.length > 0 ? (
            <ul className="flex flex-col gap-1.5">
              {movie.production_companies.map((company: ProductionCompany) => (
                <li
                  key={company.id}
                  className="text-sm text-muted-foreground"
                >
                  {company.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">—</p>
          )}
        </Section>

        <Section title="Production countries" className={anim}>
          {movie.production_countries.length > 0 ? (
            <ul className="flex flex-col gap-1.5">
              {movie.production_countries.map(
                (country: ProductionCountry) => (
                  <li
                    key={country.iso_3166_1}
                    className="text-sm text-muted-foreground"
                  >
                    {country.name}
                  </li>
                )
              )}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">—</p>
          )}
        </Section>

        {hasOriginCountry && (
          <Section title="Country of origin" className={anim}>
            <p className="text-sm text-muted-foreground">
              {movie.origin_country.join(", ")}
            </p>
          </Section>
        )}

        <Section
          title="Spoken languages"
          className={`opacity-0 animate-fade-in-up animate-fade-in-up-delay-3 ${hasOriginCountry ? "" : "md:col-span-2"}`}
        >
          {languages.length > 0 ? (
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
              {languages.map((language) => (
                <li
                  key={language.iso_639_1}
                  className="text-sm text-muted-foreground"
                >
                  {languageLabel(language)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">—</p>
          )}
        </Section>

        {hasLinks && (
          <div
            className={`flex flex-wrap items-center gap-3 md:col-span-2 opacity-0 animate-fade-in-up animate-fade-in-up-delay-3`}
          >
            {movie.homepage && (
              <a
                href={movie.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary rounded-full px-5 transition-transform duration-200 hover:scale-[1.02]"
              >
                Official website
              </a>
            )}
            {movie.imdb_id && (
              <a
                href={`https://www.imdb.com/title/${movie.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-border bg-transparent px-4 py-2 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-muted"
              >
                IMDb dossier
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
