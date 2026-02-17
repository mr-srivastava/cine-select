import type { ProductionCompany, ProductionCountry, SpokenLanguage } from "@/types/tmdb";

type MovieDetailsCardProps = {
  overview: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  homepage: string | null;
};

function languageLabel(lang: SpokenLanguage): string {
  return lang.english_name ?? lang.name ?? lang.iso_639_1;
}

export function MovieDetailsCard({
  overview,
  production_companies,
  production_countries,
  spoken_languages,
  homepage,
}: MovieDetailsCardProps) {
  const languages = spoken_languages.filter((l) => languageLabel(l));

  return (
    <>
      <p className="text-lg mb-6">{overview}</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Production Companies</h2>
          <ul className="list-disc list-inside">
            {production_companies.map((company) => (
              <li key={company.id}>{company.name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Production Countries</h2>
          <ul className="list-disc list-inside">
            {production_countries.map((country) => (
              <li key={country.iso_3166_1}>{country.name}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Spoken Languages</h2>
        <ul className="list-disc list-inside">
          {languages.map((language) => (
            <li key={language.iso_639_1}>{languageLabel(language)}</li>
          ))}
        </ul>
      </div>
      {homepage ? (
        <div className="mt-6">
          <a
            href={homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Official Homepage
          </a>
        </div>
      ) : null}
    </>
  );
}
