export default function Loading() {
  return (
    <div className="cinema-grain flex h-screen items-center justify-center bg-dark-bg px-4">
      <div
        className="h-12 w-12 animate-spin rounded-full border-2 border-cinema-accent border-t-transparent"
        aria-hidden
      />
    </div>
  );
}
