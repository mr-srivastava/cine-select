import Link from "next/link";

export default function MovieNotFound() {
  return (
    <div className="cinema-grain flex min-h-screen flex-col items-center justify-center bg-dark-bg px-4 text-center">
      <p className="font-display text-sm uppercase tracking-[0.35em] text-muted-foreground">
        Not found
      </p>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-light-text sm:text-5xl">
        We could not find that movie
      </h1>
      <p className="mt-3 max-w-md text-base text-muted-foreground">
        The movie may have been removed, or the link might be incorrect.
      </p>
      <Link href="/" className="btn-primary mt-8">
        Back to home
      </Link>
    </div>
  );
}
