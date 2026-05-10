export default function Loading() {
  return (
    <div className="cinema-grain flex h-screen items-center justify-center bg-dark-bg px-4">
      <div role="status" aria-live="polite" aria-busy="true" className="text-center">
        <div
          className="h-12 w-12 animate-spin rounded-full border-2 border-cinema-accent border-t-transparent"
          aria-hidden
        />
        <p className="mt-4 text-[11px] uppercase tracking-[0.34em] text-muted-foreground">
          Preparing dossier
        </p>
        <span className="sr-only">Loading…</span>
      </div>
    </div>
  );
}
