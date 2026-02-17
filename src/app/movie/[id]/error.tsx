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
      <h2 className="font-display mb-4 text-2xl font-bold text-light-text">
        Something went wrong!
      </h2>
      <p className="mb-6 text-destructive">{error.message}</p>
      <button onClick={() => reset()} className="btn-primary">
        Try again
      </button>
    </div>
  );
}
