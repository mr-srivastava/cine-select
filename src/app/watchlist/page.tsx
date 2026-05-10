import type { Metadata } from "next";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import WatchlistPageClient from "@/components/WatchlistPageClient";

export const metadata: Metadata = {
  title: "Watchlist",
  description: "A saved shelf of films to revisit on CineSelect.",
};

export default function WatchlistPage() {
  return (
    <div className="cinema-grain min-h-screen bg-dark-bg">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10">
        <PageBreadcrumb
          breadcrumbs={[
            { link: "/", label: "Home", isActive: false },
            { link: "/watchlist", label: "Watchlist", isActive: true },
          ]}
        />

        <div className="flex flex-col gap-3">
          <p className="text-[11px] uppercase tracking-[0.34em] text-muted-foreground">Cinémathèque personnelle</p>
          <h1 className="font-display text-4xl tracking-[0.08em] text-light-text sm:text-5xl">
            Your saved program
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            A personal dossier of titles held back for a later screening, a better hour, or a deeper look.
          </p>
        </div>

        <WatchlistPageClient />
      </div>
    </div>
  );
}
