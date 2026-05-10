"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="cinema-grain flex h-screen flex-col items-center justify-center bg-dark-bg px-4">
      <p className="text-[11px] uppercase tracking-[0.34em] text-muted-foreground">Archive interruption</p>
      <h2 className="font-display mb-4 mt-4 text-center text-2xl font-bold uppercase tracking-[0.08em] text-light-text">
        The dossier could not be assembled
      </h2>
      <p className="mb-6 max-w-md text-center text-destructive">{error.message}</p>
      <button onClick={() => reset()} className="btn-primary">
        Try again
      </button>
    </div>
  );
}
