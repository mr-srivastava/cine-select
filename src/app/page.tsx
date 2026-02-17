import MovieSearch from "@/components/MovieSearch";

export default async function Home() {
  return (
    <div className="cinema-grain flex min-h-screen flex-col items-center justify-center bg-dark-bg">
      <div className="relative z-10 flex flex-col items-center gap-6 px-4">
        <h1 className="font-display text-5xl font-bold tracking-tight text-light-text opacity-0 animate-fade-in-up sm:text-6xl">
          CineSelect
        </h1>
        <p className="text-muted-foreground opacity-0 animate-fade-in-up animate-fade-in-up-delay-1 text-center text-lg">
          Search and discover movies
        </p>
        <div className="w-full max-w-md opacity-0 animate-fade-in-up animate-fade-in-up-delay-2">
          <MovieSearch />
        </div>
      </div>
    </div>
  );
}
